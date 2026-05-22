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
    sapotaPulp: "assets/images/A4EDA861-BCAE-48B4-97AD-9DD77AC70E6F.png",
    jamunPulp: "assets/images/C4691FDB-EBB3-4704-AF4C-5380C5753FC6.png",
    sweetCornKernels: "assets/images/E59376D7-F7CC-4615-8B02-FCA1AC6F2E05.png",
    cornCobCuts: "assets/images/bacb0bfcb965bf1c19ab235f14e1162bd70b292c46041eba500fd6c85a65e5db.png",
    pineappleDices: "assets/images/52980acb3f8746be5010fafc89796da76b58847f1a04fc8b799f54f34bc09450.png",
    strawberryWholeDices: "assets/images/3f4e978001d5cbd462686fdf6ceeacd10d5a4d94325cfeb0fdd51224f44c9925.png",
    pomegranateArils: "assets/images/dc95e677b46e62ea5198d21cd0026e1c094f917d6501ec0c1ff1bde18eb1bdc4.png",
    papayaDices: "assets/images/dd97056c1d617a567791ab45547cb903b7ad53d81d5cf45c8b55c38fddc83481.png",
    okraCuts: "assets/images/016986398bb165b0172495d629de2315932e7a9c8be29a3b90b6d2c066c30a9f.png",
    cauliflowerFlorets: "assets/images/256097bc57dd57767442b67db6cf8757e386a8b53dab89c997437fef5c5c7424.png",
    beetrootDices: "assets/images/41a91c913767b4fb4124a5a8ecc9c049ba8751085fb34d3f07ad427faaa6aed0.png",
    mixedVegetables: "assets/images/4EF38E46-5DD9-4B1D-99B7-54BE4FE3B8FC.png"
  };

  // Define Product Database
      const defaultProducts = [
    {
      id: "alphonso-mango-pulp",
      tab: "aseptic",
      category: "Aseptic Pulps & Pastes",
      name: "Alphonso Mango Pulp",
      desc: "Premium Alphonso Mango Pulp, natural or sweetened.",
      image: "https://images.unsplash.com/photo-1553279768-865429fa0078?w=800&q=80",
      appearance: "Homogenous puree",
      flavour: "Characteristic Alphonso mango",
      brix: "Min. 16",
      acidity: "0.40 - 0.80",
      ph: "3.5 - 4.0",
      colour: "Bright Orange Yellow",
      packaging: "220 Kgs in Drum / 1 kg x 16 = 16 Kgs / Carton / 9 kg x 2 = 18 Kgs / Carton",
      shelflife: "24 Months",
      storage: "Ambient or -18°C for frozen",
      applications: ["Juices", "Ice Creams", "Desserts", "Yogurt"]
    },
    {
      id: "totapuri-mango-pulp",
      tab: "aseptic",
      category: "Aseptic Pulps & Pastes",
      name: "Totapuri Mango Pulp",
      desc: "High quality Totapuri Mango Pulp, natural or sweetened.",
      image: "https://images.unsplash.com/photo-1601493700631-2b16ec4b4716?w=800&q=80",
      appearance: "Smooth puree",
      flavour: "Characteristic Totapuri mango",
      brix: "Min. 14",
      acidity: "0.40 - 0.80",
      ph: "3.5 - 4.1",
      colour: "Bright Golden Yellow",
      packaging: "220 Kgs in Drum / 1 kg x 16 = 16 Kgs / Carton / 9 kg x 2 = 18 Kgs / Carton",
      shelflife: "24 Months",
      storage: "Ambient or -18°C for frozen",
      applications: ["Juices", "Beverages", "Jams"]
    },
    {
      id: "kesar-mango-pulp",
      tab: "aseptic",
      category: "Aseptic Pulps & Pastes",
      name: "Kesar Mango Pulp",
      desc: "Sweet and aromatic Kesar Mango Pulp.",
      image: "https://images.unsplash.com/photo-1553279768-865429fa0078?w=800&q=80",
      appearance: "Thick puree",
      flavour: "Sweet Kesar aroma",
      brix: "Min. 16",
      acidity: "0.40 - 0.80",
      ph: "3.6 - 4.0",
      colour: "Bright Orange Yellow",
      packaging: "220 Kgs in Drum / 1 kg x 16 = 16 Kgs / Carton / 9 kg x 2 = 18 Kgs / Carton",
      shelflife: "24 Months",
      storage: "Ambient or -18°C for frozen",
      applications: ["Desserts", "Ice Creams", "Beverages"]
    },
    {
      id: "guava-pulp",
      tab: "aseptic",
      category: "Aseptic Pulps & Pastes",
      name: "Guava Pulp (White / Pink)",
      desc: "Processed from sound, mature guavas, available in white and pink varieties.",
      image: "https://images.unsplash.com/photo-1536511132770-e5058c7e8c46?w=800&q=80",
      appearance: "Creamy puree",
      flavour: "Tropical guava",
      brix: "Min. 9",
      acidity: "0.40 - 0.80",
      ph: "3.7 - 4.2",
      colour: "Creamish White/Pinkish",
      packaging: "215 Kgs in Drum / 1 kg x 16 = 16 Kgs / Carton / 9 kg x 2 = 18 Kgs / Carton",
      shelflife: "18 Months",
      storage: "Ambient",
      applications: ["Juices", "Nectars", "Candies"]
    },
    {
      id: "papaya-puree",
      tab: "aseptic",
      category: "Aseptic Pulps & Pastes",
      name: "Papaya Puree (Yellow / Red)",
      desc: "Sweet and tropical papaya puree, available in yellow and red.",
      image: "https://images.unsplash.com/photo-1517282009859-f000eca3bca2?w=800&q=80",
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
      id: "pomegranate-juice",
      tab: "aseptic",
      category: "Aseptic Pulps & Pastes",
      name: "Pomegranate Juice",
      desc: "Clear and vibrant pomegranate juice.",
      image: "assets/images/5E2D75B7-929E-4247-8D16-C10AFA26C36A.png",
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
      category: "Aseptic Pulps & Pastes",
      name: "Raw Mango Pulp (Totapuri)",
      desc: "Tart and tangy raw mango pulp.",
      image: "assets/images/E5E59F30-070B-4A56-99D2-EF66F31AF09F.png",
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
      id: "banana-puree",
      tab: "aseptic",
      category: "Aseptic Pulps & Pastes",
      name: "Banana Puree",
      desc: "Sweet and creamy banana puree.",
      image: "assets/images/CC4A17FF-6823-4612-B974-17CDECEF5F40.png",
      appearance: "Creamy puree",
      flavour: "Sweet banana",
      brix: "Min. 14",
      acidity: "0.40 - 0.80",
      ph: "4.0 - 4.5",
      colour: "Bright Golden Yellow",
      packaging: "220 Kgs in Drum",
      shelflife: "18 Months",
      storage: "Ambient",
      applications: ["Baby Food", "Smoothies", "Bakery"]
    },
    {
      id: "strawberry-pulp",
      tab: "aseptic",
      category: "Aseptic Pulps & Pastes",
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
      category: "Aseptic Pulps & Pastes",
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
      category: "Aseptic Pulps & Pastes",
      name: "Amla Pulp",
      desc: "Tart and highly nutritious amla (Indian gooseberry) pulp.",
      image: "assets/images/4F5F14BC-C896-466D-A766-D831F69FBB13.png",
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
      category: "Aseptic Pulps & Pastes",
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
      category: "Aseptic Pulps & Pastes",
      name: "Sugarcane Juice",
      desc: "Naturally sweet and refreshing sugarcane juice.",
      image: "assets/images/095E1745-6ACE-4AE2-8BD6-534DAA19080A.png",
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
      category: "Aseptic Pulps & Pastes",
      name: "Pineapple Pulp",
      desc: "Sweet and tropical pineapple pulp.",
      image: "assets/images/54BB1EED-E852-4FFA-A01C-EA4D9F34A485.png",
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
      category: "Aseptic Pulps & Pastes",
      name: "Lime Juice",
      desc: "Tangy and citrusy lime juice.",
      image: "assets/images/B2B7DA52-8FAB-4BEF-A3F3-3F6BC8B74D4C.png",
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
      tab: "iqf",
      category: "IQF Frozen Range",
      name: "Green Peas",
      desc: "Tender and sweet individually quick frozen green peas.",
      image: "assets/images/5783E58E-1CF7-4F4F-90F4-D9A0FA0CC103.png",
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
      tab: "iqf",
      category: "IQF Frozen Range",
      name: "Green Beans (Cut)",
      desc: "Cut green beans, individually quick frozen.",
      image: "assets/images/4743C0DC-F681-488F-B319-0619E50EABAD.png",
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
      tab: "iqf",
      category: "IQF Frozen Range",
      name: "Okra (Cut)",
      desc: "Clean-cut okra frozen quickly for reliable color and texture.",
      image: productImages.okraCuts || 'https://images.unsplash.com/photo-1582046187979-994fccf540c9?w=800&q=80',
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
      tab: "iqf",
      category: "IQF Frozen Range",
      name: "Spinach (Whole / Chopped)",
      desc: "Fresh spinach leaves, available whole or chopped.",
      image: "https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=800&q=80",
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
      tab: "iqf",
      category: "IQF Frozen Range",
      name: "Mix Vegetable",
      desc: "Blend of Green Peas, Carrot & Green Beans.",
      image: productImages.mixedVegetables || 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&q=80',
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
      tab: "iqf",
      category: "IQF Frozen Range",
      name: "Corn on Cobs",
      desc: "Sweet corn cob portions frozen quickly.",
      image: productImages.cornCobCuts || 'https://images.unsplash.com/photo-1582294119335-517bdfb738c8?w=800&q=80',
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
      tab: "iqf",
      category: "IQF Frozen Range",
      name: "Sweet Corn",
      desc: "Tender, sweet corn kernels.",
      image: productImages.sweetCornKernels || 'https://images.unsplash.com/photo-1582294119335-517bdfb738c8?w=800&q=80',
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
      tab: "iqf",
      category: "IQF Frozen Range",
      name: "Carrot",
      desc: "Diced carrots, individually quick frozen.",
      image: "https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=800&q=80",
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
      tab: "iqf",
      category: "IQF Frozen Range",
      name: "Baby Corn",
      desc: "Tender baby corn, individually quick frozen.",
      image: "assets/images/280FB8E5-1ABF-4F00-B9FC-65C5DEE013E3.png",
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
  ];

  const syncDefaultProducts = () => {
    localStorage.setItem('aiva_products', JSON.stringify(defaultProducts));
    return defaultProducts;
  };

  // Global System Object
  window.aivaProductSystem = {
    getProducts: function() {
      return syncDefaultProducts();
    },
    getProductById: function(id) {
      return this.getProducts().find(p => p.id === id);
    },
    addInquiry: function(inquiry) {
      const inquiries = JSON.parse(localStorage.getItem('aiva_inquiries') || '[]');
      inquiry.id = 'INQ-' + Math.random().toString(36).substr(2, 9).toUpperCase();
      inquiry.date = new Date().toISOString();
      inquiry.status = 'New';
      inquiries.push(inquiry);
      localStorage.setItem('aiva_inquiries', JSON.stringify(inquiries));
    }
  };

  // Ensure products exist in localStorage
  window.aivaProductSystem.getProducts();

  // Products Page Logic (products.html)
  const productTabs = document.querySelectorAll('.product-tab');
  const mainProductsGrid = document.getElementById('main-products-grid');

  if (mainProductsGrid) {
    const renderProducts = (tabId) => {
      const products = window.aivaProductSystem.getProducts().filter(p => p.tab === tabId);
      mainProductsGrid.innerHTML = '';
      
      products.forEach((product, index) => {
        const card = document.createElement('div');
        card.className = `product-card reveal revealed`;
        card.style.animationDelay = `${index * 100}ms`;
        card.innerHTML = `
          <div class="product-card-image">
            <img src="${product.image}" alt="${product.name}" loading="lazy">
            <div class="product-card-overlay">
              <a href="product.html?id=${product.id}" class="product-card-overlay-cta" style="text-decoration: none;">
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
            <p class="product-card-desc" style="display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;">${product.desc}</p>
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
