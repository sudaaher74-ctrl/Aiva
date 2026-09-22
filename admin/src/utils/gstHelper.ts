export const GST_STATE_CODES: Record<string, string> = {
  "01": "Jammu & Kashmir",
  "02": "Himachal Pradesh",
  "03": "Punjab",
  "04": "Chandigarh",
  "05": "Uttarakhand",
  "06": "Haryana",
  "07": "Delhi",
  "08": "Rajasthan",
  "09": "Uttar Pradesh",
  "10": "Bihar",
  "11": "Sikkim",
  "12": "Arunachal Pradesh",
  "13": "Nagaland",
  "14": "Manipur",
  "15": "Mizoram",
  "16": "Tripura",
  "17": "Meghalaya",
  "18": "Assam",
  "19": "West Bengal",
  "20": "Jharkhand",
  "21": "Odisha",
  "22": "Chhattisgarh",
  "23": "Madhya Pradesh",
  "24": "Gujarat",
  "25": "Daman and Diu",
  "26": "Dadra and Nagar Haveli",
  "27": "Maharashtra",
  "29": "Karnataka",
  "30": "Goa",
  "31": "Lakshadweep",
  "32": "Kerala",
  "33": "Tamil Nadu",
  "34": "Puducherry",
  "35": "Andaman & Nicobar Islands",
  "36": "Telangana",
  "37": "Andhra Pradesh",
  "38": "Ladakh",
  "97": "Other Territory"
};

export interface GSTCalculation {
  subtotal: number;
  gstRate: number;
  gstType: 'CGST_SGST' | 'IGST' | 'NONE' | 'TAX';
  stateCode: string;
  stateName: string;
  isIntraState: boolean;
  cgstPercent: number;
  cgstAmount: number;
  sgstPercent: number;
  sgstAmount: number;
  igstPercent: number;
  igstAmount: number;
  totalGstAmount: number;
  freight: number;
  insurance: number;
  grandTotal: number;
}

export function calculateGSTFromGstin(
  subtotal: number,
  gstRate: number,
  gstin: string = "",
  freight: number = 0,
  insurance: number = 0
): GSTCalculation {
  const cleanGstin = (gstin || "").trim().toUpperCase();
  const stateCode = cleanGstin.substring(0, 2);
  const stateName = GST_STATE_CODES[stateCode] || "";
  // AIVA Enterprises is in Maharashtra (State Code 27)
  const isIntraState = stateCode === "27";
  const rate = Math.max(0, Number(gstRate) || 0);

  let gstType: 'CGST_SGST' | 'IGST' | 'NONE' | 'TAX' = 'NONE';
  let cgstPercent = 0;
  let cgstAmount = 0;
  let sgstPercent = 0;
  let sgstAmount = 0;
  let igstPercent = 0;
  let igstAmount = 0;

  if (rate > 0) {
    if (isIntraState) {
      gstType = 'CGST_SGST';
      cgstPercent = rate / 2;
      sgstPercent = rate / 2;
      cgstAmount = (subtotal * cgstPercent) / 100;
      sgstAmount = (subtotal * sgstPercent) / 100;
    } else if (stateCode && /^\d{2}$/.test(stateCode)) {
      gstType = 'IGST';
      igstPercent = rate;
      igstAmount = (subtotal * rate) / 100;
    } else {
      gstType = 'TAX';
      igstPercent = rate;
      igstAmount = (subtotal * rate) / 100;
    }
  }

  const totalGstAmount = cgstAmount + sgstAmount + igstAmount;
  const grandTotal = subtotal + totalGstAmount + (Number(freight) || 0) + (Number(insurance) || 0);

  return {
    subtotal,
    gstRate: rate,
    gstType,
    stateCode,
    stateName,
    isIntraState,
    cgstPercent,
    cgstAmount,
    sgstPercent,
    sgstAmount,
    igstPercent,
    igstAmount,
    totalGstAmount,
    freight: Number(freight) || 0,
    insurance: Number(insurance) || 0,
    grandTotal
  };
}
