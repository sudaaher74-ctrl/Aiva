// Initialize Lenis Smooth Scroll
const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smooth: true,
});

function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
}
requestAnimationFrame(raf);

// Preloader
window.addEventListener('load', () => {
    const preloader = document.querySelector('.preloader');
    if (preloader) {
        const tlLoader = gsap.timeline({
            onComplete: () => {
                document.body.classList.remove('loading');
                initHeroAnimations();
            }
        });

        tlLoader.to(".progress-bar", {
            width: "100%",
            duration: 1.5,
            ease: "power3.inOut"
        })
        .to(".preloader", {
            yPercent: -100,
            duration: 1,
            ease: "power4.inOut"
        }, "+=0.2");
    } else {
        document.body.classList.remove('loading');
        initHeroAnimations();
    }
});

// Navbar Scroll Effect
const navbar = document.querySelector('.navbar');
if (navbar) {
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
}

// Hero Animations
function initHeroAnimations() {
    // Text reveals
    gsap.to('.prod-hero .reveal-text', {
        y: 0,
        opacity: 1,
        duration: 1,
        stagger: 0.2,
        ease: 'power3.out'
    });

    // Product composition entrance
    gsap.from('.prod-hero-composition img', {
        y: 100,
        opacity: 0,
        duration: 1.5,
        stagger: 0.2,
        ease: 'back.out(1.2)'
    });
}

// Mouse Parallax for Hero Products
const heroComp = document.querySelector('.prod-hero-composition');
if (heroComp) {
    document.addEventListener('mousemove', (e) => {
        const xAxis = (window.innerWidth / 2 - e.pageX) / 50;
        const yAxis = (window.innerHeight / 2 - e.pageY) / 50;

        const mainProd = document.querySelector('.main-prod');
        const subProd1 = document.querySelector('.sub-prod-1');
        const subProd2 = document.querySelector('.sub-prod-2');

        if(mainProd) mainProd.style.transform = `translate(${xAxis * 1.2}px, ${yAxis * 1.2}px)`;
        if(subProd1) subProd1.style.transform = `translate(${xAxis * -1.5}px, ${yAxis * -1.5}px)`;
        if(subProd2) subProd2.style.transform = `translate(${xAxis * 1.8}px, ${yAxis * 1.8}px)`;
    });
}

// ScrollTrigger Animations
gsap.registerPlugin(ScrollTrigger);

// Dynamic Category Routing
function updateCategoryVisibility() {
    const hash = window.location.hash || '#aseptic';
    const asepticSection = document.getElementById('aseptic');
    const iqfSection = document.getElementById('iqf');

    if (hash === '#iqf') {
        if(asepticSection) asepticSection.style.display = 'none';
        if(iqfSection) iqfSection.style.display = 'block';
    } else {
        // Default to aseptic
        if(asepticSection) asepticSection.style.display = 'block';
        if(iqfSection) iqfSection.style.display = 'none';
    }
    
    // Refresh ScrollTrigger since layout changed
    setTimeout(() => ScrollTrigger.refresh(), 100);
}

window.addEventListener('hashchange', updateCategoryVisibility);
window.addEventListener('load', updateCategoryVisibility);

// Dynamic Get Quote Image Update
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.premium-prod-card .btn-link').forEach(btn => {
        btn.addEventListener('click', function() {
            const card = this.closest('.premium-prod-card');
            if (card) {
                const imgSource = card.querySelector('img').src;
                const inquiryImg = document.querySelector('.inquiry-img img');
                if (inquiryImg) {
                    // Update the image source in the contact form
                    inquiryImg.src = imgSource;
                    
                    // Add a tiny animation bump to show it updated
                    gsap.fromTo(inquiryImg, 
                        { scale: 0.9, opacity: 0.8 }, 
                        { scale: 1, opacity: 1, duration: 0.5, ease: "back.out(1.5)" }
                    );
                }
            }
        });
    });
});

// Dynamic Product Fetching & Rendering
async function initProducts() {
    try {
        const res = await fetch('http://localhost:5001/api/products');
        const data = await res.json();
        const products = data.data || [];

        const asepticGrid = document.getElementById('aseptic-grid');
        const iqfGrid = document.getElementById('iqf-grid');
        if (!asepticGrid || !iqfGrid) return;

        products.forEach(product => {
            const html = `
                <div class="premium-prod-card">
                    <div class="p-img-box">
                        <img src="${product.image || product.image_url}" alt="${product.name}">
                    </div>
                    <div class="p-info">
                        <h3>${product.name}</h3>
                        <p class="p-desc">${product.description || product.desc || ''}</p>
                        <ul class="p-specs">
                            <li><span>Category:</span> ${product.category}</li>
                            ${product.brix ? `<li><span>Brix:</span> ${product.brix}</li>` : ''}
                            ${product.shelfLife ? `<li><span>Shelf Life:</span> ${product.shelfLife}</li>` : ''}
                        </ul>
                        <a href="#contact" class="btn-link">Get Quote <i class="ph ph-arrow-right"></i></a>
                    </div>
                </div>
            `;
            
            if (product.tab === 'aseptic') {
                asepticGrid.insertAdjacentHTML('beforeend', html);
            } else if (product.tab === 'iqf') {
                iqfGrid.insertAdjacentHTML('beforeend', html);
            }
        });

        // Initialize animations after DOM insertion
        gsap.utils.toArray('.premium-prod-card').forEach(card => {
            gsap.from(card, {
                scrollTrigger: {
                    trigger: card,
                    start: 'top 85%',
                },
                y: 60,
                opacity: 0,
                duration: 0.8,
                ease: 'power3.out'
            });
        });

        // Re-attach Get Quote click handlers
        document.querySelectorAll('.premium-prod-card .btn-link').forEach(btn => {
            btn.addEventListener('click', function() {
                const card = this.closest('.premium-prod-card');
                if (card) {
                    const imgSource = card.querySelector('img').src;
                    const inquiryImg = document.querySelector('.inquiry-img img');
                    if (inquiryImg) {
                        inquiryImg.src = imgSource;
                        gsap.fromTo(inquiryImg, 
                            { scale: 0.9, opacity: 0.8 }, 
                            { scale: 1, opacity: 1, duration: 0.5, ease: "back.out(1.5)" }
                        );
                    }
                }
            });
        });

        setTimeout(() => ScrollTrigger.refresh(), 100);

    } catch (error) {
        console.error('Failed to load products:', error);
    }
}

// Form Submission Handler
const contactForm = document.querySelector('.luxury-form');
if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const payload = {
            name: document.getElementById('name').value,
            company: document.getElementById('company').value,
            country: document.getElementById('country').value,
            email: document.getElementById('email').value,
            interest: document.getElementById('interest').value,
            quantity: document.getElementById('qty').value,
            message: document.getElementById('message').value
        };

        const btn = contactForm.querySelector('button[type="submit"]');
        const originalText = btn.innerText;
        btn.innerText = 'Sending...';
        btn.disabled = true;

        try {
            const res = await fetch('http://localhost:5001/api/inquiries', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            const data = await res.json();
            
            if (data.success) {
                btn.innerText = 'Quote Requested!';
                btn.style.background = '#10b981';
                contactForm.reset();
            } else {
                btn.innerText = 'Error - Try Again';
            }
        } catch (error) {
            btn.innerText = 'Error - Try Again';
        }

        setTimeout(() => {
            btn.innerText = originalText;
            btn.style.background = '';
            btn.disabled = false;
        }, 3000);
    });
}

// Massive Render Parallax (Alphonso & Inquiry)
gsap.utils.toArray('.massive-render').forEach(img => {
    gsap.to(img, {
        scrollTrigger: {
            trigger: img.parentElement,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1
        },
        y: 50,
        ease: 'none'
    });
});

window.addEventListener('DOMContentLoaded', initProducts);


