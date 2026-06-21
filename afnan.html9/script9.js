document.addEventListener('DOMContentLoaded', () => {

    // 1. SMOOTH SCROLL (Lenis)
    const lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        orientation: 'vertical',
        smoothWheel: true,
    });

    function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);


    // 2. HEADER SCROLL EFFECT
    const header = document.querySelector('header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });


    // 3. PRELOADER REMOVAL & HERO ANIMATION
    const preloader = document.getElementById('preloader');
    window.addEventListener('load', () => {
        setTimeout(() => {
            gsap.to(preloader, {
                opacity: 0,
                duration: 1,
                onComplete: () => {
                    preloader.style.display = 'none';
                    // Trigger Hero Animations after preloader
                    animateHero();
                }
            });
        }, 1000);
    });

    function animateHero() {
        const tl = gsap.timeline();
        
        tl.from('.category-label', { opacity: 0, y: 20, duration: 0.6 })
          .from('.hero-title', { opacity: 0, y: 30, duration: 0.8 }, '-=0.4')
          .from('.hero-subtitle', { opacity: 0, y: 20, duration: 0.6 }, '-=0.4')
          .from('.price-notice', { opacity: 0, scale: 0.8, duration: 0.5 }, '-=0.3')
          .from('.hero-btns', { opacity: 0, y: 20, duration: 0.6 }, '-=0.3')
          .from('.hero-image', { 
              opacity: 0, 
              x: 50, 
              scale: 0.9, 
              duration: 1.2, 
              ease: 'power3.out',
              onComplete: () => {
                  // Start floating after entrance
                  gsap.to('.hero-image', {
                      y: '-=20',
                      duration: 3,
                      repeat: -1,
                      yoyo: true,
                      ease: 'sine.inOut'
                  });
              }
          }, '-=1');
    }

    // Hero Image Mouse Parallax
    const heroVisual = document.querySelector('.hero-visual');
    const heroImage = document.querySelector('.hero-image');
    
    if (heroVisual && heroImage) {
        window.addEventListener('mousemove', (e) => {
            const { clientX, clientY } = e;
            const xPos = (clientX / window.innerWidth - 0.5) * 30;
            const yPos = (clientY / window.innerHeight - 0.5) * 30;
            
            // We use a different target or clear the float if we want pixel perfect
            // But GSAP is smart enough to handle relative offsets if handled carefully.
            // Let's target the wrapper or use a separate gsap instance for parallax
            gsap.to('.hero-visual', {
                x: xPos * 0.5,
                y: yPos * 0.5,
                duration: 1,
                ease: 'power2.out'
            });
        });
    }


    // 4. COUNTER ANIMATION (Using ScrollTrigger)
    gsap.registerPlugin(ScrollTrigger);

    const counters = document.querySelectorAll('.counter');
    counters.forEach(counter => {
        const updateCount = () => {
            const target = +counter.getAttribute('data-target');
            const speed = target / 50;
            const animate = () => {
                const value = +counter.innerText;
                if (value < target) {
                    counter.innerText = Math.ceil(value + speed);
                    setTimeout(animate, 20);
                } else {
                    counter.innerText = target;
                }
            }
            animate();
        };

        ScrollTrigger.create({
            trigger: counter,
            start: 'top 90%',
            onEnter: updateCount,
            once: true // Only run once
        });
    });


    // 5. STAGGERED REVEALS (Subtle)
    const fadeTargets = ['.card', '.product-card', '.about-text', '.about-visual'];
    fadeTargets.forEach(selector => {
        gsap.from(selector, {
            scrollTrigger: {
                trigger: selector,
                start: 'top 90%',
            },
            y: 30,
            opacity: 0,
            duration: 0.8,
            ease: 'power1.out'
        });
    });


    // 6. FORM SUBMISSION
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            alert('Your message has been sent. We will get back to you soon!');
            contactForm.reset();
        });
    }

    // 7. MOBILE MENU TOGGLE
    const menuToggle = document.getElementById('menuToggle');
    const navLinks = document.querySelector('.nav-links');
    
    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            
            // Transform hamburger to X
            const spans = menuToggle.querySelectorAll('span');
            spans.forEach((span, index) => {
                if (navLinks.classList.contains('active')) {
                    if (index === 0) span.style.transform = 'rotate(45deg) translate(5px, 5px)';
                    if (index === 1) span.style.opacity = '0';
                    if (index === 2) span.style.transform = 'rotate(-45deg) translate(5px, -5px)';
                } else {
                    span.style.transform = 'none';
                    span.style.opacity = '1';
                }
            });
        });

        // Close menu when clicking a link
        const navItems = navLinks.querySelectorAll('a');
        navItems.forEach(item => {
            item.addEventListener('click', () => {
                navLinks.classList.remove('active');
                const spans = menuToggle.querySelectorAll('span');
                spans.forEach(span => {
                    span.style.transform = 'none';
                    span.style.opacity = '1';
                });
            });
        });
    }


    // 8. LUXURY BOTTLE OPENING ANIMATION
    const bottleSection = document.querySelector('.about');
    const cap = document.getElementById('bottleCap');
    const body = document.getElementById('bottleBody');
    const mist = document.getElementById('sprayMist');

    if (bottleSection && cap && body && mist) {
        const bottleTl = gsap.timeline({
            scrollTrigger: {
                trigger: bottleSection,
                start: 'top 60%',
                end: 'bottom 20%',
                toggleActions: 'play reverse play reverse'
            }
        });

        bottleTl
            // Lift and tilt the cap
            .to(cap, { 
                y: -60, 
                rotation: -10, 
                duration: 1.2, 
                ease: 'power2.out' 
            })
            // Spray the mist
            .to(mist, { 
                opacity: 0.8, 
                scale: 1.5, 
                y: -40, 
                duration: 0.8, 
                ease: 'power1.out' 
            }, '-=0.6')
            // Fade mist out slowly
            .to(mist, { 
                opacity: 0, 
                scale: 2, 
                duration: 1.5, 
                ease: 'power1.in' 
            }, '+=0.2');

        // Add a subtle continuous float to the whole bottle
        gsap.to('.bottle-wrapper', {
            y: -10,
            duration: 2,
            repeat: -1,
            yoyo: true,
            ease: 'sine.inOut'
        });

        // Click to spray interaction
        const bottleWrapper = document.querySelector('.bottle-wrapper');
        bottleWrapper.addEventListener('click', () => {
            const clickTl = gsap.timeline();
            clickTl.to(cap, { y: -80, rotation: -15, duration: 0.3, ease: 'back.out' })
                   .to(mist, { opacity: 1, scale: 1.8, y: -50, duration: 0.4 }, '-=0.2')
                   .to(mist, { opacity: 0, scale: 2.5, duration: 0.8 })
                   .to(cap, { y: -60, rotation: -10, duration: 0.5, ease: 'bounce.out' }, '-=0.5');
        });
    }

});
