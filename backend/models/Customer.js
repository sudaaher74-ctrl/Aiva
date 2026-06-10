const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
  company_name: { type: String, required: true },
  contact_person: { type: String },
  email: { type: String, required: true },
  phone: { type: String },
  country: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Customer', customerSchema);
