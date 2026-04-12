// simple animation on scroll
window.addEventListener("scroll", () => {
  let cards = document.querySelectorAll(".card");

  cards.forEach(card => {
    let position = card.getBoundingClientRect().top;

    if (position < window.innerHeight - 50) {
      card.style.transform = "translateY(0)";
      card.style.opacity = "1";
    }
  });
});lucide.createIcons();