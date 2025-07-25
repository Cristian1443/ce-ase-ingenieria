document.addEventListener("DOMContentLoaded", () => {
    // Elementos del DOM
    const menuToggle = document.querySelector(".menu-toggle");
    const mainNav = document.querySelector(".main-nav");
    const navLinks = document.querySelectorAll(".main-nav .nav-links li a");
    const dropdowns = document.querySelectorAll(".main-nav .dropdown > a");
    const whatsappFloat = document.querySelector(".whatsapp-float");
    const header = document.querySelector(".main-header");
    
    // Configuración de animaciones
    const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };

    // Función para manejar el menú móvil
    function toggleMobileMenu() {
        if (!mainNav) return;
        
        mainNav.classList.toggle("active");
        menuToggle.classList.toggle("active");
        
        // Animar las líneas del botón hamburguesa
        const spans = menuToggle.querySelectorAll("span");
        if (mainNav.classList.contains("active")) {
            spans[0].style.transform = "rotate(45deg) translate(5px, 5px)";
            spans[1].style.opacity = "0";
            spans[2].style.transform = "rotate(-45deg) translate(7px, -6px)";
            document.body.style.overflow = "hidden";
        } else {
            spans[0].style.transform = "none";
            spans[1].style.opacity = "1";
            spans[2].style.transform = "none";
            document.body.style.overflow = "";
        }
    }

    // Función para cerrar el menú móvil
    function closeMobileMenu() {
        if (!mainNav) return;
        
        if (mainNav.classList.contains("active")) {
            mainNav.classList.remove("active");
            menuToggle.classList.remove("active");
            const spans = menuToggle.querySelectorAll("span");
            spans[0].style.transform = "none";
            spans[1].style.opacity = "1";
            spans[2].style.transform = "none";
            document.body.style.overflow = "";
        }
    }

    // Event listeners para el menú
    if (menuToggle) {
        menuToggle.addEventListener("click", toggleMobileMenu);
    }

    // Cerrar menú al hacer clic en un enlace
    navLinks.forEach(link => {
        link.addEventListener("click", () => {
            closeMobileMenu();
        });
    });

    // Manejo del dropdown en móviles
    dropdowns.forEach(dropdown => {
        dropdown.addEventListener("click", (event) => {
            if (window.innerWidth <= 768) {
                event.preventDefault();
                const dropdownContent = dropdown.nextElementSibling;
                if (dropdownContent && dropdownContent.classList.contains("dropdown-content")) {
                    // Cerrar otros dropdowns abiertos
                    document.querySelectorAll(".dropdown-content").forEach(content => {
                        if (content !== dropdownContent && content.style.display === "block") {
                            content.style.display = "none";
                        }
                    });
                    
                    // Toggle del dropdown actual
                    if (dropdownContent.style.display === "block") {
                        dropdownContent.style.display = "none";
                    } else {
                        dropdownContent.style.display = "block";
                    }
                }
            }
        });
    });

    // Cerrar menú al hacer clic fuera
    document.addEventListener("click", (event) => {
        if (!mainNav.contains(event.target) && !menuToggle.contains(event.target)) {
            closeMobileMenu();
            document.querySelectorAll(".dropdown-content").forEach(content => {
                content.style.display = "";
            });
        }
    });

    // Header con scroll
    function handleHeaderScroll() {
        if (window.scrollY > 100) {
            header.classList.add("scrolled");
        } else {
            header.classList.remove("scrolled");
        }
    }

    // Smooth scroll para enlaces internos
    function smoothScrollTo(target) {
        const element = document.querySelector(target);
        if (element) {
            const headerHeight = header.offsetHeight;
            const elementPosition = element.offsetTop - headerHeight - 20;
            
            window.scrollTo({
                top: elementPosition,
                behavior: "smooth"
            });
        }
    }

    // Aplicar smooth scroll a enlaces internos
    document.querySelectorAll("a[href^=\"#\"]").forEach(link => {
        link.addEventListener("click", (event) => {
            const href = link.getAttribute("href");
            if (href !== "#") {
                event.preventDefault();
                smoothScrollTo(href);
            }
        });
    });

    // Animaciones al hacer scroll
    function animateOnScroll(entries, observer) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("animate-in");
                observer.unobserve(entry.target);
            }
        });
    }

    // Observador para animaciones
    const scrollObserver = new IntersectionObserver(animateOnScroll, observerOptions);

    // Elementos a animar
    const animateElements = document.querySelectorAll(".service-card, .product-card, .feature-item, .brand-item, .contact-item-large");
    animateElements.forEach(el => {
        el.classList.add("animate-on-scroll");
        scrollObserver.observe(el);
    });

    // Animación de números en las estadísticas
    function animateNumbers() {
        const statNumbers = document.querySelectorAll(".stat-number");
        
        statNumbers.forEach(stat => {
            const target = stat.textContent;
            const isPercentage = target.includes("%");
            const isPlus = target.includes("+");
            const isTime = target.includes("/");
            
            let numericValue;
            if (isTime) {
                numericValue = 24; // Para "24/7"
            } else {
                numericValue = parseInt(target.replace(/\\D/g, ""));
            }
            
            let current = 0;
            const increment = numericValue / 50;
            const timer = setInterval(() => {
                current += increment;
                if (current >= numericValue) {
                    current = numericValue;
                    clearInterval(timer);
                }
                
                if (isTime) {
                    stat.textContent = Math.floor(current) + "/7";
                } else if (isPlus) {
                    stat.textContent = Math.floor(current) + "+";
                } else if (isPercentage) {
                    stat.textContent = Math.floor(current) + "%";
                } else {
                    stat.textContent = Math.floor(current);
                }
            }, 30);
        });
    }

    // Trigger animación de números cuando el hero section esté visible
    const heroObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateNumbers();
                heroObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    const heroSection = document.querySelector(".hero-section");
    if (heroSection) {
        heroObserver.observe(heroSection);
    }

    // Efecto parallax para el hero section
    function handleParallax() {
        const scrolled = window.pageYOffset;
        const heroBackground = document.querySelector(".hero-background");
        if (heroBackground) {
            heroBackground.style.transform = `translateY(${scrolled * 0.5}px)`;
        }
    }

    // Efecto hover para las tarjetas de servicios
    function addServiceCardEffects() {
        const serviceCards = document.querySelectorAll(".service-card");
        
        serviceCards.forEach(card => {
            card.addEventListener("mouseenter", () => {
                card.style.transform = "translateY(-10px) scale(1.02)";
            });
            
            card.addEventListener("mouseleave", () => {
                card.style.transform = "translateY(0) scale(1)";
            });
        });
    }

    // Efecto hover para las tarjetas de productos
    function addProductCardEffects() {
        const productCards = document.querySelectorAll(".product-card");
        
        productCards.forEach(card => {
            card.addEventListener("mouseenter", () => {
                const overlay = card.querySelector(".product-overlay");
                if (overlay) {
                    overlay.style.opacity = "1";
                }
            });
            
            card.addEventListener("mouseleave", () => {
                const overlay = card.querySelector(".product-overlay");
                if (overlay) {
                    overlay.style.opacity = "0";
                }
            });
        });
    }

    // Animación del botón de WhatsApp
    function addWhatsAppAnimation() {
        if (whatsappFloat) {
            whatsappFloat.addEventListener("mouseenter", () => {
                whatsappFloat.style.animation = "none";
                setTimeout(() => {
                    whatsappFloat.style.animation = "pulse 1s infinite";
                }, 10);
            });
            
            whatsappFloat.addEventListener("mouseleave", () => {
                whatsappFloat.style.animation = "pulse 2s infinite";
            });
        }
    }

    // Lazy loading para imágenes
    function setupLazyLoading() {
        const images = document.querySelectorAll("img[data-src]");
        
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove("lazy");
                    imageObserver.unobserve(img);
                }
            });
        });

        images.forEach(img => imageObserver.observe(img));
    }

    // Validación de formularios (si existen)
    function setupFormValidation() {
        const forms = document.querySelectorAll("form");
        
        forms.forEach(form => {
            form.addEventListener("submit", (event) => {
                event.preventDefault();
                
                // Aquí puedes agregar lógica de validación
                const formData = new FormData(form);
                console.log("Formulario enviado:", Object.fromEntries(formData));
                
                // Simular envío exitoso
                showNotification("Mensaje enviado correctamente", "success");
            });
        });
    }

    // Sistema de notificaciones
    function showNotification(message, type = "info") {
        const notification = document.createElement("div");
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <span class="notification-message">${message}</span>
                <button class="notification-close">&times;</button>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        // Animar entrada
        setTimeout(() => {
            notification.classList.add("show");
        }, 100);
        
        // Auto cerrar después de 5 segundos
        setTimeout(() => {
            hideNotification(notification);
        }, 5000);
        
        // Cerrar manualmente
        const closeBtn = notification.querySelector(".notification-close");
        closeBtn.addEventListener("click", () => {
            hideNotification(notification);
        });
    }

    function hideNotification(notification) {
        notification.classList.remove("show");
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }

    // Contador de visitas (simulado)
    function updateVisitCounter() {
        const visitCount = localStorage.getItem("visitCount") || 0;
        const newCount = parseInt(visitCount) + 1;
        localStorage.setItem("visitCount", newCount);
        
        // Actualizar en la página si existe un elemento para mostrar
        const counterElement = document.querySelector(".visit-counter");
        if (counterElement) {
            counterElement.textContent = newCount;
        }
    }

    // Preloader
    function hidePreloader() {
        const preloader = document.querySelector(".preloader");
        if (preloader) {
            preloader.style.opacity = "0";
            setTimeout(() => {
                preloader.style.display = "none";
            }, 500);
        }
    }

    // Inicializar todas las funcionalidades
    function init() {
        // Event listeners para scroll
        window.addEventListener("scroll", handleHeaderScroll);
        window.addEventListener("scroll", handleParallax);
        
        // Event listeners para resize
        window.addEventListener("resize", () => {
            if (window.innerWidth > 768) {
                closeMobileMenu();
                document.querySelectorAll(".dropdown-content").forEach(content => {
                    content.style.display = "";
                });
            }
        });
        
        // Inicializar efectos
        addServiceCardEffects();
        addProductCardEffects();
        addWhatsAppAnimation();
        setupLazyLoading();
        setupFormValidation();
        
        // Actualizar contador de visitas
        updateVisitCounter();
        
        // Ocultar preloader
        setTimeout(hidePreloader, 1000);
        
        // Mostrar mensaje de bienvenida
        setTimeout(() => {
            showNotification("¡Bienvenido a CE ASE INGENIERIA! ¿En qué podemos ayudarte?", "info");
        }, 2000);
    }

    // Inicializar cuando el DOM esté listo
    init();

    // MODAL DE CATÁLOGO DE PRODUCTOS
    const openCatalogModalBtn = document.getElementById('openCatalogModal');
    const catalogModal = document.getElementById('catalogModal');
    const closeCatalogModalBtn = document.getElementById('closeCatalogModal');

    if (openCatalogModalBtn && catalogModal && closeCatalogModalBtn) {
        openCatalogModalBtn.addEventListener('click', function() {
            catalogModal.classList.add('open');
            document.body.style.overflow = 'hidden';
        });
        closeCatalogModalBtn.addEventListener('click', function() {
            catalogModal.classList.remove('open');
            document.body.style.overflow = '';
        });
        catalogModal.addEventListener('click', function(e) {
            if (e.target === catalogModal) {
                catalogModal.classList.remove('open');
                document.body.style.overflow = '';
            }
        });
    }
});

// Agregar estilos CSS para las animaciones
const style = document.createElement("style");
style.textContent = `
    .animate-on-scroll {
        opacity: 0;
        transform: translateY(30px);
        transition: all 0.6s ease;
    }
    
    .animate-on-scroll.animate-in {
        opacity: 1;
        transform: translateY(0);
    }
    
    .main-header.scrolled {
        background: rgba(255, 255, 255, 0.95);
        backdrop-filter: blur(10px);
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
    }
    
    .notification {
        position: fixed;
        top: 20px;
        right: 20px;
        background: white;
        border-radius: 8px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
        padding: 15px 20px;
        z-index: 10000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
        max-width: 300px;
    }
    
    .notification.show {
        transform: translateX(0);
    }
    
    .notification-success {
        border-left: 4px solid #10b981;
    }
    
    .notification-info {
        border-left: 4px solid #3b82f6;
    }
    
    .notification-warning {
        border-left: 4px solid #f59e0b;
    }
    
    .notification-error {
        border-left: 4px solid #ef4444;
    }
    
    .notification-content {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 10px;
    }
    
    .notification-close {
        background: none;
        border: none;
        font-size: 18px;
        cursor: pointer;
        color: #6b7280;
        padding: 0;
        width: 20px;
        height: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    
    .notification-close:hover {
        color: #374151;
    }
    
    .preloader {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: #2563eb;
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
        transition: opacity 0.5s ease;
    }
    
    .preloader::after {
        content: "";
        width: 50px;
        height: 50px;
        border: 3px solid #ffffff;
        border-top: 3px solid transparent;
        border-radius: 50%;
        animation: spin 1s linear infinite;
    }
    
    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
    
    .lazy {
        opacity: 0;
        transition: opacity 0.3s ease;
    }
    
    .lazy.loaded {
        opacity: 1;
    }
`;

document.head.appendChild(style);
