/**
 * AIVA Enterprises - Premium Export Website Interactions
 * Dependencies: GSAP, ScrollTrigger, Lenis
 */

document.addEventListener("DOMContentLoaded", () => {
    
    // --- 1. Initialize Lenis (Smooth Scrolling) ---
    const lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), 
        direction: 'vertical',
        gestureDirection: 'vertical',
        smooth: true,
        mouseMultiplier: 1,
        smoothTouch: false,
        touchMultiplier: 2,
        infinite: false,
    });

    function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // Integrate Lenis with GSAP ScrollTrigger
    gsap.registerPlugin(ScrollTrigger);
    
    lenis.on('scroll', ScrollTrigger.update);

    gsap.ticker.add((time)=>{
      lenis.raf(time * 1000);
    });
    
    gsap.ticker.lagSmoothing(0);


    // --- 2. Preloader Animation ---
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
    .to(".preloader-title", {
        opacity: 1,
        y: 0,
        duration: 0.5,
        ease: "power2.out"
    }, "-=0.5")
    .to(".preloader-subtitle", {
        opacity: 1,
        duration: 0.5,
        ease: "power2.out"
    })
    .to(".preloader", {
        y: "-100%",
        duration: 1,
        ease: "power4.inOut",
        delay: 0.5
    });



    // --- 4. Navbar Scroll Effect ---
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });


    // --- 5. Hero Animations ---
    function initHeroAnimations() {
        const tlHero = gsap.timeline();

        // Text Reveal
        tlHero.fromTo(".hero-title .reveal-text", 
            { y: 100, opacity: 0 }, 
            { y: 0, opacity: 1, duration: 1, stagger: 0.2, ease: "power4.out" }
        )
        .fromTo(".hero-subtitle", 
            { y: 50, opacity: 0 }, 
            { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" }, 
            "-=0.5"
        )
        .fromTo(".hero-buttons", 
            { y: 30, opacity: 0 }, 
            { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" }, 
            "-=0.6"
        );

        // Floating Parallax Setup
        gsap.utils.toArray('.float-item').forEach(item => {
            const speed = item.getAttribute('data-speed');
            gsap.to(item, {
                y: () => (window.innerHeight * speed * -0.2),
                ease: "none",
                scrollTrigger: {
                    trigger: ".hero",
                    start: "top top",
                    end: "bottom top",
                    scrub: 1
                }
            });
            
            // Continuous subtle float
            gsap.to(item, {
                y: "+=20",
                rotation: "+=5",
                duration: 2 + Math.random() * 2,
                repeat: -1,
                yoyo: true,
                ease: "sine.inOut"
            });
        });
    }

    // --- 6. Number Counter (About Section) ---
    const statItems = document.querySelectorAll('.stat-num');
    
    statItems.forEach(stat => {
        const target = parseInt(stat.getAttribute('data-target'));
        
        ScrollTrigger.create({
            trigger: ".stats-grid",
            start: "top 80%",
            onEnter: () => {
                gsap.to(stat, {
                    innerHTML: target,
                    duration: 2,
                    snap: { innerHTML: 1 },
                    ease: "power2.out"
                });
            },
            once: true
        });
    });

    // --- 7. Product Cards 3D Tilt Effect ---
    const productCards = document.querySelectorAll('.product-card');
    
    productCards.forEach(card => {
        const img = card.querySelector('.product-image-wrap img');
        
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = ((y - centerY) / centerY) * -10;
            const rotateY = ((x - centerX) / centerX) * 10;
            
            gsap.to(card, {
                rotateX: rotateX,
                rotateY: rotateY,
                transformPerspective: 1000,
                ease: "power1.out",
                duration: 0.5
            });
            
            gsap.to(img, {
                x: (x - centerX) * 0.1,
                y: (y - centerY) * 0.1,
                ease: "power1.out",
                duration: 0.5
            });
        });
        
        card.addEventListener('mouseleave', () => {
            gsap.to(card, {
                rotateX: 0,
                rotateY: 0,
                ease: "power3.out",
                duration: 1
            });
            
            gsap.to(img, {
                x: 0,
                y: 0,
                ease: "power3.out",
                duration: 1
            });
        });
    });

    // --- 8. Scroll Reveals for Sections ---
    const revealSections = document.querySelectorAll('.section-title, .section-subtitle, .section-desc, .feature-card, .timeline-item');
    
    revealSections.forEach(el => {
        gsap.fromTo(el, 
            { opacity: 0, y: 50 },
            {
                opacity: 1, 
                y: 0,
                duration: 1,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: el,
                    start: "top 85%",
                    toggleActions: "play none none reverse"
                }
            }
        );
    });


    // --- 9. Handle Luxury Form Submissions (e.g. index.html) ---
    const luxuryForms = document.querySelectorAll('.luxury-form');
    luxuryForms.forEach(form => {
        if (form.getAttribute('data-handled') === 'true') return;
        form.setAttribute('data-handled', 'true');

        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const safeVal = (id) => {
                const el = document.getElementById(id);
                return el ? el.value : '';
            };

            const payload = {
                name: safeVal('name'),
                company: safeVal('company') || 'N/A', // from index.html which doesn't have it
                country: safeVal('country') || 'N/A',
                email: safeVal('email'),
                interest: safeVal('interest'),
                quantity: safeVal('qty') || 'N/A',
                message: safeVal('message')
            };

            const btn = form.querySelector('button[type="submit"]');
            const originalText = btn.innerText;
            btn.innerText = 'Sending...';
            btn.disabled = true;

            try {
                const API_BASE = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' ? 'http://localhost:5001/api' : '/api';
                const res = await fetch(`${API_BASE}/inquiries`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });
                const data = await res.json();
                
                if (data.success) {
                    btn.innerText = 'Inquiry Sent!';
                    btn.style.background = '#10b981';
                    form.reset();
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
    });

    // --- 10. Basic Analytics Tracking ---
    try {
        const API_BASE = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' ? 'http://localhost:5001/api' : '/api';
        fetch(`${API_BASE}/analytics/track`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                eventType: 'page_view',
                pageUrl: window.location.pathname,
                countryCode: 'Unknown',
                browserInfo: navigator.userAgent
            })
        });
    } catch (e) {
        // Silently ignore tracking errors
    }

});
