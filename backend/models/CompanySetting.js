const mongoose = require('mongoose');

const bankAccountSchema = new mongoose.Schema({
  accountName: {
    type: String,
    default: 'AIVA ENTERPRISES',
    trim: true
  },
  bankName: {
    type: String,
    default: 'HDFC Bank Ltd',
    trim: true
  },
  accountNumber: {
    type: String,
    default: '50200088281775',
    trim: true
  },
  ifscCode: {
    type: String,
    default: 'HDFC0000240',
    trim: true
  },
  swiftCode: {
    type: String,
    default: 'HDFCINBB',
    trim: true
  },
  accountType: {
    type: String,
    default: 'Current Account',
    trim: true
  },
  branch: {
    type: String,
    default: 'CBD Belapur, Navi Mumbai',
    trim: true
  }
}, { _id: false });

const companySettingSchema = new mongoose.Schema({
  key: {
    type: String,
    default: 'default',
    unique: true
  },
  companyName: {
    type: String,
    default: 'AIVA ENTERPRISES',
    trim: true
  },
  legalName: {
    type: String,
    default: 'AIVA ENTERPRISES',
    trim: true
  },
  address: {
    type: String,
    default: 'Office No. 402, Lakhani Centrium, Plot No. 27, Sector 15, CBD Belapur, Navi Mumbai - 400614, Maharashtra, India',
    trim: true
  },
  email: {
    type: String,
    default: 'info@aivaenterprises.com',
    trim: true
  },
  phone: {
    type: String,
    default: '+91 93245 42525',
    trim: true
  },
  gstin: {
    type: String,
    default: '27AAMFA3834L1ZG',
    trim: true
  },
  fssai: {
    type: String,
    default: '11524998000523',
    trim: true
  },
  iec: {
    type: String,
    default: '',
    trim: true
  },
  inrBank: {
    type: bankAccountSchema,
    default: () => ({
      accountName: 'AIVA ENTERPRISES',
      bankName: 'HDFC Bank Ltd',
      accountNumber: '50200088281775',
      ifscCode: 'HDFC0000240',
      accountType: 'Current Account',
      branch: 'CBD Belapur, Navi Mumbai'
    })
  },
  usdBank: {
    type: bankAccountSchema,
    default: () => ({
      accountName: 'AIVA ENTERPRISES',
      bankName: 'HDFC Bank Ltd',
      accountNumber: '50200088281775',
      swiftCode: 'HDFCINBB',
      accountType: 'Trade / Forex (EEFC)',
      branch: 'CBD Belapur, Navi Mumbai, India'
    })
  },
  authorizedSignatory: {
    name: {
      type: String,
      default: 'Aishwarya Ingale',
      trim: true
    },
    designation: {
      type: String,
      default: 'Authorized Signatory',
      trim: true
    }
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('CompanySetting', companySettingSchema);
