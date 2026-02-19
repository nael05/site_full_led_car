document.addEventListener('DOMContentLoaded', () => {
    
    // 1. SCROLL REVEAL (Exécuté en premier pour éviter l'écran noir)
    const observerOptions = { threshold: 0.1, rootMargin: "0px 0px 0px 0px" };
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
            }
        });
    }, observerOptions);
    
    document.querySelectorAll('.reveal-on-scroll').forEach(el => observer.observe(el));

    // Force l'affichage du header au cas où l'observateur tarde
    setTimeout(() => {
        document.querySelectorAll('header .reveal-on-scroll').forEach(el => el.classList.add('is-visible'));
    }, 500);

    // 2. CURSEUR
    const cursorDot = document.getElementById("cursor-dot");
    const cursorOutline = document.getElementById("cursor-outline");
    let mouseX = 0, mouseY = 0;
    let outlineX = 0, outlineY = 0;

    if(window.innerWidth > 768 && cursorDot && cursorOutline) {
        window.addEventListener("mousemove", (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            cursorDot.style.left = `${mouseX}px`;
            cursorDot.style.top = `${mouseY}px`;
        });

        function animateCursor() {
            let distX = mouseX - outlineX;
            let distY = mouseY - outlineY;
            outlineX += distX * 0.15;
            outlineY += distY * 0.15;
            cursorOutline.style.left = `${outlineX}px`;
            cursorOutline.style.top = `${outlineY}px`;
            requestAnimationFrame(animateCursor);
        }
        animateCursor();

        const triggers = document.querySelectorAll('.hover-trigger, a, button, input');
        triggers.forEach(trigger => {
            trigger.addEventListener('mouseenter', () => document.body.classList.add('hovering'));
            trigger.addEventListener('mouseleave', () => document.body.classList.remove('hovering'));
        });
    }

    // 3. ETOILES ANIMÉES
    const canvas = document.getElementById('star-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let width, height, stars = [];

        function initStars() {
            width = window.innerWidth;
            height = window.innerHeight;
            canvas.width = width;
            canvas.height = height;
            stars = [];
            const numStars = Math.floor(width * height / 8000); 

            for (let i = 0; i < numStars; i++) {
                stars.push({
                    x: Math.random() * width,
                    y: Math.random() * height,
                    radius: Math.random() * 1.5,
                    speed: Math.random() * 0.2 + 0.1
                });
            }
        }

        function animateStars() {
            ctx.clearRect(0, 0, width, height);
            ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
            
            stars.forEach(star => {
                star.y -= star.speed;
                if (star.y < 0) {
                    star.y = height;
                    star.x = Math.random() * width;
                }
                ctx.beginPath();
                ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
                ctx.fill();
            });
            requestAnimationFrame(animateStars);
        }
        window.addEventListener('resize', initStars);
        initStars();
        animateStars();
    }

    // 4. MULTIPLES SLIDERS AVANT/APRES
    function initComparison() {
        const containers = document.querySelectorAll('.img-comp-container');
        containers.forEach(container => {
            const overlay = container.querySelector('.img-comp-overlay');
            if(!overlay) return;
            
            const w = container.offsetWidth;
            overlay.style.width = (w / 2) + "px";
            
            const slider = document.createElement("DIV");
            slider.className = "img-comp-slider";
            slider.innerHTML = '<div class="slider-handle"><i class="fa-solid fa-arrows-left-right text-xs"></i></div>';
            container.appendChild(slider);
            slider.style.left = (w / 2) + "px";

            container.addEventListener("mousemove", (e) => {
                 const rect = container.getBoundingClientRect();
                 let x = e.clientX - rect.left;
                 if (x < 0) x = 0;
                 if (x > w) x = w;
                 overlay.style.width = x + "px";
                 slider.style.left = x + "px";
            });

            container.addEventListener("touchmove", (e) => {
                 const rect = container.getBoundingClientRect();
                 let x = e.touches[0].clientX - rect.left;
                 if (x < 0) x = 0;
                 if (x > w) x = w;
                 overlay.style.width = x + "px";
                 slider.style.left = x + "px";
            }, {passive: true});
        });
    }
    
    // Attendre que les images chargent pour calculer la largeur
    setTimeout(initComparison, 300);

    // 5. NAVBAR ET MENU MOBILE
    let lastScroll = 0;
    const nav = document.getElementById('navbar');
    if (nav) {
        window.addEventListener('scroll', () => {
            const currentScroll = window.pageYOffset;
            if (currentScroll > 50) nav.classList.add('shadow-lg');
            else nav.classList.remove('shadow-lg');

            if (currentScroll > lastScroll && currentScroll > 100) nav.classList.add('nav-hidden');
            else nav.classList.remove('nav-hidden');
            lastScroll = currentScroll;
        });
    }

    const menuBtn = document.getElementById('menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    
    if (menuBtn && mobileMenu) {
        const menuIcon = menuBtn.querySelector('i');
        const mobileLinks = document.querySelectorAll('.mobile-link');

        function toggleMenu() {
            const isOpen = mobileMenu.classList.contains('opacity-100');
            if (isOpen) {
                mobileMenu.classList.remove('opacity-100', 'pointer-events-auto');
                mobileMenu.classList.add('opacity-0', 'pointer-events-none');
                menuIcon.classList.remove('fa-xmark');
                menuIcon.classList.add('fa-bars');
                document.body.style.overflow = ''; 
            } else {
                mobileMenu.classList.remove('opacity-0', 'pointer-events-none');
                mobileMenu.classList.add('opacity-100', 'pointer-events-auto');
                menuIcon.classList.remove('fa-bars');
                menuIcon.classList.add('fa-xmark');
                document.body.style.overflow = 'hidden'; 
            }
        }

        menuBtn.addEventListener('click', toggleMenu);
        mobileLinks.forEach(link => link.addEventListener('click', toggleMenu));
    }
});