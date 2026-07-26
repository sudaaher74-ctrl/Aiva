const { GoogleGenerativeAI } = require('@google/generative-ai');
const asyncHandler = require('express-async-handler');
const AppError = require('../utils/AppError');
const Conversation = require('../models/Conversation');
const Inquiry = require('../models/Inquiry');
const Customer = require('../models/Customer');
const Product = require('../models/Product');
const Inventory = require('../models/Inventory');
const Quotation = require('../models/Quotation');
const PurchaseOrder = require('../models/PurchaseOrder');

const SYSTEM_PROMPT = `You are AIVA AI — the intelligent business assistant for AIVA Enterprises, an Indian export company specializing in food products (frozen fruits, pulps, aseptic products).

Website: https://aivaenterprises.com

Your role is CEO Assistant, Sales Manager, Export Consultant, Purchase Manager, Business Analyst, Financial Analyst, CRM Assistant, and Global Trade Intelligence System.

IMPORTANT RULES:
1. You have access to real-time ERP data that will be provided as context.
2. Always answer based on the ACTUAL DATA provided, never make up numbers.
3. Use professional yet friendly tone.
4. Format responses with markdown: **bold**, tables, lists, headings.
5. When showing financial data, use proper currency formatting.
6. Provide actionable insights and recommendations.
7. If data is empty, say so honestly — never fabricate.
8. Keep answers concise but comprehensive.
9. Use emojis sparingly for readability (📊 📈 💰 🔔 ✅ ⚠️).

COMPANY DETAILS:
- Name: Aiva Enterprises
- Industry: Food Export (Frozen Fruits, Pulps, Aseptic Products, IQF Fruits & Vegetables)
- Location: Mumbai, Maharashtra, India
- Website: aivaenterprises.com
- GST: 27AAAAA0000A1Z5
- IEC: 0123456789
- Key Markets: Middle East, Europe, USA, UK, Japan, South Korea, Southeast Asia
`;

async function gatherERPContext(userMessage) {
  let context = '';
  const dataPackets = {};
  const lowerMsg = userMessage.toLowerCase();

  try {
    if (lowerMsg.match(/lead|inquir|prospect|contact|customer|buyer|client/)) {
      const [totalLeads, recentLeads, statusAgg, countryAgg] = await Promise.all([
        Inquiry.countDocuments(),
        Inquiry.find().sort({ createdAt: -1 }).limit(10).lean(),
        Inquiry.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }]),
        Inquiry.aggregate([{ $group: { _id: '$country', count: { $sum: 1 } } }, { $sort: { count: -1 } }, { $limit: 5 }])
      ]);

      context += `\n--- INQUIRIES / LEADS DATA ---\n`;
      context += `Total Leads: ${totalLeads}\n`;
      context += `Status Breakdown: ${JSON.stringify(statusAgg)}\n`;
      context += `Top Countries: ${JSON.stringify(countryAgg)}\n`;
      context += `Recent 10 Leads: ${JSON.stringify(recentLeads.map(l => ({ name: l.name, company: l.company, email: l.email, country: l.country, product: l.product, status: l.status, date: l.createdAt })))}\n`;
      dataPackets.inquiries = { totalLeads, statusAgg, recentLeads: recentLeads.length };
    }

    if (lowerMsg.match(/product|catalog|stock|inventory|aseptic|pulp|concentrate|iqf|fruit/)) {
      const [products, inventoryItems] = await Promise.all([
        Product.find({ status: 'Active' }).select('name category tab brix shelfLife').lean(),
        Inventory.find().populate('product', 'name').lean()
      ]);

      context += `\n--- PRODUCTS & INVENTORY DATA ---\n`;
      context += `Active Products (${products.length}): ${JSON.stringify(products)}\n`;
      context += `Current Inventory Records: ${JSON.stringify(inventoryItems.map(i => ({ product: i.product?.name, batch: i.batchNumber, qty: i.quantity, unit: i.unit, location: i.warehouseLocation, status: i.status })))}\n`;
      dataPackets.products = { activeCount: products.length, inventoryRecords: inventoryItems.length };
    }

    if (lowerMsg.match(/order|purchase|po|sales|revenue|shipment|delivery|buyer/)) {
      const [totalPOs, recentPOs, statusAgg, totalRevenue] = await Promise.all([
        PurchaseOrder.countDocuments(),
        PurchaseOrder.find().sort({ createdAt: -1 }).limit(5).lean(),
        PurchaseOrder.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }]),
        PurchaseOrder.aggregate([
          { $match: { status: { $nin: ['Draft'] } } },
          { $group: { _id: null, total: { $sum: '$totalAmount' } } }
        ])
      ]);

      context += `\n--- PURCHASE ORDERS DATA ---\n`;
      context += `Total POs: ${totalPOs}\n`;
      context += `Status Breakdown: ${JSON.stringify(statusAgg)}\n`;
      context += `Total Revenue: ${totalRevenue.length > 0 ? totalRevenue[0].total : 0}\n`;
      context += `Recent POs: ${JSON.stringify(recentPOs.map(po => ({ poNumber: po.poNumber, buyer: po.buyerCompany, country: po.buyerCountry, status: po.status, amount: po.totalAmount, date: po.createdAt })))}\n`;
      dataPackets.purchaseOrders = { totalPOs, statusAgg, totalRevenue: totalRevenue.length > 0 ? totalRevenue[0].total : 0 };
    }

    if (lowerMsg.match(/quote|quotation|price|pricing|estimate/)) {
      const [totalQuotes, recentQuotes, statusAgg] = await Promise.all([
        Quotation.countDocuments(),
        Quotation.find().sort({ createdAt: -1 }).limit(5).populate('customer_id', 'name company').lean(),
        Quotation.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }])
      ]);

      context += `\n--- QUOTATIONS DATA ---\n`;
      context += `Total Quotes: ${totalQuotes}\n`;
      context += `Status Breakdown: ${JSON.stringify(statusAgg)}\n`;
      context += `Recent Quotes: ${JSON.stringify(recentQuotes.map(q => ({ quoteId: q._id, customer: q.customer_id?.company || q.customer_id?.name, totalAmount: q.total_amount, status: q.status, date: q.createdAt })))}\n`;
      dataPackets.quotations = { totalQuotes, statusAgg };
    }

    if (!context) {
      const [totalLeads, totalCustomers, totalProducts, totalPOs] = await Promise.all([
        Inquiry.countDocuments(),
        Customer.countDocuments(),
        Product.countDocuments(),
        PurchaseOrder.countDocuments()
      ]);

      context += `\n--- GENERAL ERP OVERVIEW ---\n`;
      context += `Total Leads: ${totalLeads}\n`;
      context += `Total Customers: ${totalCustomers}\n`;
      context += `Total Products: ${totalProducts}\n`;
      context += `Total Purchase Orders: ${totalPOs}\n`;
    }

  } catch (err) {
    console.error('Error gathering ERP context:', err);
    context += '\n[Error fetching some data]\n';
  }

  return { context, dataPackets };
}

async function generateAIResponse(userMessage, conversationHistory, erpContext) {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return {
      content: `⚠️ **AI API Key Not Configured**\n\nTo enable AI responses, please add your Google Gemini API key to the backend \`.env\` file:\n\n\`\`\`\nGEMINI_API_KEY=your_api_key_here\n\`\`\`\n\n---\n\n**Raw ERP Data:**\n\`\`\`\n${erpContext}\n\`\`\``,
      isKeyMissing: true
    };
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const systemInstruction = SYSTEM_PROMPT + `\n\nCURRENT ERP DATA:\n${erpContext}\n\nCurrent Date/Time: ${new Date().toISOString()}\n`;

    const model = genAI.getGenerativeModel({ 
      model: 'gemini-2.5-flash',
      systemInstruction,
      tools: [{ googleSearch: {} }] 
    });

    const chat = model.startChat({
      history: conversationHistory.slice(-10).map(msg => ({
        role: msg.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: msg.content }]
      }))
    });

    const result = await chat.sendMessage(userMessage);
    const response = result.response;
    return { content: response.text(), isKeyMissing: false };
  } catch (err) {
    console.error('Gemini API Error:', err);
    return {
      content: `❌ **AI Error**: ${err.message || 'Failed to generate response'}.\n\n**Raw ERP Data:**\n\`\`\`\n${erpContext}\n\`\`\``,
      isKeyMissing: false
    };
  }
}

exports.chat = asyncHandler(async (req, res, next) => {
  const { message, conversationId } = req.body;

  if (!message || !message.trim()) {
    return next(new AppError('Message is required', 400));
  }

  const { context: erpContext, dataPackets } = await gatherERPContext(message);

  let conversationHistory = [];
  let conversation = null;

  if (conversationId) {
    conversation = await Conversation.findOne({ _id: conversationId, userId: req.user.id });
    if (conversation) {
      conversationHistory = conversation.messages;
    }
  }

  const aiResponse = await generateAIResponse(message, conversationHistory, erpContext);

  if (!conversation) {
    const title = message.length > 60 ? message.substring(0, 60) + '...' : message;
    conversation = new Conversation({
      title,
      messages: [],
      userId: req.user.id
    });
  }

  conversation.messages.push({ role: 'user', content: message });
  conversation.messages.push({ role: 'assistant', content: aiResponse.content, data: dataPackets });
  await conversation.save();

  res.json({
    success: true,
    data: {
      conversationId: conversation._id,
      response: aiResponse.content,
      erpData: dataPackets,
      isKeyMissing: aiResponse.isKeyMissing
    }
  });
});

exports.getConversations = asyncHandler(async (req, res, next) => {
  const conversations = await Conversation.find({ userId: req.user.id })
    .select('title pinned createdAt updatedAt messages')
    .sort({ pinned: -1, updatedAt: -1 })
    .lean();

  const result = conversations.map(c => ({
    _id: c._id,
    title: c.title,
    pinned: c.pinned,
    messageCount: c.messages?.length || 0,
    lastMessage: c.messages?.length > 0 ? c.messages[c.messages.length - 1].content?.substring(0, 80) : '',
    createdAt: c.createdAt,
    updatedAt: c.updatedAt
  }));

  res.json({ success: true, data: result });
});

exports.getConversationById = asyncHandler(async (req, res, next) => {
  const conversation = await Conversation.findOne({
    _id: req.params.id,
    userId: req.user.id
  });

  if (!conversation) {
    return next(new AppError('Conversation not found', 404));
  }

  res.json({ success: true, data: conversation });
});

exports.updateConversation = asyncHandler(async (req, res, next) => {
  const { title, pinned } = req.body;
  const update = {};
  if (title !== undefined) update.title = title;
  if (pinned !== undefined) update.pinned = pinned;

  const conversation = await Conversation.findOneAndUpdate(
    { _id: req.params.id, userId: req.user.id },
    update,
    { new: true }
  );

  if (!conversation) {
    return next(new AppError('Conversation not found', 404));
  }

  res.json({ success: true, data: conversation });
});

exports.deleteConversation = asyncHandler(async (req, res, next) => {
  const conversation = await Conversation.findOneAndDelete({
    _id: req.params.id,
    userId: req.user.id
  });

  if (!conversation) {
    return next(new AppError('Conversation not found', 404));
  }

  res.json({ success: true, message: 'Conversation deleted' });
});

exports.getSuggestions = asyncHandler(async (req, res, next) => {
  const suggestions = [
    { icon: '🌐', text: 'Fetch the latest APEDA export updates', category: 'Live Search' },
    { icon: '🚢', text: 'Check current ocean freight rates to Dubai', category: 'Live Search' },
    { icon: '✉️', text: 'Draft a follow-up email for the newest lead', category: 'CRM AI' },
    { icon: '📱', text: 'Write a WhatsApp message to our top customer', category: 'CRM AI' },
    { icon: '📄', text: 'Generate a quotation for 1 container of Mango Pulp', category: 'Quotation AI' },
    { icon: '📊', text: 'Show me today\'s business overview', category: 'Dashboard' },
    { icon: '💯', text: 'Score our recent leads', category: 'CRM AI' },
    { icon: '📈', text: 'How many leads did we get this month?', category: 'Leads' },
    { icon: '💰', text: 'What is our total revenue?', category: 'Revenue' },
    { icon: '📦', text: 'Which products have low stock?', category: 'Inventory' },
  ];

  res.json({ success: true, data: suggestions });
});
