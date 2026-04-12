// Blog posts data with working Unsplash images
const blogPosts = [
  {
    id: 1,
    title: "10 Tips for Healthy Eating",
    excerpt: "Discover practical tips to improve your diet and boost your health. Simple changes make a big difference.",
    date: "April 12, 2026",
    category: "Nutrition",
    imageUrl: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=800&h=500&fit=crop"
  },
  {
    id: 2,
    title: "AI in Nutrition: Smart Calorie Tracking",
    excerpt: "How artificial intelligence is revolutionizing the way we understand and track daily food intake with precision.",
    date: "April 8, 2026",
    category: "Technology",
    imageUrl: "https://images.unsplash.com/photo-1581091226033-d5c48150dbaa?w=800&h=500&fit=crop"
  },
  {
    id: 3,
    title: "Postpartum Nutrition: Rebuilding Strength",
    excerpt: "A compassionate guide to nourishing your body after childbirth, with practical meal ideas and recovery tips.",
    date: "April 3, 2026",
    category: "Wellness",
    imageUrl: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&h=500&fit=crop"
  },
  {
    id: 4,
    title: "Fitness & Diet: Perfect Synergy",
    excerpt: "Combine workouts with nutrition plans for better results. Fuel your performance naturally.",
    date: "March 28, 2026",
    category: "Fitness",
    imageUrl: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800&h=500&fit=crop"
  },
  {
    id: 5,
    title: "5 Easy Healthy Recipes",
    excerpt: "Delicious recipes that are quick to prepare and good for your body. From breakfast to dinner.",
    date: "March 22, 2026",
    category: "Recipes",
    imageUrl: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&h=500&fit=crop"
  },
  {
    id: 6,
    title: "Understanding Insulin Resistance and Weight Loss",
    excerpt: "Discover how insulin resistance affects your ability to lose weight and practical steps to overcome it.",
    date: "April 10, 2026",
    category: "Health",
    imageUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=500&fit=crop"
  }
];

// Helper: generate calendar SVG
function getCalendarSVG() {
  return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>`;
}

// Escape HTML to prevent injection
function escapeHtml(str) {
  return str.replace(/[&<>]/g, function(m) {
    if (m === '&') return '&amp;';
    if (m === '<') return '&lt;';
    if (m === '>') return '&gt;';
    return m;
  });
}

// Render all blog cards
function renderBlogCards() {
  const container = document.getElementById('blogGridContainer');
  if (!container) return;

  let cardsHTML = '';
  blogPosts.forEach(post => {
    cardsHTML += `
      <div class="blog-card">
        <div class="card-img" style="background-image: url('${post.imageUrl}'); background-size: cover; background-position: center;">
          <div class="img-category">${escapeHtml(post.category)}</div>
        </div>
        <div class="card-content">
          <div class="meta-info">
            <span class="meta-date">
              ${getCalendarSVG()}
              <span>${escapeHtml(post.date)}</span>
            </span>
            <span style="background: #eff7ed; padding: 2px 10px; border-radius: 40px;">${escapeHtml(post.category)}</span>
          </div>
          <h3 class="card-title">${escapeHtml(post.title)}</h3>
          <p class="card-excerpt">${escapeHtml(post.excerpt)}</p>
        </div>
      </div>
    `;
  });
  container.innerHTML = cardsHTML;
}

// Mobile menu toggle function
function toggleMenu() {
  const menu = document.getElementById("mobileMenu");
  if (menu.style.display === "flex") {
    menu.style.display = "none";
  } else {
    menu.style.display = "flex";
  }
}

// Set footer dynamic year
document.getElementById("year").textContent = new Date().getFullYear();

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
  renderBlogCards();
  
  const mobileMenu = document.getElementById("mobileMenu");
  if (mobileMenu) mobileMenu.style.display = "none";
  
  // Close mobile menu on window resize if screen becomes larger
  window.addEventListener('resize', () => {
    if (window.innerWidth > 768 && mobileMenu.style.display === "flex") {
      mobileMenu.style.display = "none";
    }
  });
});