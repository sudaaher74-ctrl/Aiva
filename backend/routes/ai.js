const express = require('express');
const router = express.Router();
const { GoogleGenerativeAI } = require('@google/generative-ai');
const { protect } = require('../middleware/auth');
const Conversation = require('../models/Conversation');

// Models for ERP data access
const Inquiry = require('../models/Inquiry');
const Customer = require('../models/Customer');
const Product = require('../models/Product');
const Inventory = require('../models/Inventory');
const Quotation = require('../models/Quotation');
const PurchaseOrder = require('../models/PurchaseOrder');

// ============================================================
// SYSTEM PROMPT — Company AI Persona (Phase 2 Enhanced)
// ============================================================
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

CRM AI CAPABILITIES:
When the user asks you to generate follow-up emails, WhatsApp messages, or call scripts:
- Use the lead/customer data provided in context
- Make messages professional, warm, and export-industry appropriate
- Include specific product references if available
- For emails: Use proper subject line, greeting, body, CTA, and signature from Aiva Enterprises
- For WhatsApp: Keep it concise, friendly, professional
- For call scripts: Include opener, discovery questions, value proposition, close

QUOTATION AI CAPABILITIES:
When asked to create or draft a quotation:
- Use actual product data and pricing from the ERP
- Include proper Incoterms (FOB, CIF, CFR), HS Codes where available
- Consider buyer country for shipping/compliance
- Suggest appropriate payment terms
- Format as a professional quotation summary

EXPORT INTELLIGENCE (LIVE WEB SEARCH):
When asked about live export markets, current news, trade regulations, or shipping:
- **USE YOUR GOOGLE SEARCH TOOL** to fetch real-time information from the web.
- You have live internet access! Use it to search for: "APEDA latest circulars", "FDA import alerts India", "Live freight rates to Dubai", "Current USD to INR exchange rate".
- Provide insights based on the real-time news you fetch.
- Reference official sources like DGFT, APEDA, FSSAI, FDA (for US), and EU food safety regulations.
- ALWAYS include URLs to the sources you found so the user can verify them.

LEAD SCORING:
When asked to score or analyze leads:
- Consider: country (tier 1 vs emerging), company size, product interest, inquiry detail, source
- Score leads as: Hot (80-100), Warm (50-79), Cold (0-49)
- Recommend specific follow-up actions for each lead

BUSINESS ANALYSIS:
- Calculate conversion rates, growth trends, revenue analysis
- Compare periods (month over month, year over year)
- Identify top-performing products, countries, customers
- Spot risks: declining leads, overdue POs, low inventory
`;


// ============================================================
// ERP DATA GATHERING — Query relevant data based on intent
// ============================================================
async function gatherERPContext(message) {
  const lowerMsg = message.toLowerCase();
  let context = '';
  const dataPackets = {};

  try {
    // --- Leads / Inquiries / CRM ---
    if (lowerMsg.match(/lead|inquir|contact|new.*customer|prospect|follow.?up|crm|email|whatsapp|call.*script|score.*lead|conversion|pipeline/)) {
      const today = new Date(); today.setHours(0, 0, 0, 0);
      const thisMonth = new Date(today.getFullYear(), today.getMonth(), 1);

      const [totalLeads, todayLeads, newLeads, contactedLeads, quotedLeads, closedLeads, lostLeads, recentLeads, monthlyLeads] = await Promise.all([
        Inquiry.countDocuments(),
        Inquiry.countDocuments({ createdAt: { $gte: today } }),
        Inquiry.countDocuments({ status: 'New' }),
        Inquiry.countDocuments({ status: 'Contacted' }),
        Inquiry.countDocuments({ status: 'Quoted' }),
        Inquiry.countDocuments({ status: 'Closed' }),
        Inquiry.countDocuments({ status: 'Lost' }),
        Inquiry.find().sort({ createdAt: -1 }).limit(10).lean(),
        Inquiry.countDocuments({ createdAt: { $gte: thisMonth } })
      ]);

      context += `\n--- LEADS/INQUIRIES DATA ---\n`;
      context += `Total Leads: ${totalLeads}\n`;
      context += `Today's Leads: ${todayLeads}\n`;
      context += `This Month's Leads: ${monthlyLeads}\n`;
      context += `Status Breakdown: New(${newLeads}), Contacted(${contactedLeads}), Quoted(${quotedLeads}), Closed(${closedLeads}), Lost(${lostLeads})\n`;
      context += `Recent Leads: ${JSON.stringify(recentLeads.map(l => ({ name: l.name, company: l.company, country: l.country, product: l.product, status: l.status, date: l.createdAt })))}\n`;

      // Country breakdown
      const countryStats = await Inquiry.aggregate([
        { $group: { _id: '$country', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 10 }
      ]);
      context += `Top Countries: ${JSON.stringify(countryStats)}\n`;
      dataPackets.leads = { totalLeads, todayLeads, monthlyLeads, newLeads, contactedLeads, quotedLeads, closedLeads, lostLeads };
    }

    // --- Customers ---
    if (lowerMsg.match(/customer|buyer|client|revenue|top.*customer|best.*customer/)) {
      const [totalCustomers, customers] = await Promise.all([
        Customer.countDocuments(),
        Customer.find().sort({ createdAt: -1 }).limit(20).lean()
      ]);

      context += `\n--- CUSTOMERS DATA ---\n`;
      context += `Total Customers: ${totalCustomers}\n`;
      context += `Customers: ${JSON.stringify(customers.map(c => ({ name: c.company_name, contact: c.contact_person, email: c.email, country: c.country })))}\n`;
      dataPackets.customers = { totalCustomers };
    }

    // --- Products ---
    if (lowerMsg.match(/product|item|catalog|stock|mango|fruit|pulp|aseptic|iqf|frozen/)) {
      const [totalProducts, activeProducts, products] = await Promise.all([
        Product.countDocuments(),
        Product.countDocuments({ status: 'Active' }),
        Product.find().lean()
      ]);

      context += `\n--- PRODUCTS DATA ---\n`;
      context += `Total Products: ${totalProducts}, Active: ${activeProducts}\n`;
      context += `Products: ${JSON.stringify(products.map(p => ({ name: p.name, category: p.category, tab: p.tab, status: p.status })))}\n`;
      dataPackets.products = { totalProducts, activeProducts };
    }

    // --- Inventory ---
    if (lowerMsg.match(/inventor|stock|warehouse|low.*stock|out.*stock|quantit|batch|expir|reorder/)) {
      const [totalItems, lowStock, outOfStock, inventoryItems] = await Promise.all([
        Inventory.countDocuments(),
        Inventory.countDocuments({ status: 'Low Stock' }),
        Inventory.countDocuments({ status: 'Out of Stock' }),
        Inventory.find().populate('product', 'name category').sort({ quantity: 1 }).limit(20).lean()
      ]);

      context += `\n--- INVENTORY DATA ---\n`;
      context += `Total Items: ${totalItems}, Low Stock: ${lowStock}, Out of Stock: ${outOfStock}\n`;
      context += `Items: ${JSON.stringify(inventoryItems.map(i => ({ product: i.product?.name, warehouse: i.warehouseLocation, batch: i.batchNumber, qty: i.quantity, unit: i.unit, status: i.status, expiry: i.expiryDate })))}\n`;
      dataPackets.inventory = { totalItems, lowStock, outOfStock };
    }

    // --- Quotations ---
    if (lowerMsg.match(/quotation|quote|proposal|quot.*pending|quot.*sent|quot.*accept/)) {
      const [totalQuotations, draftQ, sentQ, acceptedQ, rejectedQ, recentQuotations] = await Promise.all([
        Quotation.countDocuments(),
        Quotation.countDocuments({ status: 'Draft' }),
        Quotation.countDocuments({ status: 'Sent' }),
        Quotation.countDocuments({ status: 'Accepted' }),
        Quotation.countDocuments({ status: 'Rejected' }),
        Quotation.find().populate('customer_id', 'company_name').sort({ createdAt: -1 }).limit(10).lean()
      ]);

      context += `\n--- QUOTATIONS DATA ---\n`;
      context += `Total: ${totalQuotations}, Draft: ${draftQ}, Sent: ${sentQ}, Accepted: ${acceptedQ}, Rejected: ${rejectedQ}\n`;
      context += `Recent Quotations: ${JSON.stringify(recentQuotations.map(q => ({ customer: q.customer_id?.company_name, status: q.status, amount: q.total_amount, date: q.createdAt })))}\n`;
      dataPackets.quotations = { totalQuotations, draftQ, sentQ, acceptedQ, rejectedQ };
    }

    // --- Purchase Orders ---
    if (lowerMsg.match(/purchase.*order|po\b|p\.o|vendor|supplier|pending.*po|po.*pending|overdue|outstanding|shipment/)) {
      const [totalPOs, recentPOs] = await Promise.all([
        PurchaseOrder.countDocuments(),
        PurchaseOrder.find().sort({ createdAt: -1 }).limit(10).lean()
      ]);

      const statusAgg = await PurchaseOrder.aggregate([
        { $group: { _id: '$status', count: { $sum: 1 }, totalValue: { $sum: '$totalAmount' } } }
      ]);

      const totalRevenue = await PurchaseOrder.aggregate([
        { $match: { status: { $nin: ['Draft'] } } },
        { $group: { _id: null, total: { $sum: '$totalAmount' } } }
      ]);

      const countryBreakdown = await PurchaseOrder.aggregate([
        { $group: { _id: '$buyerCountry', count: { $sum: 1 }, value: { $sum: '$totalAmount' } } },
        { $sort: { value: -1 } },
        { $limit: 10 }
      ]);

      context += `\n--- PURCHASE ORDERS DATA ---\n`;
      context += `Total POs: ${totalPOs}\n`;
      context += `Status Breakdown: ${JSON.stringify(statusAgg)}\n`;
      context += `Total Revenue: ${totalRevenue.length > 0 ? totalRevenue[0].total : 0}\n`;
      context += `Country Breakdown: ${JSON.stringify(countryBreakdown)}\n`;
      context += `Recent POs: ${JSON.stringify(recentPOs.map(po => ({ poNumber: po.poNumber, buyer: po.buyerCompany, country: po.buyerCountry, status: po.status, amount: po.totalAmount, date: po.createdAt })))}\n`;
      dataPackets.purchaseOrders = { totalPOs, statusAgg, totalRevenue: totalRevenue.length > 0 ? totalRevenue[0].total : 0 };
    }

    // --- Dashboard / Revenue / General ---
    if (lowerMsg.match(/dashboard|revenue|profit|sale|overview|summary|today|performance|kpi|report|analytic|money|earning/)) {
      const today = new Date(); today.setHours(0, 0, 0, 0);
      const thisMonth = new Date(today.getFullYear(), today.getMonth(), 1);
      const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
      const lastMonthEnd = new Date(today.getFullYear(), today.getMonth(), 0);

      const [totalLeads, todayLeads, monthLeads, totalPOs, totalCustomers, totalProducts] = await Promise.all([
        Inquiry.countDocuments(),
        Inquiry.countDocuments({ createdAt: { $gte: today } }),
        Inquiry.countDocuments({ createdAt: { $gte: thisMonth } }),
        PurchaseOrder.countDocuments(),
        Customer.countDocuments(),
        Product.countDocuments({ status: 'Active' })
      ]);

      const poRevenue = await PurchaseOrder.aggregate([
        { $match: { status: { $nin: ['Draft'] } } },
        { $group: { _id: null, total: { $sum: '$totalAmount' } } }
      ]);

      const thisMonthRevenue = await PurchaseOrder.aggregate([
        { $match: { createdAt: { $gte: thisMonth }, status: { $nin: ['Draft'] } } },
        { $group: { _id: null, total: { $sum: '$totalAmount' } } }
      ]);

      const lastMonthRevenue = await PurchaseOrder.aggregate([
        { $match: { createdAt: { $gte: lastMonth, $lte: lastMonthEnd }, status: { $nin: ['Draft'] } } },
        { $group: { _id: null, total: { $sum: '$totalAmount' } } }
      ]);

      const lowStock = await Inventory.countDocuments({ status: { $in: ['Low Stock', 'Out of Stock'] } });

      context += `\n--- DASHBOARD / OVERVIEW DATA ---\n`;
      context += `Total Leads: ${totalLeads}, Today: ${todayLeads}, This Month: ${monthLeads}\n`;
      context += `Total Customers: ${totalCustomers}\n`;
      context += `Total Active Products: ${totalProducts}\n`;
      context += `Total Purchase Orders: ${totalPOs}\n`;
      context += `Total Revenue (all time): ${poRevenue.length > 0 ? poRevenue[0].total : 0}\n`;
      context += `This Month Revenue: ${thisMonthRevenue.length > 0 ? thisMonthRevenue[0].total : 0}\n`;
      context += `Last Month Revenue: ${lastMonthRevenue.length > 0 ? lastMonthRevenue[0].total : 0}\n`;
      context += `Low/Out of Stock Items: ${lowStock}\n`;
      dataPackets.dashboard = { totalLeads, todayLeads, monthLeads, totalCustomers, totalProducts, totalPOs, lowStock };
    }

    // If no specific match, provide general overview
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

// ============================================================
// AI RESPONSE GENERATION
// ============================================================
async function generateAIResponse(userMessage, conversationHistory, erpContext) {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return {
      content: `⚠️ **AI API Key Not Configured**\n\nTo enable AI responses, please add your Google Gemini API key to the backend \`.env\` file:\n\n\`\`\`\nGEMINI_API_KEY=your_api_key_here\n\`\`\`\n\nYou can get a free API key from [Google AI Studio](https://aistudio.google.com/apikey).\n\n---\n\n**In the meantime, here is the raw ERP data I found:**\n\n\`\`\`\n${erpContext}\n\`\`\``,
      isKeyMissing: true
    };
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    // Build conversation for Gemini
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
      content: `❌ **AI Error**: ${err.message || 'Failed to generate response'}.\n\nPlease check your API key and try again.\n\n**Raw ERP Data:**\n\`\`\`\n${erpContext}\n\`\`\``,
      isKeyMissing: false
    };
  }
}

// ============================================================
// POST /api/ai/chat — Main AI chat endpoint
// ============================================================
router.post('/chat', protect, async (req, res) => {
  try {
    const { message, conversationId } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({ success: false, message: 'Message is required' });
    }

    // Gather ERP data context
    const { context: erpContext, dataPackets } = await gatherERPContext(message);

    // Get conversation history if continuing
    let conversationHistory = [];
    let conversation = null;

    if (conversationId) {
      conversation = await Conversation.findOne({ _id: conversationId, userId: req.user.id });
      if (conversation) {
        conversationHistory = conversation.messages;
      }
    }

    // Generate AI response
    const aiResponse = await generateAIResponse(message, conversationHistory, erpContext);

    // Save to conversation
    if (!conversation) {
      // Create new conversation with first message as title
      const title = message.length > 60 ? message.substring(0, 60) + '...' : message;
      conversation = new Conversation({
        title,
        messages: [],
        userId: req.user.id
      });
    }

    // Add messages
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
  } catch (error) {
    console.error('AI Chat Error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// ============================================================
// GET /api/ai/conversations — List conversations
// ============================================================
router.get('/conversations', protect, async (req, res) => {
  try {
    const conversations = await Conversation.find({ userId: req.user.id })
      .select('title pinned createdAt updatedAt messages')
      .sort({ pinned: -1, updatedAt: -1 })
      .lean();

    // Add message count and last message preview
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
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ============================================================
// GET /api/ai/conversations/:id — Get single conversation
// ============================================================
router.get('/conversations/:id', protect, async (req, res) => {
  try {
    const conversation = await Conversation.findOne({
      _id: req.params.id,
      userId: req.user.id
    });

    if (!conversation) {
      return res.status(404).json({ success: false, message: 'Conversation not found' });
    }

    res.json({ success: true, data: conversation });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ============================================================
// PATCH /api/ai/conversations/:id — Update (pin/rename)
// ============================================================
router.patch('/conversations/:id', protect, async (req, res) => {
  try {
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
      return res.status(404).json({ success: false, message: 'Conversation not found' });
    }

    res.json({ success: true, data: conversation });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ============================================================
// DELETE /api/ai/conversations/:id — Delete conversation
// ============================================================
router.delete('/conversations/:id', protect, async (req, res) => {
  try {
    const conversation = await Conversation.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id
    });

    if (!conversation) {
      return res.status(404).json({ success: false, message: 'Conversation not found' });
    }

    res.json({ success: true, message: 'Conversation deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ============================================================
// GET /api/ai/suggestions — Quick question suggestions
// ============================================================
router.get('/suggestions', protect, async (req, res) => {
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

module.exports = router;
