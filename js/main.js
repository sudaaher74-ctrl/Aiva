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

  // Define Product Database
  const defaultProducts = [
    {
      id: "alphonso-mango-pulp",
      tab: "aseptic",
      category: "Aseptic Pulps & Pastes",
      name: "Alphonso Mango Pulp",
      desc: "Premium quality aseptic Alphonso mango pulp, processed from GI-tagged Ratnagiri & Devgad mangoes. Known globally for its rich flavor and golden color.",
      image: "https://images.unsplash.com/photo-1553279768-865429fa0078?w=800&q=80",
      appearance: "Golden yellow, homogenous puree",
      flavour: "Characteristic intense Alphonso mango flavor",
      brix: "16° Min",
      acidity: "0.4 - 0.7% (as Citric Acid)",
      ph: "3.5 - 4.0",
      colour: "Rich Golden Yellow",
      packaging: "215kg Aseptic Bag in MS Drum",
      shelflife: "24 Months from production date",
      storage: "Ambient temperature. Avoid direct sunlight.",
      applications: ["Juices & Nectars", "Ice Creams", "Yogurts", "Bakery Fillings", "Confectionery"]
    },
    {
      id: "totapuri-mango-pulp",
      tab: "aseptic",
      category: "Aseptic Pulps & Pastes",
      name: "Totapuri Mango Pulp",
      desc: "High-quality Totapuri mango pulp offering an excellent balance of sweetness and acidity, ideal for blending and large-scale beverage manufacturing.",
      image: "https://images.unsplash.com/photo-1601493700631-2b16ec4b4716?w=800&q=80",
      appearance: "Yellow to light yellow, smooth puree",
      flavour: "Typical tart and sweet Totapuri flavor",
      brix: "14° Min",
      acidity: "0.4 - 0.9% (as Citric Acid)",
      ph: "3.5 - 4.1",
      colour: "Bright Yellow",
      packaging: "215kg Aseptic Bag in MS Drum",
      shelflife: "24 Months",
      storage: "Ambient temperature.",
      applications: ["Juice Blends", "Sauces", "Jams", "Dairy Products"]
    },
    {
      id: "kesar-mango-pulp",
      tab: "aseptic",
      category: "Aseptic Pulps & Pastes",
      name: "Kesar Mango Pulp",
      desc: "Aseptic Kesar mango pulp characterized by its striking saffron color and unique sweet flavor profile from Gujarat.",
      image: "https://images.unsplash.com/photo-1553279768-865429fa0078?w=800&q=80",
      appearance: "Saffron yellow, thick puree",
      flavour: "Intensely sweet Kesar aroma",
      brix: "16° Min",
      acidity: "0.3 - 0.6%",
      ph: "3.6 - 4.0",
      colour: "Saffron Yellow",
      packaging: "215kg Aseptic Bag in MS Drum",
      shelflife: "24 Months",
      storage: "Ambient temperature.",
      applications: ["Premium Desserts", "Ice Creams", "Yogurt", "Beverages"]
    },
    {
      id: "white-guava-pulp",
      tab: "aseptic",
      category: "Aseptic Pulps & Pastes",
      name: "White Guava Pulp",
      desc: "Processed from sound, mature white guavas, offering a creamy texture and distinctive musky flavor.",
      image: "https://images.unsplash.com/photo-1536511132770-e5058c7e8c46?w=800&q=80",
      appearance: "Creamy white to pale yellow",
      flavour: "Typical tropical white guava",
      brix: "9° Min",
      acidity: "0.4 - 0.7%",
      ph: "3.7 - 4.2",
      colour: "Creamy White",
      packaging: "215kg Aseptic Bag in MS Drum",
      shelflife: "18 Months",
      storage: "Ambient temperature.",
      applications: ["Juices", "Nectars", "Jams", "Fruit Chews"]
    },
    {
      id: "pink-guava-pulp",
      tab: "aseptic",
      category: "Aseptic Pulps & Pastes",
      name: "Pink Guava Pulp",
      desc: "Vibrant pink guava pulp with a sweet-tart flavor and natural lycopene, perfect for striking beverage formulations.",
      image: "https://images.unsplash.com/photo-1536511132770-e5058c7e8c46?w=800&q=80",
      appearance: "Pinkish-red puree",
      flavour: "Sweet-tart pink guava",
      brix: "9° Min",
      acidity: "0.4 - 0.7%",
      ph: "3.7 - 4.2",
      colour: "Deep Pink",
      packaging: "215kg Aseptic Bag in MS Drum",
      shelflife: "18 Months",
      storage: "Ambient",
      applications: ["Beverages", "Smoothies", "Ice Creams"]
    },
    {
      id: "tomato-paste-28-30",
      tab: "aseptic",
      category: "Aseptic Pulps & Pastes",
      name: "Tomato Paste (28-30% Brix)",
      desc: "Cold break tomato paste offering excellent color and fresh tomato flavor, essential for sauces and ketchups.",
      image: "https://images.unsplash.com/photo-1582878453488-825026960d70?w=800&q=80",
      appearance: "Deep red thick paste",
      flavour: "Characteristic fresh tomato",
      brix: "28 - 30°",
      acidity: "1.5 - 2.5%",
      ph: "4.0 - 4.4",
      colour: "Bright Red (a/b > 2.1)",
      packaging: "228kg Aseptic Bag in MS Drum",
      shelflife: "24 Months",
      storage: "Ambient",
      applications: ["Ketchups", "Pizza Sauces", "Soups", "Ready Meals"]
    },
    {
      id: "totapuri-mango-concentrate",
      tab: "concentrates",
      category: "Fruit Concentrates",
      name: "Totapuri Mango Concentrate (28° Brix)",
      desc: "Evaporated Totapuri mango pulp with double the Brix concentration, reducing logistics costs while preserving flavor.",
      image: "https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?w=800&q=80",
      appearance: "Thick yellow concentrate",
      flavour: "Intense Totapuri mango",
      brix: "28° Min",
      acidity: "0.8 - 1.8%",
      ph: "3.5 - 4.0",
      colour: "Dark Yellow",
      packaging: "228kg Aseptic Bag in MS Drum",
      shelflife: "24 Months",
      storage: "Ambient",
      applications: ["Reconstituted Juices", "Syrups", "Beverage Bases"]
    },
    {
      id: "white-guava-concentrate",
      tab: "concentrates",
      category: "Fruit Concentrates",
      name: "White Guava Concentrate (20° Brix)",
      desc: "Clarified or cloudy white guava concentrate for premium clear juices or nectars.",
      image: "https://images.unsplash.com/photo-1536511132770-e5058c7e8c46?w=800&q=80",
      appearance: "Thick creamy concentrate",
      flavour: "Strong Guava",
      brix: "20° Min",
      acidity: "0.8 - 1.5%",
      ph: "3.6 - 4.0",
      colour: "Creamy to brownish",
      packaging: "228kg Aseptic Bag",
      shelflife: "24 Months",
      storage: "Ambient",
      applications: ["Juices", "Nectars", "Candies"]
    },
    {
      id: "iqf-mango-dices",
      tab: "iqf",
      category: "IQF Frozen Range",
      name: "IQF Mango Dices",
      desc: "Individually Quick Frozen Totapuri or Alphonso mango dices, retaining natural shape, color, and cell structure.",
      image: "https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=800&q=80",
      appearance: "Uniform frozen yellow dices",
      flavour: "Natural mango flavor upon thawing",
      brix: "Natural",
      acidity: "Natural",
      ph: "Natural",
      colour: "Bright Yellow",
      packaging: "10kg Bulk Carton with PE liner",
      shelflife: "24 Months at -18°C",
      storage: "-18°C or below",
      applications: ["Fruit Salads", "Bakery", "Ice Cream Mix-ins", "Smoothie Packs"]
    },
    {
      id: "iqf-sweet-corn",
      tab: "iqf",
      category: "IQF Frozen Range",
      name: "IQF Sweet Corn Kernels",
      desc: "Tender, sweet corn kernels blanched and instantly frozen to lock in sweetness and texture.",
      image: "https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=800&q=80",
      appearance: "Individual yellow kernels",
      flavour: "Sweet, characteristic corn",
      brix: "Natural",
      acidity: "N/A",
      ph: "N/A",
      colour: "Bright Golden Yellow",
      packaging: "10kg Bulk Carton or 1kg Retail Pack",
      shelflife: "24 Months at -18°C",
      storage: "-18°C or below",
      applications: ["Ready Meals", "Soups", "Retail Frozen Aisles"]
    }
  ];

  // Global System Object
  window.aivaProductSystem = {
    getProducts: function() {
      const stored = localStorage.getItem('aiva_products');
      if (stored) return JSON.parse(stored);
      localStorage.setItem('aiva_products', JSON.stringify(defaultProducts));
      return defaultProducts;
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
