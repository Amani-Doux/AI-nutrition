// ========== MOBILE MENU TOGGLE ==========
function toggleMenu() {
    const menu = document.getElementById("mobileMenu");
    if (menu.style.display === "flex") {
        menu.style.display = "none";
    } else {
        menu.style.display = "flex";
    }
}

// ========== DYNAMIC YEAR IN FOOTER ==========
document.getElementById("year").textContent = new Date().getFullYear();

// ========== SET ACTIVE NAV LINK BASED ON CURRENT PAGE ==========
function setActiveNavLink() {
    const currentPage = window.location.pathname.split("/").pop() || "index.html";
    const navLinks = document.querySelectorAll('.links a, .mobile-menu a');
    
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPage) {
            link.classList.add('active');
        } else if (currentPage === "index.html" && href === "index.html") {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}

// ========== SMOOTH PAGE TRANSITION WHEN CLICKING "HOME" ==========
function smoothScrollToTopAndReveal() {
    // Smooth scroll to top
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
    
    // Reset all hidden elements to force re-animation
    setTimeout(() => {
        const allHidden = document.querySelectorAll('.hidden');
        allHidden.forEach(el => {
            el.classList.remove('show');
            void el.offsetWidth;
            if (!el.classList.contains('hidden')) {
                el.classList.add('hidden');
            }
        });
        
        // Re-run observer to animate again
        setTimeout(() => {
            const resetElements = document.querySelectorAll('.hidden');
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('show');
                        entry.target.classList.remove('hidden');
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.15, rootMargin: "0px 0px -20px 0px" });
            
            resetElements.forEach(el => observer.observe(el));
        }, 150);
    }, 300);
}

// Handle Home click for smooth animation (only for same-page navigation)
function handleHomeClick(e) {
    const href = e.currentTarget.getAttribute('href');
    if (href === "index.html" || href === "#" || href === "") {
        e.preventDefault();
        
        // Update active class on navbar links
        document.querySelectorAll('.links a, .mobile-menu a').forEach(link => {
            link.classList.remove('active');
        });
        const desktopHome = document.querySelector('.links a[href="index.html"]');
        if (desktopHome) desktopHome.classList.add('active');
        const mobileHomeLink = document.querySelector('.mobile-menu a[href="index.html"]');
        if (mobileHomeLink) mobileHomeLink.classList.add('active');
        
        // Smooth scroll to top and refresh animation
        smoothScrollToTopAndReveal();
        
        // Close mobile menu if open
        const mobileMenuDiv = document.getElementById('mobileMenu');
        if (mobileMenuDiv.style.display === 'flex') {
            mobileMenuDiv.style.display = 'none';
        }
    }
}

// ========== INTERSECTION OBSERVER FOR SCROLL REVEAL ==========
document.addEventListener('DOMContentLoaded', () => {
    const hiddenElements = document.querySelectorAll('.hidden');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('show');
                entry.target.classList.remove('hidden');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15, rootMargin: "0px 0px -20px 0px" });
    
    hiddenElements.forEach(el => {
        observer.observe(el);
    });
    
    // Show hero immediately if at top
    if (window.scrollY === 0) {
        setTimeout(() => {
            const heroElements = document.querySelectorAll('.hero-left, .hero-right');
            heroElements.forEach(el => {
                el.classList.add('show');
                el.classList.remove('hidden');
            });
        }, 100);
    }
    
    // Close mobile menu on resize
    window.addEventListener('resize', () => {
        const mobileMenuDiv = document.getElementById('mobileMenu');
        if (window.innerWidth > 768 && mobileMenuDiv) {
            mobileMenuDiv.style.display = 'none';
        }
    });
    
    // Set active nav link based on current page
    setActiveNavLink();
    
    // Add click handlers for home links (for smooth animation when already on home page)
    const homeLinks = document.querySelectorAll('.links a[href="index.html"], .mobile-menu a[href="index.html"], .logo');
    homeLinks.forEach(link => {
        link.addEventListener('click', handleHomeClick);
    });
    
    // Add hover effect for cards (already in CSS, but ensure smooth)
    const cards = document.querySelectorAll('.feature-card');
    cards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transition = 'all 0.35s cubic-bezier(0.2, 0.9, 0.4, 1.1)';
        });
    });
    
    // Button click feedback
    const allActionBtns = document.querySelectorAll('.hero-btn-primary, .cta-btn, .btn-primary');
    allActionBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            // Don't prevent default - let it navigate to register.html
            btn.style.transform = 'scale(0.97)';
            setTimeout(() => { btn.style.transform = ''; }, 150);
        });
    });
    
    // Learn More and Begin Journey buttons already have href to aboutus.html and register.html
    // No need to prevent default - they will navigate correctly
});

// Hero image load effect
window.addEventListener('load', () => {
    const img = document.querySelector('.hero-right img');
    if (img) {
        img.style.opacity = '0';
        img.onload = () => {
            img.style.opacity = '1';
            img.style.transition = 'opacity 0.4s';
        };
        if (img.complete) {
            img.style.opacity = '1';
        }
    }
});