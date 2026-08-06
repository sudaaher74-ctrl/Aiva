export const CATEGORIES = ["aseptic", "concentrates", "iqf-fruits", "iqf-frozen", "vegetables"];

// Legacy alias kept in case anything external already links the old slug.
export const CATEGORY_ALIASES = { iqf: "iqf-fruits" };

export const CATEGORY_META = {
  aseptic: {
    label: 'Aseptic pulp/paste',
    title: 'Aseptic Fruit Pulp & Paste',
    description: "AIVA's aseptic fruit pulp and paste range includes Alphonso & Totapuri Mango, Pink/White Guava, Papaya, Banana Pulp, and Tomato Paste — bulk export packaging, 24-month shelf life.",
    intro: "Our aseptic pulp and paste range is processed and packed under sterile conditions for a 24-month ambient shelf life, ideal for beverage, dairy, and food manufacturers sourcing in bulk. The range spans Alphonso, Totapuri, and Kesar Mango, Pink/White Guava, Papaya, Banana, and Tomato Paste.",
  },
  concentrates: {
    label: 'Concentrates',
    title: 'Fruit Concentrates',
    description: "Explore AIVA's high-Brix fruit concentrates — Totapuri Mango, White Guava, and Banana Concentrate — for beverage manufacturing, bulk export from India.",
    intro: 'AIVA supplies high-Brix fruit concentrates for beverage and juice manufacturing, produced to consistent specification for reliable formulation at scale. The range includes Totapuri Mango, White Guava, and Banana Concentrate.',
  },
  'iqf-fruits': {
    label: 'IQF fruits',
    title: 'IQF Fruits',
    description: 'AIVA supplies Individually Quick Frozen (IQF) fruits — Mango Dices, Banana Dices, Guava Dices, and Strawberry — for global foodservice and manufacturing.',
    intro: 'Our Individually Quick Frozen (IQF) fruits lock in flavour, colour, and nutrition at the point of harvest, giving foodservice and manufacturing customers a consistent, ready-to-use ingredient. The range includes Mango Dices, Banana Dices, Guava Dices, and Strawberry.',
  },
  'iqf-frozen': {
    label: 'Frozen',
    title: 'Frozen Vegetables & Herbs',
    description: "AIVA's frozen range includes French Fries, Coriander & Green Chilli, Mint, Onion, and Tomato — IQF processed for bulk export with 24-month shelf life.",
    intro: 'AIVA blast-freezes and IQF-processes a range of vegetables and herbs for global export, holding a 24-month shelf life without compromising on quality. The range includes French Fries, Coriander & Green Chilli, Mint, Onion, and Tomato.',
  },
  vegetables: {
    label: 'IQF Vegetables',
    title: 'IQF Vegetables',
    description: 'AIVA exports IQF vegetables — Sweet Corn, Mushroom, Green Peas, Mix Vegetables, Spinach, and Okra — blast frozen for quality and freshness in global markets.',
    intro: 'Our IQF vegetable range is blast frozen shortly after harvest to preserve freshness, texture, and nutritional value for global markets. The range includes Sweet Corn, Mushroom, Green Peas, Mix Vegetables, Spinach, and Okra.',
  },
};

export function resolveCategorySlug(slug) {
  if (CATEGORY_ALIASES[slug]) return CATEGORY_ALIASES[slug];
  if (CATEGORIES.includes(slug)) return slug;
  return null;
}
