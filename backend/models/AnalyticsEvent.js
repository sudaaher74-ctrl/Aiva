const mongoose = require('mongoose');

const analyticsEventSchema = new mongoose.Schema({
  eventType: { 
    type: String, 
    required: true,
    enum: ['page_view', 'form_submit', 'product_click']
  },
  pageUrl: { type: String, required: true },
  countryCode: { type: String },
  visitorId: { type: String },
  metadata: { type: mongoose.Schema.Types.Mixed }
}, { timestamps: true });

module.exports = mongoose.model('AnalyticsEvent', analyticsEventSchema);
