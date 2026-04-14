// Initialize Lucide icons
lucide.createIcons();

// Mobile menu toggle
function toggleMenu() {
  const menu = document.getElementById("mobileMenu");
  if (menu.style.display === "flex") {
    menu.style.display = "none";
  } else {
    menu.style.display = "flex";
  }
}

// Scroll animation for hidden elements (value cards, team cards)
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('show');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.2, rootMargin: "0px 0px -20px 0px" });

document.querySelectorAll('.hidden').forEach(el => observer.observe(el));

// Set current year in footer
document.getElementById('year').innerText = new Date().getFullYear();

// Force initial check for any visible hidden elements (e.g., if page loads scrolled)
setTimeout(() => {
  document.querySelectorAll('.hidden').forEach(el => {
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight - 50) {
      el.classList.add('show');
      observer.unobserve(el);
    }
  });
}, 100);