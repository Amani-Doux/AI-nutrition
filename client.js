// Mobile menu toggle
function toggleMenu() {
  const menu = document.getElementById("mobileMenu");
  if (menu.style.display === "flex") {
    menu.style.display = "none";
  } else {
    menu.style.display = "flex";
  }
}

document.getElementById("year").textContent = new Date().getFullYear();

// User data
let userData = {
  fullName: "Sarah Williams",
  age: 32,
  email: "sarah.williams@nutriai.com",
  healthGoal: "lose",
  startingWeight: 95,
  currentWeight: 88,
  targetWeight: 75,
  mealsLogged: 47,
  streak: 14,
  planCompleted: 14,
  planTotalDays: 28,
  consultations: [
    { type: "Initial Consultation", date: "2024-01-15", time: "10:00 AM" }
  ],
  premium: true,
  currentPlan: {
    name: "Low Carb Diet",
    duration: "4 weeks",
    dailyCalories: 1800
  }
};

// Navigation
function initNavigation() {
  document.querySelectorAll(".nav-item").forEach(item => {
    item.addEventListener("click", (e) => {
      e.preventDefault();
      const page = item.getAttribute("data-page");
      if (page) {
        setActiveNav(page);
        loadPage(page);
      }
    });
  });
}

function setActiveNav(activePage) {
  document.querySelectorAll(".nav-item").forEach(item => {
    const page = item.getAttribute("data-page");
    if (page === activePage) item.classList.add("active");
    else item.classList.remove("active");
  });
}

function loadPage(page) {
  const pages = {
    dashboard: renderDashboard,
    profile: renderProfile,
    "ai-tracking": renderAITracking,
    consultation: renderConsultation,
    progress: renderProgress,
    "nutrition-plan": renderNutritionPlan,
    premium: renderPremium
  };
  if (pages[page]) pages[page]();
  else renderDashboard();
}

// DASHBOARD
function renderDashboard() {
  const container = document.getElementById("pageContainer");
  const firstName = userData.fullName.split(" ")[0];
  container.innerHTML = `
    <div class="welcome-center">
      <h1>Welcome, ${firstName}</h1>
      <p>Your professional nutrition dashboard is ready</p>
    </div>
    <div class="action-grid">
      <div class="action-card" data-nav="ai-tracking">
        <div class="action-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><polygon points="12 2 2 7 12 12 22 7 12 2"></polygon><polyline points="2 17 12 22 22 17"></polyline><polyline points="2 12 12 17 22 12"></polyline></svg></div>
        <h3>Meal Analysis</h3><p>Upload and analyze meals with AI</p>
      </div>
      <div class="action-card" data-nav="consultation">
        <div class="action-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg></div>
        <h3>Consultations</h3><p>Schedule sessions with experts</p>
      </div>
      <div class="action-card" data-nav="nutrition-plan">
        <div class="action-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M12 2a10 10 0 1 0 10 10"></path><path d="M12 6v6l4 2"></path></svg></div>
        <h3>Nutrition Plan</h3><p>View your personalized meal protocol</p>
      </div>
      <div class="action-card" data-nav="progress">
        <div class="action-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line></svg></div>
        <h3>Progress Tracking</h3><p>Monitor your health journey</p>
      </div>
    </div>
  `;
  document.querySelectorAll(".action-card").forEach(card => {
    card.addEventListener("click", () => {
      const page = card.getAttribute("data-nav");
      if (page) { setActiveNav(page); loadPage(page); }
    });
  });
}

// PROFILE
function renderProfile() {
  const container = document.getElementById("pageContainer");
  container.innerHTML = `
    <div class="welcome-center"><h1>Professional Profile</h1><p>Manage your personal health information</p></div>
    <div class="profile-grid">
      <div class="info-card"><h3>Personal Information</h3>
        <div class="form-group"><label>Full Name</label><input type="text" id="fullNameInput" value="${userData.fullName}"></div>
        <div class="form-group"><label>Age</label><input type="number" id="ageInput" value="${userData.age}"></div>
        <div class="form-group"><label>Email</label><input type="email" id="emailInput" value="${userData.email}"></div>
        <div class="form-group"><label>Health Goal</label>
          <select id="healthGoalSelect">
            <option value="lose" ${userData.healthGoal === 'lose' ? 'selected' : ''}>Lose weight - Shed those extra pounds</option>
            <option value="maintain" ${userData.healthGoal === 'maintain' ? 'selected' : ''}>Maintain weight - Stay healthy & balanced</option>
            <option value="gain" ${userData.healthGoal === 'gain' ? 'selected' : ''}>Gain weight - Build muscle & mass</option>
          </select>
        </div>
        <button class="btn-primary" id="savePersonalBtn">Save Changes</button>
      </div>
      <div class="info-card"><h3>Weight Management</h3>
        <div class="form-group"><label>Starting Weight (kg)</label><input type="number" id="startingWeightInput" value="${userData.startingWeight}" step="0.1"></div>
        <div class="form-group"><label>Current Weight (kg)</label><input type="number" id="currentWeightInput" value="${userData.currentWeight}" step="0.1"></div>
        <div class="form-group"><label>Target Weight (kg)</label><input type="number" id="targetWeightInput" value="${userData.targetWeight}" step="0.1"></div>
        <button class="btn-primary" id="saveWeightBtn">Update Weight</button>
      </div>
    </div>
  `;
  document.getElementById("savePersonalBtn")?.addEventListener("click", () => {
    userData.fullName = document.getElementById("fullNameInput").value;
    userData.age = parseInt(document.getElementById("ageInput").value);
    userData.email = document.getElementById("emailInput").value;
    userData.healthGoal = document.getElementById("healthGoalSelect").value;
    alert("Personal information saved!");
    renderProfile();
  });
  document.getElementById("saveWeightBtn")?.addEventListener("click", () => {
    userData.startingWeight = parseFloat(document.getElementById("startingWeightInput").value);
    userData.currentWeight = parseFloat(document.getElementById("currentWeightInput").value);
    userData.targetWeight = parseFloat(document.getElementById("targetWeightInput").value);
    alert("Weight updated!");
    renderProfile();
  });
}

// AI TRACKING
function renderAITracking() {
  const container = document.getElementById("pageContainer");
  container.innerHTML = `
    <div class="ai-page">
      <div class="ai-page-header">
        <h1>AI Meal Analysis</h1>
        <p>Upload a photo of your meal and get instant nutritional insights</p>
      </div>

      <div class="ai-main-card">
        <div class="upload-section" id="uploadSection">
          <div class="upload-zone" id="uploadZone">
            <div class="upload-icon-wrapper">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#16a34a" stroke-width="1.5">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline points="17 8 12 3 7 8"></polyline>
                <line x1="12" y1="3" x2="12" y2="15"></line>
              </svg>
            </div>
            <h3>Upload your meal image</h3>
            <p>Drag & drop or click to browse</p>
            <label class="upload-btn" for="mealImageInput">Select Image</label>
            <input type="file" id="mealImageInput" accept="image/*" hidden>
          </div>
        </div>

        <div class="preview-section" id="previewSection" style="display: none;">
          <div class="preview-container">
            <div class="preview-image-wrapper">
              <img id="previewImg" class="preview-image" alt="Meal preview">
            </div>
            <div style="display: flex; gap: 12px; margin-top: 16px;">
              <button class="analyze-btn" id="analyzeBtn">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" y1="8" x2="12" y2="16"></line>
                  <line x1="8" y1="12" x2="16" y2="12"></line>
                </svg>
                Analyze Meal
              </button>
              <button class="reset-btn" id="resetBtn">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
                Cancel
              </button>
            </div>
          </div>
        </div>

        <div class="loading-section" id="loadingSection" style="display: none;">
          <div class="loading-spinner"></div>
          <p>Analyzing your meal...</p>
          <p class="loading-subtitle">Our AI is identifying ingredients and calculating nutrients</p>
        </div>

        <div class="results-section" id="resultsSection" style="display: none;">
          <div class="results-header">
            <div class="results-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            </div>
            <h3>Analysis Complete</h3>
          </div>

          <div class="nutrition-grid">
            <div class="nutrition-card"><div class="nutrition-value" id="caloriesValue">---</div><div class="nutrition-label">Calories</div></div>
            <div class="nutrition-card"><div class="nutrition-value" id="proteinValue">---</div><div class="nutrition-label">Protein</div></div>
            <div class="nutrition-card"><div class="nutrition-value" id="carbsValue">---</div><div class="nutrition-label">Carbs</div></div>
            <div class="nutrition-card"><div class="nutrition-value" id="fatsValue">---</div><div class="nutrition-label">Fats</div></div>
          </div>

          <div class="detected-foods"><h4>Detected Foods</h4><p id="detectedFoods">-</p></div>

          <div class="recommendation-box">
            <div class="recommendation-icon"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#16a34a" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg></div>
            <div><strong>Nutrition Score: <span id="nutritionScore">-</span></strong><p id="recommendation">-</p></div>
          </div>

          <button class="new-analysis-btn" id="newAnalysisBtn">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12a9 9 0 1 1-9-9"></path><polyline points="12 6 12 12 16 14"></polyline></svg>
            New Analysis
          </button>
        </div>
      </div>

      <div class="stats-summary">
        <div class="stat-item"><div class="stat-number" id="totalMealsCount">${userData.mealsLogged}</div><div class="stat-label">Total Meals Analyzed</div></div>
        <div class="stat-divider"></div>
        <div class="stat-item"><div class="stat-number">${userData.streak}</div><div class="stat-label">Day Streak</div></div>
      </div>
    </div>
  `;

  const uploadZone = document.getElementById('uploadZone');
  const fileInput = document.getElementById('mealImageInput');
  const uploadSection = document.getElementById('uploadSection');
  const previewSection = document.getElementById('previewSection');
  const loadingSection = document.getElementById('loadingSection');
  const resultsSection = document.getElementById('resultsSection');
  const previewImg = document.getElementById('previewImg');
  const analyzeBtn = document.getElementById('analyzeBtn');
  const resetBtn = document.getElementById('resetBtn');
  const newAnalysisBtn = document.getElementById('newAnalysisBtn');

  let currentFile = null;

  function resetToUpload() {
    uploadSection.style.display = 'block';
    previewSection.style.display = 'none';
    loadingSection.style.display = 'none';
    resultsSection.style.display = 'none';
    if (uploadZone) uploadZone.classList.remove('dragover');
  }

  function handleFileSelect(file) {
    if (!file || !file.type.startsWith('image/')) return;
    currentFile = file;
    const reader = new FileReader();
    reader.onload = (e) => {
      previewImg.src = e.target.result;
      uploadSection.style.display = 'none';
      previewSection.style.display = 'block';
      resultsSection.style.display = 'none';
    };
    reader.readAsDataURL(file);
  }

  if (uploadZone) {
    uploadZone.addEventListener('click', () => fileInput.click());
    uploadZone.addEventListener('dragover', (e) => { e.preventDefault(); uploadZone.classList.add('dragover'); });
    uploadZone.addEventListener('dragleave', () => { uploadZone.classList.remove('dragover'); });
    uploadZone.addEventListener('drop', (e) => {
      e.preventDefault();
      uploadZone.classList.remove('dragover');
      const file = e.dataTransfer.files[0];
      if (file && file.type.startsWith('image/')) handleFileSelect(file);
    });
  }

  if (fileInput) {
    fileInput.addEventListener('change', (e) => { if (e.target.files[0]) handleFileSelect(e.target.files[0]); });
  }

  if (resetBtn) {
    resetBtn.addEventListener('click', () => { resetToUpload(); if (fileInput) fileInput.value = ''; currentFile = null; });
  }

  if (newAnalysisBtn) {
    newAnalysisBtn.addEventListener('click', () => { resetToUpload(); if (fileInput) fileInput.value = ''; currentFile = null; });
  }

  if (analyzeBtn) {
    analyzeBtn.addEventListener('click', () => {
      if (!currentFile) return;
      previewSection.style.display = 'none';
      loadingSection.style.display = 'block';
      setTimeout(() => {
        userData.mealsLogged++;
        const meals = [
          { calories: 425, protein: 32, carbs: 48, fats: 16, foods: "Grilled chicken breast (150g), Quinoa (120g), Roasted broccoli", score: "A", recommendation: "Excellent protein source. Add a serving of healthy fats like avocado." },
          { calories: 385, protein: 18, carbs: 52, fats: 12, foods: "Salmon fillet (120g), Sweet potato (150g), Asparagus", score: "A-", recommendation: "Great omega-3 source. Consider adding leafy greens." },
          { calories: 520, protein: 25, carbs: 65, fats: 18, foods: "Lean beef (120g), Brown rice (150g), Mixed vegetables", score: "B+", recommendation: "Well-balanced meal. Slightly high in carbs, adjust portion size." },
          { calories: 350, protein: 22, carbs: 35, fats: 14, foods: "Tofu stir-fry (180g), Quinoa (100g), Bok choy", score: "A", recommendation: "Excellent plant-based protein. Great variety of vegetables." }
        ];
        const result = meals[Math.floor(Math.random() * meals.length)];
        const caloriesEl = document.getElementById('caloriesValue');
        const proteinEl = document.getElementById('proteinValue');
        const carbsEl = document.getElementById('carbsValue');
        const fatsEl = document.getElementById('fatsValue');
        const foodsEl = document.getElementById('detectedFoods');
        const scoreEl = document.getElementById('nutritionScore');
        const recEl = document.getElementById('recommendation');
        const mealsCountEl = document.getElementById('totalMealsCount');
        if (caloriesEl) caloriesEl.textContent = result.calories;
        if (proteinEl) proteinEl.textContent = result.protein + 'g';
        if (carbsEl) carbsEl.textContent = result.carbs + 'g';
        if (fatsEl) fatsEl.textContent = result.fats + 'g';
        if (foodsEl) foodsEl.textContent = result.foods;
        if (scoreEl) scoreEl.textContent = result.score;
        if (recEl) recEl.textContent = result.recommendation;
        if (mealsCountEl) mealsCountEl.textContent = userData.mealsLogged;
        loadingSection.style.display = 'none';
        resultsSection.style.display = 'block';
      }, 2000);
    });
  }
}

// CONSULTATION
function renderConsultation() {
  const container = document.getElementById("pageContainer");
  container.innerHTML = `
    <div class="welcome-center"><h1>Professional Consultations</h1><p>Schedule sessions with certified specialists</p></div>
    <div class="info-card"><h3>Book New Consultation</h3>
      <div class="form-group"><label>Select Specialist</label><select id="specialist"><option>Dr. Emily Carter - Clinical Nutritionist</option><option>Prof. James Wilson - Sports Nutrition</option><option>Dr. Maria Lopez - Weight Management</option></select></div>
      <div class="form-group"><label>Consultation Type</label><select id="consultationType"><option>Initial Consultation (60 min)</option><option>Follow-up Session (30 min)</option><option>Premium Coaching (90 min)</option></select></div>
      <div class="form-group"><label>Preferred Date</label><input type="date" id="consultDate"></div>
      <div class="form-group"><label>Preferred Time</label><input type="time" id="consultTime"></div>
      <button class="btn-primary" id="bookBtn">Confirm Booking</button>
    </div>
  `;
  document.getElementById("bookBtn")?.addEventListener("click", () => {
    const date = document.getElementById("consultDate").value;
    const time = document.getElementById("consultTime").value;
    if (!date || !time) { alert("Please select date and time."); return; }
    const type = document.getElementById("consultationType").value;
    userData.consultations.push({ type, date, time });
    alert(`Consultation confirmed for ${date} at ${time}`);
    renderConsultation();
  });
}

// PROGRESS
function renderProgress() {
  const container = document.getElementById("pageContainer");
  const weightLost = userData.startingWeight - userData.currentWeight;
  const weightProgressPercent = ((weightLost) / (userData.startingWeight - userData.targetWeight) * 100).toFixed(0);
  const planProgressPercent = (userData.planCompleted / userData.planTotalDays * 100).toFixed(0);
  const overallProgress = ((parseInt(weightProgressPercent) + parseInt(planProgressPercent)) / 2).toFixed(0);
  
  container.innerHTML = `
    <div class="welcome-center"><h1>Progress Dashboard</h1><p>Track your health journey</p></div>
    <div class="progress-dashboard">
      <div class="progress-overview">
        <div class="goal-card"><h3>Goal Progress</h3>
          <div class="goal-stat"><span class="goal-label">Starting Weight</span><span class="goal-value">${userData.startingWeight} kg</span></div>
          <div class="goal-stat"><span class="goal-label">Current Weight</span><span class="goal-value">${userData.currentWeight} kg</span></div>
          <div class="goal-stat"><span class="goal-label">Target Weight</span><span class="goal-value">${userData.targetWeight} kg</span></div>
          <div class="progress-percent">${weightProgressPercent}%</div>
          <div class="progress-bar"><div class="progress-fill" style="width: ${weightProgressPercent}%;"></div></div>
        </div>
        <div class="goal-card"><h3>Plan Completion</h3>
          <div class="goal-stat"><span class="goal-label">Completed</span><span class="goal-value">${userData.planCompleted} / ${userData.planTotalDays} days</span></div>
          <div class="progress-percent">${planProgressPercent}%</div>
          <div class="progress-bar"><div class="progress-fill" style="width: ${planProgressPercent}%;"></div></div>
        </div>
      </div>
      <div class="info-card"><h3>Nutrition Plans</h3>
        <div class="plan-card"><div class="plan-title">${userData.currentPlan.name}</div><div>Duration: ${userData.currentPlan.duration} | Daily Calories: ${userData.currentPlan.dailyCalories} kcal/day</div></div>
      </div>
      <div class="info-card"><h3>Consultations</h3>
        ${userData.consultations.map(c => `<div class="consultation-item"><span><strong>${c.type}</strong></span><span>${c.date} at ${c.time}</span></div>`).join('')}
      </div>
      <div class="overall-progress"><div class="overall-percent">${overallProgress}% Complete</div><div>Overall Progress</div><div class="progress-bar" style="margin-top: 16px;"><div class="progress-fill" style="width: ${overallProgress}%;"></div></div></div>
    </div>
  `;
}

// NUTRITION PLAN - No emojis
function renderNutritionPlan() {
  const container = document.getElementById("pageContainer");
  const goalLabels = { lose: "Weight Loss Protocol", maintain: "Weight Maintenance Protocol", gain: "Muscle Gain Protocol" };
  const planTitle = goalLabels[userData.healthGoal] || "Personalized Nutrition Protocol";
  
  container.innerHTML = `
    <div class="welcome-center"><h1>${planTitle}</h1><p>Evidence-based meal plan tailored to your goals</p></div>
    <div class="plan-detail-card"><div class="plan-name">${userData.currentPlan.name}</div><div class="plan-meta"><div class="plan-meta-item">Duration: ${userData.currentPlan.duration}</div><div class="plan-meta-item">Daily Calories: ${userData.currentPlan.dailyCalories} kcal</div></div></div>
    <div class="plan-detail-card"><div class="plan-name">Mediterranean Diet Plan</div><div class="plan-meta"><div class="plan-meta-item">Duration: 6 weeks</div><div class="plan-meta-item">Daily Calories: 1900 kcal</div></div></div>
    <div class="plan-detail-card"><div class="plan-name">High Protein Plan</div><div class="plan-meta"><div class="plan-meta-item">Duration: 4 weeks</div><div class="plan-meta-item">Daily Calories: 1750 kcal</div></div></div>
  `;
}

// PREMIUM
function renderPremium() {
  const container = document.getElementById("pageContainer");
  container.innerHTML = `
    <div class="welcome-center"><h1>Premium Services</h1><p>Advanced features for comprehensive nutritional care</p></div>
    <div class="premium-card"><h3>Premium Benefits</h3>
      <div class="premium-features">
        <div class="premium-feature"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"></polyline></svg><span>Unlimited AI meal analysis</span></div>
        <div class="premium-feature"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"></polyline></svg><span>Priority consultation scheduling</span></div>
        <div class="premium-feature"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"></polyline></svg><span>Personalized weekly meal plans</span></div>
        <div class="premium-feature"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"></polyline></svg><span>Advanced analytics & reporting</span></div>
        <div class="premium-feature"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"></polyline></svg><span>Direct messaging with nutritionists</span></div>
        <div class="premium-feature"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"></polyline></svg><span>Custom macro adjustments</span></div>
      </div>
      <div class="premium-badge" style="margin-top: 16px;">${userData.premium ? "ACTIVE SUBSCRIPTION" : "UPGRADE AVAILABLE"}</div>
      <div style="display: flex; gap: 16px; margin-top: 24px;">
        <button class="btn-primary" id="managePremiumBtn" style="background: #f5b042; flex: 1;">${userData.premium ? "Manage Subscription" : "Upgrade to Premium"}</button>
        <button class="btn-outline" id="viewBenefitsBtn" style="background: rgba(255,255,255,0.1); border-color: rgba(255,255,255,0.3); color: white;">View All Benefits</button>
      </div>
    </div>
    <div class="info-card"><h3>Subscription Details</h3><p>Plan: ${userData.premium ? 'Professional Annual' : 'Basic Free'}</p><p>Renewal: ${userData.premium ? 'December 15, 2025' : 'N/A'}</p></div>
  `;
  document.getElementById("managePremiumBtn")?.addEventListener("click", () => {
    if (!userData.premium) { userData.premium = true; alert("Welcome to NutriAI Premium!"); renderPremium(); }
    else alert("Your premium subscription is active.");
  });
  document.getElementById("viewBenefitsBtn")?.addEventListener("click", () => { alert("Premium features include unlimited AI analysis, priority consultations, personalized meal plans, and more!"); });
}

// Sign Out handlers
document.getElementById("signOutBtn")?.addEventListener("click", (e) => { e.preventDefault(); if(confirm("Sign out?")) alert("Signed out."); });
document.getElementById("mobileSignOutBtn")?.addEventListener("click", (e) => { e.preventDefault(); if(confirm("Sign out?")) alert("Signed out."); });
document.getElementById("logoutSidebarBtn")?.addEventListener("click", (e) => { e.preventDefault(); if(confirm("Logout?")) alert("Logged out."); });

// Initialize
initNavigation();
renderDashboard();