const { test, describe } = require('node:test');
const assert = require('node:assert/strict');
const {
  loginSchema,
  inquirySchema,
  quotationSchema,
  customerSchema,
  productSchema,
  purchaseOrderSchema
} = require('../validators');

describe('AIVA Backend Zod Validators', () => {
  test('loginSchema passes for valid credentials', () => {
    const payload = {
      body: {
        email: 'admin@aivaenterprises.com',
        password: 'securepassword123'
      }
    };
    const parsed = loginSchema.parse(payload);
    assert.equal(parsed.body.email, 'admin@aivaenterprises.com');
  });

  test('loginSchema throws for invalid email format', () => {
    const payload = {
      body: {
        email: 'not-an-email',
        password: '123'
      }
    };
    assert.throws(() => loginSchema.parse(payload));
  });

  test('inquirySchema accepts valid inquiry data', () => {
    const payload = {
      body: {
        name: 'John Doe',
        email: 'john@example.com',
        phone: '+1234567890',
        company: 'Fruit Traders Ltd',
        country: 'United Arab Emirates',
        product: 'Totapuri Mango Pulp',
        quantity: '5 MT',
        message: 'Looking for FOB prices for Dubai port.'
      }
    };
    const parsed = inquirySchema.parse(payload);
    assert.equal(parsed.body.name, 'John Doe');
    assert.equal(parsed.body.email, 'john@example.com');
  });

  test('productSchema accepts valid product data', () => {
    const payload = {
      body: {
        name: 'Alphonso Mango Pulp',
        category: 'Aseptic Fruit Pulps',
        description: 'Premium Alphonso Pulp from Ratnagiri'
      }
    };
    const parsed = productSchema.parse(payload);
    assert.equal(parsed.body.name, 'Alphonso Mango Pulp');
  });

  test('purchaseOrderSchema accepts valid PO payload', () => {
    const payload = {
      body: {
        buyerCompany: 'Al Marai Foods',
        buyerContactPerson: 'Sultan Ahmed',
        buyerEmail: 'sultan@almarai.com',
        items: [
          {
            productName: 'Mango Pulp',
            quantity: 10,
            unitPriceUSD: 1200
          }
        ]
      }
    };
    const parsed = purchaseOrderSchema.parse(payload);
    assert.equal(parsed.body.buyerCompany, 'Al Marai Foods');
  });
});
