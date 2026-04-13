// Initialize Lucide icons (replaces <i> with SVG)
lucide.createIcons();

// Scroll animation for value cards
window.addEventListener("scroll", () => {
  const cards = document.querySelectorAll(".card");
  cards.forEach(card => {
    const position = card.getBoundingClientRect().top;
    if (position < window.innerHeight - 80) {
      card.style.transform = "translateY(0)";
      card.style.opacity = "1";
    }
  });
});

// Trigger animation on load (in case some cards are already visible)
window.dispatchEvent(new Event('scroll'));