/**
 * AIVA Enterprises — Main Script
 */

document.addEventListener('DOMContentLoaded', () => {
  // Navigation Scroll Effect
  const nav = document.getElementById('main-nav');
  if (nav) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 50) {
        nav.classList.add('scrolled');
      } else {
        nav.classList.remove('scrolled');
      }
    });
  }

  // Mobile Menu Toggle
  const hamburger = document.getElementById('nav-hamburger');
  const mobileOverlay = document.getElementById('nav-mobile-overlay');
  const mobileLinks = document.querySelectorAll('[data-mobile-link]');

  if (hamburger && mobileOverlay) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      mobileOverlay.classList.toggle('active');
      document.body.style.overflow = mobileOverlay.classList.contains('active') ? 'hidden' : '';
    });

    mobileLinks.forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        mobileOverlay.classList.remove('active');
        document.body.style.overflow = '';
      });
    });
  }

  // Scroll Reveal Animations
  const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale');
  
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        // If element is a stagger container, add revealed to children with delay
        if (entry.target.classList.contains('stagger-children')) {
          const children = entry.target.children;
          Array.from(children).forEach((child, index) => {
            setTimeout(() => {
              child.classList.add('revealed');
            }, index * 100);
          });
        }
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
  });

  revealElements.forEach(el => revealObserver.observe(el));

  // Animated Counters
  const counters = document.querySelectorAll('.counter');
  let hasCounted = false;

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !hasCounted) {
        counters.forEach(counter => {
          const target = +counter.getAttribute('data-target');
          const duration = 2000;
          const increment = target / (duration / 16); 
          let current = 0;

          const updateCounter = () => {
            current += increment;
            if (current < target) {
              counter.innerText = Math.ceil(current);
              requestAnimationFrame(updateCounter);
            } else {
              counter.innerText = target;
            }
          };

          updateCounter();
        });
        hasCounted = true;
        counterObserver.disconnect();
      }
    });
  }, { threshold: 0.5 });

  const statsSection = document.querySelector('.hero-stats');
  if (statsSection) {
    counterObserver.observe(statsSection);
  }

  const productImages = {
    sapotaPulp: "assets/images/products/sapota-pulp.webp",
    jamunPulp: "assets/images/products/jamun-pulp.webp",
    sweetCornKernels: "assets/images/products/sweet-corn-kernels.webp",
    cornCobCuts: "assets/images/products/corn-cob-cuts.webp",
    pineappleDices: "assets/images/products/pineapple-dices.webp",
    strawberryWholeDices: "assets/images/products/strawberry-whole-dices.webp",
    pomegranateArils: "assets/images/products/pomegranate-arils.webp",
    papayaDices: "assets/images/products/papaya-dices.webp",
    okraCuts: "assets/images/products/okra-cuts.webp",
    cauliflowerFlorets: "assets/images/products/cauliflower-florets.webp",
    beetrootDices: "assets/images/products/beetroot-dices.webp",
    mixedVegetables: "assets/images/products/mixed-vegetables.webp"
  };

  // Define Product Database
      const defaultProducts = [
    {
      id: "alphonso-mango-pulp-drum",
      tab: "aseptic",
      category: "Aseptic pulp/paste",
      name: "Alphonso Mango Pulp",
      desc: "Premium Alphonso Mango Pulp in bulk aseptic drums.",
      image: "assets/alphonsomangodrum.png",
      appearance: "Homogenous puree",
      flavour: "Characteristic Alphonso mango",
      brix: "Min. 16",
      acidity: "0.40 - 0.80",
      ph: "3.5 - 4.0",
      colour: "Bright Orange Yellow",
      packaging: "220 Kgs in Drum",
      shelflife: "24 Months",
      storage: "Ambient",
      applications: ["Juices", "Ice Creams", "Desserts", "Yogurt"]
    },
    
    {
      id: "totapuri-mango-pulp-drum",
      tab: "aseptic",
      category: "Aseptic pulp/paste",
      name: "Totapuri Mango Pulp",
      desc: "High quality Totapuri Mango Pulp in bulk aseptic drums.",
      image: "assets/images/products/pulp/totapurimangopulpdrumm.webp",
      appearance: "Smooth puree",
      flavour: "Characteristic Totapuri mango",
      brix: "Min. 14",
      acidity: "0.40 - 0.80",
      ph: "3.5 - 4.1",
      colour: "Bright Golden Yellow",
      packaging: "220 Kgs in Drum",
      shelflife: "24 Months",
      storage: "Ambient",
      applications: ["Juices", "Beverages", "Jams"]
    },
    
    {
      id: "kesar-mango-pulp-drum",
      tab: "aseptic",
      category: "Aseptic pulp/paste",
      name: "Kesar Mango Pulp",
      desc: "Sweet and aromatic Kesar Mango Pulp in bulk aseptic drums.",
      image: "assets/images/products/pulp/kesarmangopulpdrum.webp",
      appearance: "Thick puree",
      flavour: "Sweet Kesar aroma",
      brix: "Min. 16",
      acidity: "0.40 - 0.80",
      ph: "3.6 - 4.0",
      colour: "Bright Orange Yellow",
      packaging: "220 Kgs in Drum",
      shelflife: "24 Months",
      storage: "Ambient",
      applications: ["Desserts", "Ice Creams", "Beverages"]
    },
    
    {
      id: "pink-guava-pulp-drum",
      tab: "aseptic",
      category: "Aseptic pulp/paste",
      name: "Pink Guava Pulp",
      desc: "Distinctive pink guava pulp with a sweet, musky flavor profile in bulk aseptic drums.",
      image: "assets/images/products/pulp/pinkguavapulpdrum.png",
      appearance: "Creamy puree",
      flavour: "Tropical guava",
      brix: "Min. 9",
      acidity: "0.40 - 0.80",
      ph: "3.7 - 4.2",
      colour: "Pinkish",
      packaging: "215 Kgs in Drum",
      shelflife: "18 Months",
      storage: "Ambient",
      applications: ["Juices", "Nectars", "Candies"]
    },
    

    {
      id: "guava-concentrate-drum",
      tab: "aseptic",
      category: "Aseptic pulp/paste",
      name: "Guava Concentrate",
      desc: "Aromatic guava concentrate made from selected fresh guavas in bulk aseptic drums.",
      image: "assets/images/products/pulp/gavaconcentratedrum.webp",
      appearance: "Smooth concentrate",
      flavour: "Tropical guava",
      brix: "Min. 20",
      acidity: "0.40 - 0.80",
      ph: "3.7 - 4.2",
      colour: "Creamish White",
      packaging: "215 Kgs in Drum",
      shelflife: "24 Months",
      storage: "Ambient",
      applications: ["Juices", "Nectars", "Beverages"]
    },
    
    {
      id: "mango-concentrate-drum",
      tab: "aseptic",
      category: "Aseptic pulp/paste",
      name: "Mango Concentrate",
      desc: "Highly concentrated mango base for premium beverage production in bulk aseptic drums.",
      image: "assets/images/products/pulp/mangoconcentrate.webp",
      appearance: "Smooth concentrate",
      flavour: "Mango",
      brix: "Min. 28",
      acidity: "0.40 - 0.80",
      ph: "3.5 - 4.0",
      colour: "Yellow",
      packaging: "220 Kgs in Drum",
      shelflife: "24 Months",
      storage: "Ambient",
      applications: ["Beverages", "Juices", "Nectars"]
    },
    
    {
      id: "papaya-pulp-drum",
      tab: "aseptic",
      category: "Aseptic pulp/paste",
      name: "Papaya Pulp",
      desc: "Tropical papaya pulp, rich in color and natural enzymes in bulk aseptic drums.",
      image: "assets/images/products/pulp/papayapulpdrum1.png",
      appearance: "Smooth puree",
      flavour: "Tropical papaya",
      brix: "Min. 9",
      acidity: "0.35 - 0.80",
      ph: "3.8 - 4.2",
      colour: "Yellow / Red",
      packaging: "215 Kgs in Drum",
      shelflife: "18 Months",
      storage: "Ambient",
      applications: ["Juices", "Smoothies", "Desserts"]
    },
    
    {
      id: "tomato-paste-drum",
      tab: "aseptic",
      category: "Aseptic pulp/paste",
      name: "Tomato Paste",
      desc: "Cold-break and hot-break tomato paste with intense red color and fresh flavor profile in bulk aseptic drums.",
      image: "assets/images/products/pulp/tomatopastedrum.webp",
      appearance: "Thick paste",
      flavour: "Characteristic tomato",
      brix: "28-30",
      acidity: "N/A",
      ph: "N/A",
      colour: "Red",
      packaging: "220 Kgs in Drum",
      shelflife: "24 Months",
      storage: "Ambient",
      applications: ["Ketchup", "Sauces", "Soups"]
    },
    
    {
      id: "banana-concentrate-drum",
      tab: "aseptic",
      category: "Aseptic pulp/paste",
      name: "Banana Concentrate",
      desc: "Sweet and smooth banana concentrate, ideal for baby food and smoothies in bulk aseptic drums.",
      image: "assets/images/products/pulp/bananaconcentratdrum.webp",
      appearance: "Creamy puree",
      flavour: "Sweet banana",
      brix: "Min. 24",
      acidity: "0.40 - 0.80",
      ph: "4.0 - 4.5",
      colour: "Bright Golden Yellow",
      packaging: "220 Kgs in Drum",
      shelflife: "24 Months",
      storage: "Ambient",
      applications: ["Baby Food", "Smoothies", "Bakery"]
    },
    
    {
      id: "pomegranate-juice",
      tab: "aseptic",
      category: "Aseptic pulp/paste",
      name: "Pomegranate Juice",
      desc: "Clear and vibrant pomegranate juice.",
      image: "assets/images/products/pomegranate-juice.webp",
      appearance: "Clear liquid",
      flavour: "Sweet-tart pomegranate",
      brix: "Min. 13",
      acidity: "0.25 - 0.60 / 0.30 - 0.45",
      ph: "3.2 - 3.8",
      colour: "Ruby Red",
      packaging: "215 Kgs in Drum / 1 kg x 16 = 16 Kgs / Carton / 9 kg x 2 = 18 Kgs / Carton",
      shelflife: "18 Months",
      storage: "Ambient",
      applications: ["Beverages", "Syrups"]
    },
    {
      id: "raw-mango-pulp",
      tab: "aseptic",
      category: "Aseptic pulp/paste",
      name: "Raw Mango Pulp (Totapuri)",
      desc: "Tart and tangy raw mango pulp.",
      image: "assets/images/products/raw-mango-pulp.webp",
      appearance: "Smooth puree",
      flavour: "Tangy raw mango",
      brix: "Min. 10",
      acidity: "1.00 - 2.50",
      ph: "2.8 - 3.4",
      colour: "Bright Yellow",
      packaging: "1 kg x 16 = 16 Kgs / Carton / 9 kg x 2 = 18 Kgs / Carton",
      shelflife: "18 Months",
      storage: "Ambient",
      applications: ["Chutneys", "Beverages"]
    },
    {
      id: "strawberry-pulp",
      tab: "aseptic",
      category: "Aseptic pulp/paste",
      name: "Strawberry Pulp (With & Without Seeds)",
      desc: "Sweet and tart strawberry pulp, available with or without seeds.",
      image: "https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=800&q=80",
      appearance: "Smooth puree",
      flavour: "Sweet-tart strawberry",
      brix: "Min. 7",
      acidity: "0.50 - 0.80",
      ph: "3.3 - 3.8",
      colour: "Deep Red",
      packaging: "1 kg x 16 = 16 Kgs / Carton / 9 kg x 2 = 18 Kgs / Carton",
      shelflife: "18 Months",
      storage: "Ambient",
      applications: ["Ice Creams", "Desserts", "Beverages"]
    },
    {
      id: "sapota-pulp",
      tab: "aseptic",
      category: "Aseptic pulp/paste",
      name: "Sapota Pulp",
      desc: "Smooth aseptic sapota pulp with natural caramel sweetness.",
      image: productImages.sapotaPulp || 'https://images.unsplash.com/photo-1590004953392-5aba2e72269a?w=800&q=80',
      appearance: "Light brown puree",
      flavour: "Naturally sweet sapota",
      brix: "Min. 17",
      acidity: "Natural",
      ph: "4.2 - 4.8",
      colour: "Pantone Yellow / Golden Brown",
      packaging: "1 kg x 16 = 16 Kgs / Carton / 9 kg x 2 = 18 Kgs / Carton",
      shelflife: "18 Months",
      storage: "Ambient",
      applications: ["Milkshakes", "Desserts"]
    },
    {
      id: "amla-pulp",
      tab: "aseptic",
      category: "Aseptic pulp/paste",
      name: "Amla Pulp",
      desc: "Tart and highly nutritious amla (Indian gooseberry) pulp.",
      image: "assets/images/products/amla-pulp.webp",
      appearance: "Smooth puree",
      flavour: "Tart amla",
      brix: "Min. 7",
      acidity: "1.20 - 2.00",
      ph: "2.8 - 3.2",
      colour: "Creamy Red / Greenish Yellow",
      packaging: "1 kg x 16 = 16 Kgs / Carton / 9 kg x 2 = 18 Kgs / Carton",
      shelflife: "18 Months",
      storage: "Ambient",
      applications: ["Health Drinks", "Supplements"]
    },
    {
      id: "jamun-pulp",
      tab: "aseptic",
      category: "Aseptic pulp/paste",
      name: "Jamun Pulp",
      desc: "Deep purple jamun pulp with a bold sweet-tart taste.",
      image: productImages.jamunPulp || 'https://images.unsplash.com/photo-1595180579979-3c825a0a38ad?w=800&q=80',
      appearance: "Smooth puree",
      flavour: "Characteristic sweet-tart jamun",
      brix: "Min. 9",
      acidity: "0.40 - 0.70",
      ph: "3.2 - 3.8",
      colour: "Deep Violet",
      packaging: "1 kg x 16 = 16 Kgs / Carton / 9 kg x 2 = 18 Kgs / Carton",
      shelflife: "18 Months",
      storage: "Ambient",
      applications: ["Juices", "Yogurt", "Functional Beverages"]
    },
    {
      id: "sugarcane-juice",
      tab: "aseptic",
      category: "Aseptic pulp/paste",
      name: "Sugarcane Juice",
      desc: "Naturally sweet and refreshing sugarcane juice.",
      image: "assets/images/products/sugarcane-juice.webp",
      appearance: "Clear liquid",
      flavour: "Sweet sugarcane",
      brix: "Min. 18",
      acidity: ">0.10",
      ph: "5.0 - 5.5",
      colour: "Pale Green",
      packaging: "1 kg x 16 = 16 Kgs / Carton / 9 kg x 2 = 18 Kgs / Carton",
      shelflife: "18 Months",
      storage: "Ambient",
      applications: ["Beverages"]
    },
    {
      id: "pineapple-pulp",
      tab: "aseptic",
      category: "Aseptic pulp/paste",
      name: "Pineapple Pulp",
      desc: "Sweet and tropical pineapple pulp.",
      image: "assets/images/products/pineapple-pulp.webp",
      appearance: "Smooth puree",
      flavour: "Sweet tropical pineapple",
      brix: "Min. 13",
      acidity: "0.40 - 0.90",
      ph: "3.5 - 4.0",
      colour: "Bright Yellow",
      packaging: "210 kgs / drum",
      shelflife: "18 Months",
      storage: "Ambient",
      applications: ["Juices", "Desserts", "Bakery"]
    },
    {
      id: "lime-juice",
      tab: "aseptic",
      category: "Aseptic pulp/paste",
      name: "Lime Juice",
      desc: "Tangy and citrusy lime juice.",
      image: "assets/images/products/lime-juice.webp",
      appearance: "Clear liquid",
      flavour: "Tangy lime",
      brix: "Min. 7",
      acidity: "5.50 - 7.50",
      ph: "2.0 - 3.0",
      colour: "Greenish Yellow",
      packaging: "Standard Export Packaging",
      shelflife: "18 Months",
      storage: "Ambient",
      applications: ["Beverages", "Culinary"]
    },
    {
      id: "iqf-green-peas",
      tab: "vegetables",
      category: "Frozen",
      name: "Green Peas",
      desc: "Tender and sweet individually quick frozen green peas.",
      image: "assets/images/products/vegetables/greenpeas.png",
      appearance: "Individual green peas",
      flavour: "Sweet, characteristic peas",
      brix: "Approx. 8",
      acidity: "N/A",
      ph: "N/A",
      colour: "Bright Green",
      packaging: "400 G x 20 Pkt = 8Kg / Carton, 2.5 Kg x 4 Pkt = 10 Kg / Carton",
      shelflife: "24 Months at -18°C",
      storage: "-18°C or below",
      applications: ["Ready Meals", "Soups", "Retail"]
    },
    {
      id: "iqf-green-beans",
      tab: "vegetables",
      category: "Frozen",
      name: "Green Beans (Cut)",
      desc: "Cut green beans, individually quick frozen.",
      image: "assets/images/products/green-beans-cut.webp",
      appearance: "Cut green beans (25-30 mm)",
      flavour: "Fresh green beans",
      brix: "Natural",
      acidity: "N/A",
      ph: "N/A",
      colour: "Bright Green",
      packaging: "400 G x 20 Pkt = 8Kg / Carton, 2.5 Kg x 4 Pkt = 10 Kg / Carton",
      shelflife: "24 Months at -18°C",
      storage: "-18°C or below",
      applications: ["Ready Meals", "Culinary", "Retail"]
    },
    {
      id: "iqf-okra-cuts",
      tab: "vegetables",
      category: "Frozen",
      name: "Okra (Cut)",
      desc: "Clean-cut okra frozen quickly for reliable color and texture.",
      image: "assets/images/products/vegetables/okraIQFfrozzen.png",
      appearance: "Cut okra (25-30 mm)",
      flavour: "Fresh okra",
      brix: "Natural",
      acidity: "N/A",
      ph: "N/A",
      colour: "Bright Green",
      packaging: "400 G x 20 Pkt = 8Kg / Carton, 2.5 Kg x 4 Pkt = 10 Kg / Carton",
      shelflife: "24 Months at -18°C",
      storage: "-18°C or below",
      applications: ["Curries", "Ready Meals", "Retail"]
    },
    {
      id: "iqf-spinach",
      tab: "vegetables",
      category: "Frozen",
      name: "Spinach (Whole / Chopped)",
      desc: "Fresh spinach leaves, available whole or chopped.",
      image: "assets/images/products/vegetables/spinch.png",
      appearance: "Cut Size: 25-30 mm",
      flavour: "Fresh spinach",
      brix: "Natural",
      acidity: "N/A",
      ph: "N/A",
      colour: "Dark Green",
      packaging: "400 G x 20 Pkt = 8Kg / Carton, 2.5 Kg x 4 Pkt = 10 Kg / Carton",
      shelflife: "24 Months at -18°C",
      storage: "-18°C or below",
      applications: ["Ready Meals", "Soups", "Retail"]
    },
    {
      id: "iqf-mix-vegetable",
      tab: "vegetables",
      category: "Frozen",
      name: "Mix Vegetable",
      desc: "Blend of Green Peas, Carrot & Green Beans.",
      image: "assets/images/products/vegetables/mixvegitables.png",
      appearance: "Mixed cut vegetables",
      flavour: "Fresh mixed vegetables",
      brix: "Natural",
      acidity: "N/A",
      ph: "N/A",
      colour: "Colorful mixture",
      packaging: "400 G x 20 Pkt = 8Kg / Carton, 2.5 Kg x 4 Pkt = 10 Kg / Carton",
      shelflife: "24 Months at -18°C",
      storage: "-18°C or below",
      applications: ["Ready Meals", "Retail", "Foodservice"]
    },
    {
      id: "iqf-corn-on-cobs",
      tab: "vegetables",
      category: "Frozen",
      name: "Corn on Cobs",
      desc: "Sweet corn cob portions frozen quickly.",
      image: "assets/images/products/vegetables/corn on cobs.png",
      appearance: "Whole corn cobs",
      flavour: "Sweet corn",
      brix: "Min. 9",
      acidity: "N/A",
      ph: "N/A",
      colour: "Bright Golden Yellow",
      packaging: "1 Kg x 10 Pkt = 10 Kg / Carton",
      shelflife: "24 Months at -18°C",
      storage: "-18°C or below",
      applications: ["Foodservice", "Retail", "Ready Meals"]
    },
    {
      id: "iqf-sweet-corn",
      tab: "vegetables",
      category: "Frozen",
      name: "Sweet Corn",
      desc: "Tender, sweet corn kernels.",
      image: "assets/images/products/vegetables/sweetcorn.png",
      appearance: "Individual kernels",
      flavour: "Sweet corn",
      brix: "Natural",
      acidity: "N/A",
      ph: "N/A",
      colour: "Bright Golden Yellow",
      packaging: "Standard Export Packaging",
      shelflife: "24 Months at -18°C",
      storage: "-18°C or below",
      applications: ["Ready Meals", "Soups", "Retail"]
    },
    {
      id: "iqf-carrot",
      tab: "vegetables",
      category: "Frozen",
      name: "Carrot",
      desc: "Diced carrots, individually quick frozen.",
      image: "assets/images/products/vegetables/carrot.png",
      appearance: "Diced carrots",
      flavour: "Sweet carrot",
      brix: "Natural",
      acidity: "N/A",
      ph: "N/A",
      colour: "Orange",
      packaging: "Standard Export Packaging",
      shelflife: "24 Months at -18°C",
      storage: "-18°C or below",
      applications: ["Ready Meals", "Soups", "Retail"]
    },
    {
      id: "iqf-baby-corn",
      tab: "vegetables",
      category: "Frozen",
      name: "Baby Corn",
      desc: "Tender baby corn, individually quick frozen.",
      image: "assets/images/products/vegetables/babycoen.png",
      appearance: "Whole baby corn",
      flavour: "Mild corn flavor",
      brix: "Natural",
      acidity: "N/A",
      ph: "N/A",
      colour: "Light Yellow",
      packaging: "Standard Export Packaging",
      shelflife: "24 Months at -18°C",
      storage: "-18°C or below",
      applications: ["Ready Meals", "Stir-fries", "Retail"]
    }
    ,{
      id: "iqf-beetroot",
      tab: "vegetables",
      category: "Frozen",
      name: "Beetroot",
      desc: "Diced beetroot, individually quick frozen.",
      image: "assets/images/products/vegetables/beetroot.png",
      appearance: "Diced beetroot",
      flavour: "Earthy, sweet",
      brix: "Natural",
      acidity: "N/A",
      ph: "N/A",
      colour: "Deep Red / Purple",
      packaging: "Standard Export Packaging",
      shelflife: "24 Months at -18°C",
      storage: "-18°C or below",
      applications: ["Ready Meals", "Salads", "Retail"]
    },
    {
      id: "iqf-cauliflower",
      tab: "vegetables",
      category: "Frozen",
      name: "Cauliflower",
      desc: "Cauliflower florets, individually quick frozen.",
      image: "assets/images/products/vegetables/cauliflower.png",
      appearance: "Cauliflower florets",
      flavour: "Mild cauliflower",
      brix: "Natural",
      acidity: "N/A",
      ph: "N/A",
      colour: "White",
      packaging: "Standard Export Packaging",
      shelflife: "24 Months at -18°C",
      storage: "-18°C or below",
      applications: ["Ready Meals", "Stir-fries", "Retail"]
    },
    {
      id: "iqf-mushroom",
      tab: "vegetables",
      category: "Frozen",
      name: "Mushroom",
      desc: "Sliced or whole mushrooms, individually quick frozen.",
      image: "assets/images/products/vegetables/mashrum.png",
      appearance: "Sliced/Whole mushrooms",
      flavour: "Earthy",
      brix: "Natural",
      acidity: "N/A",
      ph: "N/A",
      colour: "White to light brown",
      packaging: "Standard Export Packaging",
      shelflife: "24 Months at -18°C",
      storage: "-18°C or below",
      applications: ["Pizzas", "Ready Meals", "Soups"]
    },
    {
      id: "iqf-coriander-green-chilli",
      tab: "iqf-frozen",
      category: "Frozen",
      name: "Coriander & Green Chilli",
      desc: "Fresh coriander and green chilli blend, individually quick frozen.",
      image: "assets/images/products/iqf_frozen/coriander&greenchilli.png",
      appearance: "Chopped/Blended",
      flavour: "Spicy and herbaceous",
      brix: "Natural",
      acidity: "N/A",
      ph: "N/A",
      colour: "Green",
      packaging: "Standard Export Packaging",
      shelflife: "24 Months at -18°C",
      storage: "-18°C or below",
      applications: ["Curries", "Chutneys", "Culinary"]
    },
    {
      id: "iqf-mint",
      tab: "iqf-frozen",
      category: "Frozen",
      name: "Mint",
      desc: "Fresh mint leaves, individually quick frozen.",
      image: "assets/images/products/iqf_frozen/mint.png",
      appearance: "Leaves/Chopped",
      flavour: "Fresh mint",
      brix: "Natural",
      acidity: "N/A",
      ph: "N/A",
      colour: "Green",
      packaging: "Standard Export Packaging",
      shelflife: "24 Months at -18°C",
      storage: "-18°C or below",
      applications: ["Beverages", "Chutneys", "Culinary"]
    },
    {
      id: "iqf-onion",
      tab: "iqf-frozen",
      category: "Frozen",
      name: "Onion",
      desc: "Diced or sliced onions, individually quick frozen.",
      image: "assets/images/products/iqf_frozen/onion.png",
      appearance: "Diced/Sliced",
      flavour: "Pungent, sweet when cooked",
      brix: "Natural",
      acidity: "N/A",
      ph: "N/A",
      colour: "White/Pink",
      packaging: "Standard Export Packaging",
      shelflife: "24 Months at -18°C",
      storage: "-18°C or below",
      applications: ["Ready Meals", "Curries", "Culinary"]
    },
    {
      id: "iqf-tomato",
      tab: "iqf-frozen",
      category: "Frozen",
      name: "Tomato",
      desc: "Diced tomatoes, individually quick frozen.",
      image: "assets/images/products/iqf_frozen/tomamto.png",
      appearance: "Diced",
      flavour: "Tangy and sweet",
      brix: "Natural",
      acidity: "N/A",
      ph: "N/A",
      colour: "Red",
      packaging: "Standard Export Packaging",
      shelflife: "24 Months at -18°C",
      storage: "-18°C or below",
      applications: ["Soups", "Sauces", "Culinary"]
    }
  ];

  const syncDefaultProducts = () => {
    const stored = localStorage.getItem('aiva_products');
    if (!stored) {
      localStorage.setItem('aiva_products', JSON.stringify(defaultProducts));
      return defaultProducts;
    }
    const products = JSON.parse(stored);
    let updated = [...products];
    defaultProducts.forEach(def => {
      const existingIdx = updated.findIndex(p => p.id === def.id);
      if (existingIdx === -1) {
        updated.push(def);
      } else {
        // Update image if it has changed
        updated[existingIdx].image = def.image;
        updated[existingIdx].image_url = def.image_url;
      }
    });
    localStorage.setItem('aiva_products', JSON.stringify(updated));
    return updated;
  };

  window.aivaProductSystem = {
    getProducts: async function() {
      try {
        const res = await fetch(`${API_BASE}/products`);
        const data = await res.json();
        return data.data || [];
      } catch (err) {
        return syncDefaultProducts();
      }
    },
    getProductById: async function(id) {
      const prods = await this.getProducts();
      return prods.find(p => p.id === id || p._id === id);
    },
    saveProducts: async function(products) {
      return products;
    },
    addProduct: async function(product) {
      try {
        const res = await fetch(`${API_BASE}/products`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('aiva_token')}`
          },
          body: JSON.stringify(product)
        });
        const data = await res.json();
        return data.data;
      } catch (err) {
        return product;
      }
    },
    deleteProduct: async function(id) {
      try {
        await fetch(`${API_BASE}/products/${id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('aiva_token')}`
          }
        });
      } catch (err) {}
    },
    addInquiry: async function(inquiry) {
      try {
        const response = await fetch(`${API_BASE}/inquiries`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(inquiry)
        });
        const result = await response.json();
        return result;
      } catch (error) {
        // Fallback to localStorage if server is down
        const inquiries = JSON.parse(localStorage.getItem('aiva_inquiries') || '[]');
        inquiry.id = 'INQ-' + Math.random().toString(36).substr(2, 9).toUpperCase();
        inquiry.date = new Date().toISOString();
        inquiry.status = 'New';
        inquiries.push(inquiry);
        localStorage.setItem('aiva_inquiries', JSON.stringify(inquiries));
        console.warn('Server unavailable, saved to localStorage');
        return { success: true, data: inquiry };
      }
    }
  };

  // Ensure products exist in localStorage
  window.aivaProductSystem.getProducts();

  // Products Page Logic (products.html)
  const productTabs = document.querySelectorAll('.product-tab');
  const mainProductsGrid = document.getElementById('main-products-grid');

  if (mainProductsGrid) {
    const renderProducts = async (tabId) => {
      const allProducts = await window.aivaProductSystem.getProducts();
      const products = allProducts.filter(p => p.tab === tabId);
      mainProductsGrid.innerHTML = '';
      
      products.forEach((product, index) => {
        const card = document.createElement('div');
        card.className = `product-card reveal revealed`;
        card.style.animationDelay = `${index * 100}ms`;
        card.innerHTML = `
          <div class="product-card-image">
            <img src="${product.image || product.image_url}" alt="${product.name}" loading="lazy">
            <div class="product-card-overlay">
              <a href="product.html?id=${product.id || product._id}" class="product-card-overlay-cta" style="text-decoration: none;">
                View Details
                <svg width="16" height="16" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M4 10h12M12 4l6 6-6 6" />
                </svg>
              </a>
            </div>
          </div>
          <div class="product-card-body">
            <div class="product-card-category">${product.category}</div>
            <h3 class="product-card-title">${product.name}</h3>
            <p class="product-card-desc" style="display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;">${product.desc || product.description}</p>
          </div>
        `;
        mainProductsGrid.appendChild(card);
      });
    };

    // Initialize with first tab
    renderProducts('aseptic');

    productTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        productTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        renderProducts(tab.dataset.tab);
      });
    });
  }
});
