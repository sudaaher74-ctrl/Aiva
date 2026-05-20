/* ============================================================
   AIVA ENTERPRISES — Master Dynamic Product & B2B System
   ============================================================ */

// 16 Premium Export Products Specifications Master Database
const defaultProducts = [
  // --- ASEPTIC PRODUCTS (7) ---
  {
    id: "tomato-paste",
    name: "Tomato Paste",
    category: "Aseptic Product",
    tab: "aseptic",
    desc: "Premium export-grade tomato paste processed under strict quality standards to retain rich flavour, colour, and consistency. Ideal for dynamic formulation requirements in industrial food processing plants.",
    appearance: "Rich red smooth tomato paste",
    flavour: "Fresh natural tomato flavour",
    brix: "27–39° Bx",
    acidity: "0.16% – 0.60% (as anhydrous citric acid)",
    ph: "6.1 – 6.7",
    colour: "Deep tomato red (Lycopene rich)",
    packaging: "Aseptic bag-in-drum (approx. 235 KG)",
    shelflife: "10–17 years (Excellent long-term stability)",
    storage: "Store below 30°C in clean warehouse",
    size: "Homogeneous Concentrate",
    applications: ["Sauces", "Ketchup", "Processed foods", "Industrial food manufacturing"],
    image: "https://images.unsplash.com/photo-1587132137056-bfbf0166836e?w=800&q=80"
  },
  {
    id: "alphonso-mango-pulp",
    name: "Alphonso Mango Pulp",
    category: "Aseptic Product",
    tab: "aseptic",
    desc: "Premium Alphonso mango pulp with smooth texture, rich tropical aroma, and authentic Devgad/Ratnagiri Alphonso mango flavour. Completely natural with zero synthetic preservation.",
    appearance: "Smooth homogeneous pulp",
    flavour: "Sweet authentic Alphonso mango taste",
    brix: "Minimum 16°Bx",
    acidity: "0.40% – 0.80%",
    ph: "3.5 – 4.2",
    colour: "Bright orange-yellow",
    packaging: "216 KG aseptic bag-in-drum",
    shelflife: "12 months (25–30°C) / 18 months (5–10°C)",
    storage: "Store cool & dry away from sunlight",
    size: "Standard fluid viscosity",
    applications: ["Beverages", "Ice creams", "Dairy products", "Bakery", "Desserts"],
    image: "https://images.unsplash.com/photo-1553279768-865429fa0078?w=800&q=80"
  },
  {
    id: "totapuri-mango-pulp",
    name: "Totapuri Mango Pulp",
    category: "Aseptic Product",
    tab: "aseptic",
    desc: "Export-quality Totapuri mango pulp with smooth consistency and signature tropical flavour. The ultimate global benchmark ingredient for beverage compounding.",
    appearance: "Smooth free-flowing pulp",
    flavour: "Typical ripe Totapuri mango flavour",
    brix: "Minimum 14°Bx",
    acidity: "0.40% – 0.80%",
    ph: "3.5 – 4.2",
    colour: "Golden yellow",
    packaging: "216 KG aseptic bag-in-drum",
    shelflife: "12 months (25–30°C) / 18 months (5–10°C)",
    storage: "Store cool & dry",
    size: "Standard fluid viscosity",
    applications: ["Juices", "Concentrates", "Industrial beverages", "Fruit processing"],
    image: "https://images.unsplash.com/photo-1601493700631-2b16ec4b4716?w=800&q=80"
  },
  {
    id: "kesar-mango-pulp",
    name: "Kesar Mango Pulp",
    category: "Aseptic Product",
    tab: "aseptic",
    desc: "Rich premium Kesar mango pulp with authentic aroma, intense fiber-free profile, and smooth texture. Sourced from the foothills of Gir, Gujarat for pure quality.",
    appearance: "Smooth homogeneous texture",
    flavour: "Natural ripe Kesar mango flavour",
    brix: "Minimum 16°Bx",
    acidity: "0.40% – 0.80%",
    ph: "3.5 – 4.2",
    colour: "Bright orange-yellow (saffron glow)",
    packaging: "210 KG aseptic bag-in-drum",
    shelflife: "12 months (25–30°C) / 18 months (5–10°C)",
    storage: "Store cool & dry",
    size: "Standard fluid viscosity",
    applications: ["Mango drinks", "Yogurts", "Dairy products", "Desserts"],
    image: "https://images.unsplash.com/photo-1519096845289-95806ee03a1a?w=800&q=80"
  },
  {
    id: "papaya-pulp",
    name: "Papaya Pulp",
    category: "Aseptic Product",
    tab: "aseptic",
    desc: "High-quality papaya pulp with smooth texture and natural tropical flavor. Processed seedless to secure absolute batch consistency and color density.",
    appearance: "Smooth free-flowing pulp",
    flavour: "Natural papaya flavour",
    brix: "Minimum 9°Bx",
    acidity: "0.40% – 0.80%",
    ph: "3.5 – 4.2",
    colour: "Natural bright red-orange",
    packaging: "215 KG aseptic bag-in-drum",
    shelflife: "12 months (25–30°C) / 18 months (5–10°C)",
    storage: "Store cool & dry",
    size: "Smooth de-seeded concentrate",
    applications: ["Tropical beverages", "Smoothies", "Food manufacturing", "Fruit spreads"],
    image: "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=600&q=80"
  },
  {
    id: "guava-pulp",
    name: "Pink & White Guava Pulp",
    category: "Aseptic Product",
    tab: "aseptic",
    desc: "Premium guava pulp available in pink and white variants with rich tropical flavour. De-stoned and finished under completely aseptic conditions to lock in Vitamin C.",
    appearance: "Smooth homogeneous pulp",
    flavour: "Natural ripe guava flavour",
    brix: "White: Min 9°Bx / Pink: Min 8°Bx",
    acidity: "0.40% – 0.80%",
    ph: "3.5 – 4.2",
    colour: "Creamish white / bright pink",
    packaging: "210 KG aseptic bag-in-drum",
    shelflife: "12 months (25–30°C) / 18 months (5–10°C)",
    storage: "Store cool & dry (Chilled storage recommended for Pink)",
    size: "Seedless smooth pulp",
    applications: ["Fruit beverages", "Nectar", "Dairy", "Desserts", "Syrups"],
    image: "https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?w=800&q=80"
  },
  {
    id: "banana-pulp",
    name: "Banana Pulp",
    category: "Aseptic Product",
    tab: "aseptic",
    desc: "Smooth export-quality banana pulp with creamy texture and natural sweet banana flavour, treated under sterile conditions to avoid color oxidation or browning.",
    appearance: "Smooth free-flowing texture",
    flavour: "Natural sweet banana flavour",
    brix: "Minimum 19°Bx",
    acidity: "0.50% – 0.80%",
    ph: "3.5 – 4.2",
    colour: "Creamish white",
    packaging: "220 KG aseptic bag-in-drum",
    shelflife: "12 months (25–30°C) / 18 months (5–10°C)",
    storage: "Store cool & dry",
    size: "Fully homogenized cream",
    applications: ["Baby food", "Bakery", "Smoothies", "Dairy products"],
    image: "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=800&q=80"
  },

  // --- FRUIT CONCENTRATES (3) ---
  {
    id: "mango-concentrate",
    name: "Mango Concentrate (Totapuri)",
    category: "Fruit Concentrate",
    tab: "concentrates",
    desc: "Highly concentrated Totapuri mango concentrate evaporated in multi-stage vacuum cookers for premium flavor preservation and logistical freight efficiency.",
    appearance: "Thick homogeneous high-density syrup",
    flavour: "Intense concentrated Totapuri flavor",
    brix: "28° – 30° Bx Minimum",
    acidity: "0.80% – 1.40%",
    ph: "3.5 – 3.8",
    colour: "Deep golden orange",
    packaging: "1000 ml and 3000 ml pack formats or bulk drums",
    shelflife: "24 months under clean aseptic conditions",
    storage: "Store below 22°C in dry ambient conditions",
    size: "Highly concentrated fluid",
    applications: ["Juice compounding", "Beverage manufacturing", "Syrups", "Confectionery"],
    image: "assets/images/aseptic-products.png"
  },
  {
    id: "guava-concentrate",
    name: "Guava Concentrate",
    category: "Fruit Concentrate",
    tab: "concentrates",
    desc: "Premium filtered guava concentrate with tropical aroma and highly concentrated flavor profile. De-seeded and vacuum clarified for smooth blending.",
    appearance: "Rich dense tropical concentrate",
    flavour: "Typical tropical guava fruit profile",
    brix: "20° – 24° Bx Minimum",
    acidity: "0.60% – 1.20%",
    ph: "3.6 – 4.1",
    colour: "Creamy white or light pink hue",
    packaging: "100 ml and 300 ml retail formats or export drums",
    shelflife: "18 months",
    storage: "Store cool & dry",
    size: "Clarified/Cloudy high brix concentrate",
    applications: ["Fruit beverages", "Dairy blending", "Industrial food processing", "Flavor base"],
    image: "https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?w=800&q=80"
  },
  {
    id: "banana-concentrate",
    name: "Banana Concentrate",
    category: "Fruit Concentrate",
    tab: "concentrates",
    desc: "Rich banana concentrate with creamy texture and completely natural banana flavour, processed from Cavendish bananas without any added sugarcane syrups.",
    appearance: "High density sweet paste",
    flavour: "Intense natural banana sweetness",
    brix: "16% – 20% Soluble solids",
    acidity: "0.5% – 4.5% (customizable standard)",
    ph: "6.6 (natural pH index)",
    colour: "Uniform creamish white",
    packaging: "Comprehensive export bag-in-box and drum packaging",
    shelflife: "10 days (unpasteurized raw cold track) or 12 months (aseptic)",
    storage: "Cold storage required below 4°C",
    size: "Aseptic Concentrated base",
    applications: ["Smoothies", "Dairy products", "Beverage compounding", "Bakery formulas"],
    image: "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=800&q=80"
  },

  // --- IQF PRODUCTS (6) ---
  {
    id: "mango-dices",
    name: "IQF Totapuri Mango Dices",
    category: "IQF Product",
    tab: "iqf",
    desc: "Frozen Totapuri mango dices processed using cutting-edge Individual Quick Freezing (IQF) technology for perfect cellular structure and absolute freshness retention.",
    appearance: "Calibrated free-flowing fruit dices",
    flavour: "Sweet tropical ripe mango taste",
    brix: "Minimum 9°Bx",
    acidity: "0.40% – 0.70%",
    ph: "3.6 – 4.2",
    colour: "Vibrant yellow to light orange",
    packaging: "10 KG customizable export cartons with inner blue LDPE bags",
    shelflife: "24 months at -18°C",
    storage: "Store below -18°C (Unbroken cold chain)",
    size: "10×10 mm or 12×12 mm precision cuts",
    applications: ["Frozen desserts", "Bakery ingredients", "Yogurt mixers", "Ice cream toppings"],
    image: "https://images.unsplash.com/photo-1553279768-865429fa0078?w=800&q=80"
  },
  {
    id: "papaya-dices",
    name: "IQF Papaya Dices",
    category: "IQF Product",
    tab: "iqf",
    desc: "IQF frozen papaya dices with highly vibrant colour, tropical aroma, and firm texture. Prepared from sun-ripened select fields, peeled and mechanically cut.",
    appearance: "Unclumped dry papaya dices",
    flavour: "Typical sweet tropical papaya flavor",
    brix: "Minimum 6°Bx",
    acidity: "0.10% – 0.30%",
    ph: "4.5 – 5.2",
    colour: "Natural orange-red",
    packaging: "10 KG robust export packs",
    shelflife: "24 months at -18°C",
    storage: "Store below -18°C",
    size: "10×10 mm or 12×12 mm calibrated cuts",
    applications: ["Smoothies", "Frozen fruit bowls", "Desserts", "Fruit salads"],
    image: "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=800&q=80"
  },
  {
    id: "banana-slices",
    name: "IQF Banana Slices",
    category: "IQF Product",
    tab: "iqf",
    desc: "Frozen banana slices with creamy texture and natural sweetness. Treated with organic ascorbic acid to retain pristine color and prevent enzymatic browning.",
    appearance: "Firm cream-colored circular slices",
    flavour: "Sweet authentic ripe banana",
    brix: "Minimum 16°Bx",
    acidity: "0.20% – 0.50%",
    ph: "4.6 – 5.0",
    colour: "Creamish white",
    packaging: "10 KG customizable export cartons",
    shelflife: "24 months at -18°C",
    storage: "Store below -18°C",
    size: "8–12 mm thickness",
    applications: ["Breakfast cereals", "Bakery items", "Smoothies", "Snack blends"],
    image: "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=800&q=80"
  },
  {
    id: "guava-dices",
    name: "IQF Guava Dices",
    category: "IQF Product",
    tab: "iqf",
    desc: "Frozen guava dices retaining natural crisp texture, tropical taste, and vitamin density. Processed from firm, hand-graded fresh white and pink guavas.",
    appearance: "Calibrated firm guava dices",
    flavour: "Sweet, aromatic guava taste",
    brix: "Minimum 6°Bx",
    acidity: "0.30% – 0.60%",
    ph: "3.7 – 4.2",
    colour: "Creamy white or rich pink",
    packaging: "10 KG customizable packs",
    shelflife: "24 months at -18°C",
    storage: "Store below -18°C",
    size: "10×10 mm or 12×12 mm cuts",
    applications: ["Yogurt fruit bases", "Tropical fruit mix boxes", "Frozen bakery", "Confectionery"],
    image: "https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?w=800&q=80"
  },
  {
    id: "strawberry-range",
    name: "IQF Strawberry Range",
    category: "IQF Product",
    tab: "iqf",
    desc: "Premium frozen strawberries processed using fluid-bed blast freezing. Sourced from high-altitude fields for maximum sweetness, color depth, and acidity balance.",
    appearance: "Individually frozen whole, halved, or diced berries",
    flavour: "Intense sweet profile with slight tartness",
    brix: "Minimum 6°Bx",
    acidity: "0.50% – 0.90%",
    ph: "3.2 – 3.6",
    colour: "Bright red to dark red throughout",
    packaging: "10 KG customizable export cartons or retail pouches",
    shelflife: "24 months at -18°C",
    storage: "Store below -18°C",
    size: "Halves / Dices / Whole (15-25 mm, 25-35 mm)",
    applications: ["High-end bakery", "Dairy items", "Premium desserts", "Frozen snack foods"],
    image: "https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=800&q=80"
  },
  {
    id: "sweet-corn",
    name: "IQF Sweet Corn (Kernels & Cut Cob)",
    category: "IQF Product",
    tab: "iqf",
    desc: "Premium frozen sweet corn available in kernels and cut cob formats. Cleaned, steam-blanched, and quick-frozen in minutes to retain milk stage sweetness.",
    appearance: "Firm, plump, golden yellow corn",
    flavour: "Crisp, sweet corn flavor",
    brix: "Kernel: Min 10° Bx / Cob: Min 7° Bx",
    acidity: "Low natural starch",
    ph: "6.0 – 6.5",
    colour: "Uniform bright golden yellow",
    packaging: "10 KG export packs or custom retail bagging",
    shelflife: "24 months at -18°C",
    storage: "Store below -18°C",
    size: "Whole kernels / Cut Cob (Length: 20-30 mm, Diameter: 12-20 mm)",
    applications: ["Frozen foods", "HoReCa food service", "Industrial processing", "Salad lines"],
    image: "https://images.unsplash.com/photo-1551754655-cd27e38d2076?w=800&q=80"
  }
];

// Seed product database in localStorage if empty
const aivaProductSystem = {
  init() {
    if (!localStorage.getItem("aiva_products")) {
      localStorage.setItem("aiva_products", JSON.stringify(defaultProducts));
    }
    if (!localStorage.getItem("aiva_inquiries")) {
      localStorage.setItem("aiva_inquiries", JSON.stringify([]));
    }
  },

  getProducts() {
    this.init();
    return JSON.parse(localStorage.getItem("aiva_products"));
  },

  getProductById(id) {
    const products = this.getProducts();
    return products.find(p => p.id === id);
  },

  saveProduct(product) {
    const products = this.getProducts();
    const index = products.findIndex(p => p.id === product.id);
    if (index !== -1) {
      products[index] = product;
    } else {
      products.push(product);
    }
    localStorage.setItem("aiva_products", JSON.stringify(products));
    return true;
  },

  deleteProduct(id) {
    let products = this.getProducts();
    products = products.filter(p => p.id !== id);
    localStorage.setItem("aiva_products", JSON.stringify(products));
    return true;
  },

  getInquiries() {
    this.init();
    return JSON.parse(localStorage.getItem("aiva_inquiries"));
  },

  addInquiry(inquiry) {
    const inquiries = this.getInquiries();
    inquiry.id = "INQ-" + Date.now();
    inquiry.date = new Date().toISOString();
    inquiry.status = "New";
    inquiries.unshift(inquiry);
    localStorage.setItem("aiva_inquiries", JSON.stringify(inquiries));
    return true;
  },

  updateInquiryStatus(id, status) {
    const inquiries = this.getInquiries();
    const inq = inquiries.find(i => i.id === id);
    if (inq) {
      inq.status = status;
      localStorage.setItem("aiva_inquiries", JSON.stringify(inquiries));
      return true;
    }
    return false;
  }
};

// Global expose
window.aivaProductSystem = aivaProductSystem;

// Initialize on execution
aivaProductSystem.init();

document.addEventListener('DOMContentLoaded', () => {
  initNavigation();
  initHeroParticles();
  initScrollAnimations();
  initCounters();
  initProductTabs();
  initParallax();
  initContactForm();
  checkB2BPreFill();
});

/* ---------- Navigation Logic ---------- */
function initNavigation() {
  const nav = document.getElementById('main-nav');
  const hamburger = document.getElementById('nav-hamburger');
  const mobileOverlay = document.getElementById('nav-mobile-overlay');
  const mobileLinks = document.querySelectorAll('[data-mobile-link]');

  // Scroll event for adding background class to nav
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  });

  // Toggle mobile menu
  if (hamburger && mobileOverlay) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      mobileOverlay.classList.toggle('active');
      document.body.style.overflow = mobileOverlay.classList.contains('active') ? 'hidden' : '';
    });
  }

  // Close mobile menu on link click
  mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      mobileOverlay.classList.remove('active');
      document.body.style.overflow = '';
    });
  });
}

/* ---------- Hero Canvas Particles ---------- */
function initHeroParticles() {
  const canvas = document.getElementById('hero-particles');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let animationFrameId;

  // Set canvas size
  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  // Particle Class
  class Particle {
    constructor() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.size = Math.random() * 2 + 0.5;
      this.speedX = Math.random() * 0.4 - 0.2;
      this.speedY = Math.random() * -0.5 - 0.2; // Move upwards slowly
      this.alpha = Math.random() * 0.5 + 0.2;
      this.fadeSpeed = Math.random() * 0.005 + 0.002;
    }

    update() {
      this.x += this.speedX;
      this.y += this.speedY;

      // Wrap around screen or reset if off screen
      if (this.y < 0) {
        this.y = canvas.height;
        this.x = Math.random() * canvas.width;
      }
      if (this.x < 0 || this.x > canvas.width) {
        this.x = Math.random() * canvas.width;
      }
    }

    draw() {
      ctx.save();
      ctx.globalAlpha = this.alpha;
      ctx.fillStyle = '#B08D57'; // Gold particles
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  // Initialize Particle Array
  const particles = [];
  const particleCount = 60;
  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }

  // Animation Loop
  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
      p.update();
      p.draw();
    });
    animationFrameId = requestAnimationFrame(animate);
  }
  animate();
}

/* ---------- Scroll Reveal Animations ---------- */
function initScrollAnimations() {
  const reveals = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale');

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        // Once revealed, we don't need to observe it anymore
        observer.unobserve(entry.target);
      }
    });
  }, {
    root: null,
    threshold: 0.15, // trigger when 15% of element is visible
    rootMargin: '0px 0px -50px 0px'
  });

  reveals.forEach(el => revealObserver.observe(el));
}

/* ---------- Animated Counters ---------- */
function initCounters() {
  const counters = document.querySelectorAll('.counter');

  const counterObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const counter = entry.target;
        const target = parseInt(counter.getAttribute('data-target'), 10);
        let count = 0;
        const duration = 2000; // 2 seconds
        const stepTime = Math.max(Math.floor(duration / target), 15);

        const timer = setInterval(() => {
          if (target > 1000) {
            count += Math.floor(target / 100);
            if (count >= target) {
              counter.innerText = target.toLocaleString();
              clearInterval(timer);
            } else {
              counter.innerText = count.toLocaleString();
            }
          } else {
            count++;
            if (count >= target) {
              counter.innerText = target;
              clearInterval(timer);
            } else {
              counter.innerText = count;
            }
          }
        }, stepTime);

        observer.unobserve(counter);
      }
    });
  }, {
    root: null,
    threshold: 0.5
  });

  counters.forEach(counter => counterObserver.observe(counter));
}

/* ---------- Product Category Tabs ---------- */
function initProductTabs() {
  const tabs = document.querySelectorAll('.product-tab');
  const groups = document.querySelectorAll('.product-category-group');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const targetTab = tab.getAttribute('data-tab');

      // Update active state in tabs
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      // Show matching products category, hide others
      groups.forEach(group => {
        if (group.id === `tab-${targetTab}`) {
          group.classList.add('active');
          // Re-trigger scroll animations within this visible tab
          const tabReveals = group.querySelectorAll('.reveal');
          tabReveals.forEach(el => el.classList.add('revealed'));
        } else {
          group.classList.remove('active');
        }
      });
    });
  });
}

/* ---------- Parallax Band Effect ---------- */
function initParallax() {
  const parallaxImg1 = document.getElementById('parallax-img-1');
  const parallaxImg2 = document.getElementById('parallax-img-2');

  window.addEventListener('scroll', () => {
    const windowHeight = window.innerHeight;
    const scrollY = window.scrollY;

    // Element 1
    if (parallaxImg1) {
      const rect1 = parallaxImg1.parentElement.getBoundingClientRect();
      const parentTop1 = rect1.top + scrollY;
      const elementVisible1 = rect1.bottom > 0 && rect1.top < windowHeight;

      if (elementVisible1) {
        const speed = 0.15;
        const relativeScroll = scrollY - parentTop1 + windowHeight;
        parallaxImg1.style.transform = `translateY(${relativeScroll * speed}px)`;
      }
    }

    // Element 2
    if (parallaxImg2) {
      const rect2 = parallaxImg2.parentElement.getBoundingClientRect();
      const parentTop2 = rect2.top + scrollY;
      const elementVisible2 = rect2.bottom > 0 && rect2.top < windowHeight;

      if (elementVisible2) {
        const speed = 0.15;
        const relativeScroll = scrollY - parentTop2 + windowHeight;
        parallaxImg2.style.transform = `translateY(${relativeScroll * speed}px)`;
      }
    }
  });
}

/* ---------- Luxury B2B Contact Form ---------- */
function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    // Perform validation checks
    let isValid = true;
    const requiredInputs = form.querySelectorAll('[required]');

    requiredInputs.forEach(input => {
      if (!input.value.trim()) {
        isValid = false;
        input.style.borderBottomColor = '#ba1a1a'; // Error color
      } else {
        input.style.borderBottomColor = ''; // Reset
      }
    });

    if (!isValid) return;

    // Save B2B inquiry to localStorage
    const inquiry = {
      name: document.getElementById('form-name').value,
      company: document.getElementById('form-company').value,
      email: document.getElementById('form-email').value,
      country: document.getElementById('form-country').value,
      product: document.getElementById('form-product').value,
      message: document.getElementById('form-message').value
    };

    aivaProductSystem.addInquiry(inquiry);

    // Simulate luxury loader or submit success
    const submitBtn = form.querySelector('.form-submit');
    const originalText = submitBtn.innerHTML;
    
    submitBtn.disabled = true;
    submitBtn.style.opacity = '0.7';
    submitBtn.innerHTML = 'Sending Inquiry...';

    setTimeout(() => {
      // Show elegant success alert
      alert('Thank you for your inquiry. AIVA Enterprises\' Global Export Team will contact you within 12 business hours with technical specifications and FOB/CIF quotes.');
      form.reset();
      submitBtn.disabled = false;
      submitBtn.style.opacity = '';
      submitBtn.innerHTML = originalText;
    }, 1500);
  });
}

/* ---------- B2B Redirection Query Pre-fill Check ---------- */
function checkB2BPreFill() {
  const params = new URLSearchParams(window.location.search);
  const inquiryProduct = params.get('inquiry_product');
  if (!inquiryProduct) return;

  const productSelector = document.getElementById('form-product');
  const messageArea = document.getElementById('form-message');

  if (productSelector) {
    // Map URL param to selector option
    const options = Array.from(productSelector.options).map(o => o.value);
    
    // Exact match or fallback mapping
    let matchedValue = options.find(val => val === inquiryProduct);
    if (!matchedValue) {
      if (inquiryProduct.includes('mango') && inquiryProduct.includes('dices')) {
        matchedValue = 'iqf-mango';
      } else if (inquiryProduct.includes('strawberry')) {
        matchedValue = 'iqf-strawberry';
      } else if (inquiryProduct.includes('corn')) {
        matchedValue = 'iqf-corn';
      } else if (inquiryProduct.includes('papaya')) {
        matchedValue = 'papaya-pulp';
      } else if (inquiryProduct.includes('banana') && inquiryProduct.includes('pulp')) {
        matchedValue = 'banana-pulp';
      } else if (inquiryProduct.includes('banana') && inquiryProduct.includes('concentrate')) {
        matchedValue = 'banana-concentrate';
      } else if (inquiryProduct.includes('guava') && inquiryProduct.includes('concentrate')) {
        matchedValue = 'guava-concentrate';
      }
    }

    if (matchedValue) {
      productSelector.value = matchedValue;
      
      // Auto pre-fill message details for B2B standard request
      const data = aivaProductSystem.getProductById(inquiryProduct);
      if (data && messageArea) {
        messageArea.value = `We are interested in sourcing ${data.name}. Please send an export quote for an initial volume of 1x20ft FCL (FOB / CIF). Our destination port is: [Port Name]. Specs required: Brix: ${data.brix}, Packaging: ${data.packaging}.`;
        
        // Focus container and smooth scroll to contact section
        const contactSection = document.getElementById('contact');
        if (contactSection) {
          contactSection.scrollIntoView({ behavior: 'smooth' });
        }
      }
    }
  }
}
