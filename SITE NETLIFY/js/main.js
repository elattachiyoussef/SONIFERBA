document.addEventListener('DOMContentLoaded', function() {
    // Animation douce pour le défilement
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // Sélection des éléments
    const header = document.querySelector('.main-header');
    const scrollTrigger = 60;
    let lastScroll = 0;

    // Animations au défilement
    const observerOptions = {
        threshold: 0.2,
        rootMargin: "0px"
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Éléments à animer
    document.querySelectorAll('.service-box, .installation-card, .value-card, .timeline-item, .brand-slide').forEach(el => {
        observer.observe(el);
    });

    // Gestion du header au scroll
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        // Ajout/suppression de la classe scrolled
        if (currentScroll >= scrollTrigger) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        // Animation de masquage/affichage du header
        if (currentScroll > lastScroll && currentScroll > 100) {
            header.style.transform = 'translateY(-100%)';
        } else {
            header.style.transform = 'translateY(0)';
        }
        
        lastScroll = currentScroll;
    });

    // Smooth scroll pour les ancres
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Animation des compteurs dans la timeline
    const animateValue = (element, start, end, duration) => {
        let startTimestamp = null;
        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            element.textContent = Math.floor(progress * (end - start) + start);
            if (progress < 1) {
                window.requestAnimationFrame(step);
            }
        };
        window.requestAnimationFrame(step);
    };

    // Parallax effect sur les images
    document.querySelectorAll('.installation-image img').forEach(img => {
        window.addEventListener('scroll', () => {
            const rect = img.getBoundingClientRect();
            if (rect.top < window.innerHeight && rect.bottom > 0) {
                const speed = 0.2;
                const yPos = (rect.top - window.innerHeight / 2) * speed;
                img.style.transform = `translateY(${yPos}px)`;
            }
        });
    });

    // Animation du slider des marques
    const brandsSlider = document.querySelector('.brands-slider');
    let isDown = false;
    let startX;
    let scrollLeft;

    brandsSlider.addEventListener('mousedown', (e) => {
        isDown = true;
        brandsSlider.classList.add('active');
        startX = e.pageX - brandsSlider.offsetLeft;
        scrollLeft = brandsSlider.scrollLeft;
    });

    brandsSlider.addEventListener('mouseleave', () => {
        isDown = false;
        brandsSlider.classList.remove('active');
    });

    brandsSlider.addEventListener('mouseup', () => {
        isDown = false;
        brandsSlider.classList.remove('active');
    });

    brandsSlider.addEventListener('mousemove', (e) => {
        if (!isDown) return;
        e.preventDefault();
        const x = e.pageX - brandsSlider.offsetLeft;
        const walk = (x - startX) * 2;
        brandsSlider.scrollLeft = scrollLeft - walk;
    });

    // Effet de hover 3D sur les cartes
    document.querySelectorAll('.service-box, .installation-card').forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const xRotation = ((y - rect.height / 2) / rect.height) * 10;
            const yRotation = ((x - rect.width / 2) / rect.width) * 10;
            
            card.style.transform = `perspective(1000px) rotateX(${xRotation}deg) rotateY(${yRotation}deg) scale(1.05)`;
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)';
        });
    });

    // Menu hamburger
    const menuToggle = document.createElement('div');
    menuToggle.className = 'menu-toggle';
    menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
    document.querySelector('.main-header .container').appendChild(menuToggle);

    const mainNav = document.querySelector('.main-nav');
    menuToggle.addEventListener('click', () => {
        mainNav.classList.toggle('active');
        menuToggle.innerHTML = mainNav.classList.contains('active') ? 
            '<i class="fas fa-times"></i>' : 
            '<i class="fas fa-bars"></i>';
    });

    // Fermer le menu quand on clique sur un lien
    document.querySelectorAll('.main-nav a').forEach(link => {
        link.addEventListener('click', () => {
            mainNav.classList.remove('active');
            menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
        });
    });

    // Fermer le menu quand on clique en dehors
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.main-nav') && !e.target.closest('.menu-toggle')) {
            mainNav.classList.remove('active');
            menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
        }
    });
}); 