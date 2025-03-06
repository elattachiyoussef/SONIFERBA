// Attendre que le DOM soit chargé
document.addEventListener('DOMContentLoaded', () => {
    // Préchargement des ressources critiques
    const preloadAssets = () => {
        const criticalImages = [
            'assets/images/hero-bg.jpg',
            'assets/images/logo.png'
        ];
        criticalImages.forEach(src => new Image().src = src);
    };

    // Gestion du header
    const header = document.querySelector('.main-header');
    let lastScroll = 0;
    
    const handleScroll = () => {
        const currentScroll = window.pageYOffset;
        if (currentScroll > 60) {
            header.classList.add('sticky');
            header.classList.toggle('header-hidden', currentScroll > lastScroll);
        } else {
            header.classList.remove('sticky', 'header-hidden');
        }
        lastScroll = currentScroll;
    };

    // Animation des sections au scroll
    const animateOnScroll = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
                // Animation spéciale pour la timeline
                if (entry.target.classList.contains('timeline-item')) {
                    entry.target.classList.add('slide-in');
                }
            }
        });
    }, {
        threshold: 0.2,
        rootMargin: "0px"
    });

    // Éléments à animer
    const elementsToAnimate = document.querySelectorAll(`
        .renovation-card,
        .service-column,
        .timeline-item,
        .value-card,
        .brands-slider,
        .history h2,
        .timeline
    `);
    
    elementsToAnimate.forEach(el => animateOnScroll.observe(el));

    // Navigation fluide
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            e.preventDefault();
            const target = document.querySelector(anchor.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    // Menu mobile
    const setupMobileMenu = () => {
        const menuToggle = document.createElement('button');
        menuToggle.className = 'menu-toggle';
        menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
        
        const nav = document.querySelector('.main-nav');
        header.appendChild(menuToggle);

        menuToggle.addEventListener('click', () => {
            nav.classList.toggle('active');
            menuToggle.classList.toggle('active');
        });

        nav.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                nav.classList.remove('active');
                menuToggle.classList.remove('active');
            });
        });
    };

    // Lazy loading des images
    const lazyLoad = () => {
        const lazyImages = document.querySelectorAll('img[data-src]');
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    observer.unobserve(img);
                }
            });
        });

        lazyImages.forEach(img => imageObserver.observe(img));
    };

    // Styles pour les animations
    const addAnimationStyles = () => {
        const style = document.createElement('style');
        style.textContent = `
            .fade-in {
                animation: fadeIn 0.6s ease forwards;
            }

            .slide-in {
                animation: slideIn 0.8s ease forwards;
            }

            @keyframes fadeIn {
                from {
                    opacity: 0;
                    transform: translateY(20px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }

            @keyframes slideIn {
                from {
                    opacity: 0;
                    transform: translateX(-30px);
                }
                to {
                    opacity: 1;
                    transform: translateX(0);
                }
            }

            .sticky {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                background: rgba(255, 255, 255, 0.95);
                backdrop-filter: blur(5px);
                box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
                animation: slideDown 0.3s ease;
                z-index: 1000;
            }

            .header-hidden {
                transform: translateY(-100%);
            }

            @media (max-width: 768px) {
                .menu-toggle {
                    display: block;
                }

                .main-nav {
                    position: fixed;
                    top: 80px;
                    left: 0;
                    right: 0;
                    background: var(--white);
                    padding: 20px;
                    transform: translateY(-100%);
                    opacity: 0;
                    transition: all 0.3s ease;
                    visibility: hidden;
                    z-index: 999;
                }

                .main-nav.active {
                    transform: translateY(0);
                    opacity: 1;
                    visibility: visible;
                }

                .main-nav ul {
                    flex-direction: column;
                    gap: 15px;
                }
            }
        `;
        document.head.appendChild(style);
    };

    // Initialisation
    const init = () => {
        preloadAssets();
        setupMobileMenu();
        lazyLoad();
        addAnimationStyles();
        window.addEventListener('scroll', handleScroll, { passive: true });
    };

    init();
}); 