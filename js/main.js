// Attendre que le DOM soit chargé
document.addEventListener('DOMContentLoaded', () => {
    // Optimisation des performances
    const performanceOptimizer = {
        init() {
            this.lazyLoadImages();
            this.deferNonCriticalCSS();
            this.setupIntersectionObserver();
            this.optimizeEventListeners();
        },

        lazyLoadImages() {
            // Utilisation de loading="lazy" pour les images non critiques
            document.querySelectorAll('img:not([loading])').forEach(img => {
                if (!img.classList.contains('critical')) {
                    img.loading = 'lazy';
                }
            });

            // Préchargement des images critiques
            const criticalImages = ['logo.png'];
            criticalImages.forEach(img => {
                const link = document.createElement('link');
                link.rel = 'preload';
                link.as = 'image';
                link.href = `assets/images/${img}`;
                document.head.appendChild(link);
            });
        },

        deferNonCriticalCSS() {
            // Chargement différé des styles non critiques
            const nonCriticalCSS = [
                'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css'
            ];

            nonCriticalCSS.forEach(href => {
                const link = document.createElement('link');
                link.rel = 'stylesheet';
                link.href = href;
                link.media = 'print';
                link.onload = () => { link.media = 'all' };
                document.head.appendChild(link);
            });
        },

        setupIntersectionObserver() {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('visible');
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.1 });

            document.querySelectorAll('.animate-on-scroll').forEach(el => {
                observer.observe(el);
            });
        },

        optimizeEventListeners() {
            // Debounce du scroll
            let scrollTimeout;
            const header = document.querySelector('.main-header');
            let lastScroll = 0;

            window.addEventListener('scroll', () => {
                if (!scrollTimeout) {
                    scrollTimeout = setTimeout(() => {
                        const currentScroll = window.pageYOffset;
                        if (currentScroll > 60) {
                            header.classList.add('sticky');
                            header.classList.toggle('header-hidden', currentScroll > lastScroll);
                        } else {
                            header.classList.remove('sticky', 'header-hidden');
                        }
                        lastScroll = currentScroll;
                        scrollTimeout = null;
                    }, 16); // ~60fps
                }
            }, { passive: true });
        }
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
        .timeline,
        .how-to-card,
        .section-header
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
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    const mainNav = document.querySelector('.main-nav');
    const overlay = document.querySelector('.overlay');
    
    if (menuToggle && mainNav && overlay) {
        menuToggle.addEventListener('click', function() {
            mainNav.classList.toggle('active');
            overlay.classList.toggle('active');
            document.body.classList.toggle('no-scroll');
        });
        
        overlay.addEventListener('click', function() {
            mainNav.classList.remove('active');
            overlay.classList.remove('active');
            document.body.classList.remove('no-scroll');
        });
        
        // Fermer le menu en cliquant sur un lien
        const navLinks = mainNav.querySelectorAll('a');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                mainNav.classList.remove('active');
                overlay.classList.remove('active');
                document.body.classList.remove('no-scroll');
            });
        });
    }
    
    // Ajouter la classe no-scroll au body
    document.head.insertAdjacentHTML('beforeend', `
        <style>
            body.no-scroll {
                overflow: hidden;
            }
        </style>
    `);

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
        performanceOptimizer.init();
        lazyLoad();
        addAnimationStyles();
        window.addEventListener('scroll', handleScroll, { passive: true });
    };

    init();

    // Frise chronologique horizontale
    const slider = document.querySelector('.timeline-slider');
    const prevBtn = document.querySelector('.timeline-nav.prev');
    const nextBtn = document.querySelector('.timeline-nav.next');
    const yearLinks = document.querySelectorAll('.year-link');
    
    if (slider && prevBtn && nextBtn) {
        // Navigation avec les boutons
        prevBtn.addEventListener('click', () => {
            slider.scrollBy({ left: -slider.offsetWidth, behavior: 'smooth' });
        });
        
        nextBtn.addEventListener('click', () => {
            slider.scrollBy({ left: slider.offsetWidth, behavior: 'smooth' });
        });
        
        // Mise à jour de l'année active lors du défilement
        slider.addEventListener('scroll', () => {
            const slides = document.querySelectorAll('.timeline-slide');
            const scrollPosition = slider.scrollLeft;
            const slideWidth = slider.offsetWidth;
            
            slides.forEach((slide, index) => {
                const slidePosition = index * slideWidth;
                if (scrollPosition >= slidePosition - slideWidth / 2 && 
                    scrollPosition < slidePosition + slideWidth / 2) {
                    // Mettre à jour la classe active
                    yearLinks.forEach(link => link.classList.remove('active'));
                    yearLinks[index].classList.add('active');
                }
            });
        });
        
        // Navigation avec les liens d'années
        yearLinks.forEach((link, index) => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const slideId = link.getAttribute('href');
                const targetSlide = document.querySelector(slideId);
                
                if (targetSlide) {
                    slider.scrollTo({
                        left: index * slider.offsetWidth,
                        behavior: 'smooth'
                    });
                    
                    // Mettre à jour la classe active
                    yearLinks.forEach(l => l.classList.remove('active'));
                    link.classList.add('active');
                }
            });
        });
    }
}); 