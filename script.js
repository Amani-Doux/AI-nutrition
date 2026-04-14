// Initialize Lucide icons
lucide.createIcons();

// ========== MOBILE MENU ==========
function toggleMenu() {
    const menu = document.getElementById("mobileMenu");
    menu.style.display = menu.style.display === "flex" ? "none" : "flex";
}

// ========== DARK MODE ==========
const darkToggle = document.getElementById('darkModeToggle');
darkToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    localStorage.setItem('darkMode', document.body.classList.contains('dark-mode'));
    darkToggle.textContent = document.body.classList.contains('dark-mode') ? '☀️ Light' : '🌙 Dark';
});
if (localStorage.getItem('darkMode') === 'true') {
    document.body.classList.add('dark-mode');
    darkToggle.textContent = '☀️ Light';
}

// ========== DAILY TIP ROTATION (with dynamic icons) ==========
const tips = [
    { text: "Eat a rainbow of fruits and vegetables for diverse nutrients.", icon: "salad" },
    { text: "Drink water before meals to aid digestion and control portions.", icon: "droplet" },
    { text: "Take a 10-minute mindful eating break – chew slowly.", icon: "brain" },
    { text: "Sleep 7-8 hours to regulate hunger hormones.", icon: "moon" },
    { text: "Don't skip breakfast; protein-rich meals keep you full longer.", icon: "sunrise" }
];
let tipIndex = 0;
function rotateTip() {
    const tipEl = document.getElementById('dailyTip');
    const iconEl = document.querySelector('.tip-icon i');
    if (tipEl && iconEl) {
        tipIndex = (tipIndex + 1) % tips.length;
        tipEl.textContent = tips[tipIndex].text;
        iconEl.setAttribute('data-lucide', tips[tipIndex].icon);
        lucide.createIcons(); // re-render icons
    }
}
setInterval(rotateTip, 8000);

// ========== INTERSECTION OBSERVER (scroll reveal) ==========
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('show');
            observer.unobserve(entry.target);
        }
    });
}, { threshold: 0.2 });
document.querySelectorAll('.hidden').forEach(el => observer.observe(el));

// ========== BACK TO TOP BUTTON ==========
const backTop = document.getElementById('backToTop');
window.addEventListener('scroll', () => {
    if (window.scrollY > 500) backTop.classList.add('show');
    else backTop.classList.remove('show');
});
backTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

// ========== SET ACTIVE NAV & YEAR ==========
function setActiveNavLink() {
    const current = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.links a, .mobile-menu a').forEach(link => {
        const href = link.getAttribute('href');
        if (href === current) link.classList.add('active');
        else link.classList.remove('active');
    });
}
setActiveNavLink();
document.getElementById('year').innerText = new Date().getFullYear();

// Smooth Home click handling (prevent reload)
const homeLinks = document.querySelectorAll('.links a[href="index.html"], .mobile-menu a[href="index.html"], .logo');
homeLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        if (link.getAttribute('href') === 'index.html' || link.classList.contains('logo')) {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
            setTimeout(() => {
                document.querySelectorAll('.hidden').forEach(el => {
                    el.classList.remove('show');
                    void el.offsetWidth;
                    observer.observe(el);
                });
            }, 200);
        }
    });
});

// Force initial reveal for hero elements
setTimeout(() => {
    document.querySelectorAll('.hero-left, .hero-right').forEach(el => {
        el.classList.add('show');
    });
}, 100);