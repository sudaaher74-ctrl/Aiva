const ONES = [
  "", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine",
  "Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen",
  "Seventeen", "Eighteen", "Nineteen"
];

const TENS = [
  "", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"
];

function convertThreeDigit(num: number): string {
  let result = "";
  if (num >= 100) {
    result += ONES[Math.floor(num / 100)] + " Hundred";
    num %= 100;
    if (num > 0) result += " ";
  }
  if (num > 0) {
    if (num < 20) {
      result += ONES[num];
    } else {
      result += TENS[Math.floor(num / 10)];
      if (num % 10 > 0) {
        result += "-" + ONES[num % 10];
      }
    }
  }
  return result;
}

function numberToInternationalWords(num: number): string {
  if (num === 0) return "Zero";

  const billions = Math.floor(num / 1000000000);
  const millions = Math.floor((num % 1000000000) / 1000000);
  const thousands = Math.floor((num % 1000000) / 1000);
  const remainder = Math.floor(num % 1000);

  const parts: string[] = [];

  if (billions > 0) {
    parts.push(convertThreeDigit(billions) + " Billion");
  }
  if (millions > 0) {
    parts.push(convertThreeDigit(millions) + " Million");
  }
  if (thousands > 0) {
    parts.push(convertThreeDigit(thousands) + " Thousand");
  }
  if (remainder > 0) {
    parts.push(convertThreeDigit(remainder));
  }

  return parts.join(" ");
}

function numberToIndianWords(num: number): string {
  if (num === 0) return "Zero";

  const crores = Math.floor(num / 10000000);
  const lakhs = Math.floor((num % 10000000) / 100000);
  const thousands = Math.floor((num % 100000) / 1000);
  const remainder = Math.floor(num % 1000);

  const parts: string[] = [];

  if (crores > 0) {
    parts.push(convertThreeDigit(crores) + " Crore");
  }
  if (lakhs > 0) {
    parts.push(convertThreeDigit(lakhs) + " Lakh");
  }
  if (thousands > 0) {
    parts.push(convertThreeDigit(thousands) + " Thousand");
  }
  if (remainder > 0) {
    parts.push(convertThreeDigit(remainder));
  }

  return parts.join(" ");
}

export function numberToWords(num: number, currency: string = "USD"): string {
  if (num === undefined || num === null || isNaN(num)) return "Zero";
  
  const isINR = currency.toUpperCase() === "INR";
  const intPart = Math.floor(Math.abs(num));
  const decimalPart = Math.round((Math.abs(num) - intPart) * 100);

  const words = isINR
    ? numberToIndianWords(intPart)
    : numberToInternationalWords(intPart);

  const prefix = isINR ? "Indian Rupees" : "United States Dollars";
  const subunit = isINR ? "Paise" : "Cents";

  let result = `${prefix} ${words}`;

  if (decimalPart > 0) {
    const decWords = isINR
      ? numberToIndianWords(decimalPart)
      : numberToInternationalWords(decimalPart);
    result += ` and ${decWords} ${subunit}`;
  }

  return `${result} Only.`;
}
