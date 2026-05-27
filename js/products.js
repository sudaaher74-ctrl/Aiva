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
        setTimeout(() => {
            preloader.classList.add('loaded');
            document.body.classList.remove('loading');
            
            // Trigger initial animations
            initHeroAnimations();
        }, 1000);
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

// Category Cards
gsap.utils.toArray('.category-card').forEach(card => {
    gsap.from(card, {
        scrollTrigger: {
            trigger: card,
            start: 'top 85%',
        },
        y: 50,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out'
    });
});

// Featured Products Grid
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

// Advantage Cards
gsap.utils.toArray('.adv-card').forEach((card, i) => {
    gsap.from(card, {
        scrollTrigger: {
            trigger: '.adv-grid',
            start: 'top 80%',
        },
        y: 40,
        opacity: 0,
        duration: 0.6,
        delay: i * 0.1,
        ease: 'back.out(1.2)'
    });
});
