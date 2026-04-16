// ========== BACKEND API CONFIGURATION ==========
const API_BASE = 'http://127.0.0.1:8000/api';

// Get auth token
function getAuthToken() {
    return localStorage.getItem('access_token');
}

// Check if user is logged in
function checkAuth() {
    const token = getAuthToken();
    if (!token) {
        window.location.href = 'login.html';
        return false;
    }
    return true;
}

// API call helper
async function callAPI(endpoint, method = 'GET', data = null) {
    const token = getAuthToken();
    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    };
    
    const options = {
        method: method,
        headers: headers
    };
    
    if (data && method !== 'GET') {
        options.body = JSON.stringify(data);
    }
    
    const response = await fetch(`${API_BASE}${endpoint}`, options);
    return await response.json();
}

// ========== GLOBAL DATA ==========
let userData = {
    fullName: "",
    age: 0,
    email: "",
    healthGoal: "",
    startingWeight: 0,
    currentWeight: 0,
    targetWeight: 0,
    mealsLogged: 0,
    streak: 0,
    planCompleted: 0,
    planTotalDays: 28,
    consultations: [],
    dietPlans: [],
    nutritionists: []
};

// ========== LOAD REAL DATA FROM BACKEND ==========
async function loadProfileData() {
    try {
        const result = await callAPI('/profiles/patient/');
        if (result.success && result.data) {
            const profile = result.data;
            userData.fullName = profile.full_name || "";
            userData.age = profile.age || 0;
            userData.email = profile.email || "";
            userData.healthGoal = profile.health_goal || "maintain";
            userData.startingWeight = profile.starting_weight || 0;
            userData.currentWeight = profile.current_weight || 0;
            userData.targetWeight = profile.target_weight || 0;
        }
    } catch (error) {
        console.error('Error loading profile:', error);
    }
}

async function loadDietPlans() {
    try {
        const result = await callAPI('/diet-plans/');
        if (result.success && result.data) {
            userData.dietPlans = result.data;
            if (userData.dietPlans.length > 0) {
                const plan = userData.dietPlans[0];
                userData.planTotalDays = (plan.duration_weeks || 4) * 7;
            }
        }
    } catch (error) {
        console.error('Error loading diet plans:', error);
    }
}

async function loadConsultations() {
    try {
        const result = await callAPI('/consultations/');
        if (result.success && result.data) {
            userData.consultations = result.data;
        }
    } catch (error) {
        console.error('Error loading consultations:', error);
    }
}

async function loadNutritionists() {
    try {
        const result = await callAPI('/profiles/nutritionists/');
        if (result.success && result.data) {
            userData.nutritionists = result.data;
        }
    } catch (error) {
        console.error('Error loading nutritionists:', error);
    }
}

async function loadMeals() {
    try {
        const result = await callAPI('/meals/');
        if (result.success && result.data) {
            userData.mealsLogged = result.data.length;
        }
        const streakResult = await callAPI('/meals/streak/1/');
        if (streakResult.success && streakResult.data) {
            userData.streak = streakResult.data.current_streak || 0;
        }
    } catch (error) {
        console.error('Error loading meals:', error);
    }
}

async function loadProgress() {
    try {
        const result = await callAPI('/progress/my-progress/');
        if (result.success && result.data) {
            userData.planCompleted = result.data.completed_days || 0;
        }
    } catch (error) {
        console.error('Error loading progress:', error);
    }
}

async function loadAllData() {
    if (!checkAuth()) return;
    
    await loadProfileData();
    await loadDietPlans();
    await loadConsultations();
    await loadNutritionists();
    await loadMeals();
    await loadProgress();
    
    const currentPage = document.querySelector('.nav-item.active')?.getAttribute('data-page') || 'dashboard';
    loadPage(currentPage);
}

// ========== SAVE DATA TO BACKEND ==========
async function saveProfileData(profileData) {
    try {
        const result = await callAPI('/profiles/patient/', 'PUT', profileData);
        if (result.success) {
            await loadProfileData();
            return true;
        }
        return false;
    } catch (error) {
        console.error('Error saving profile:', error);
        return false;
    }
}

async function bookConsultationAPI(consultationData) {
    try {
        const result = await callAPI('/consultations/create/', 'POST', consultationData);
        return result.success;
    } catch (error) {
        console.error('Error booking consultation:', error);
        return false;
    }
}

async function uploadMealAPI(formData) {
    try {
        const token = getAuthToken();
        const response = await fetch(`${API_BASE}/meals/upload/`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`
            },
            body: formData
        });
        const result = await response.json();
        return result;
    } catch (error) {
        console.error('Error uploading meal:', error);
        return null;
    }
}

// ========== LOGOUT ==========
function logout() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user_role');
    window.location.href = 'login.html';
}

// ========== MOBILE MENU ==========
function toggleMenu() {
    const menu = document.getElementById("mobileMenu");
    if (menu.style.display === "flex") {
        menu.style.display = "none";
    } else {
        menu.style.display = "flex";
    }
}

document.getElementById("year").textContent = new Date().getFullYear();

// ========== NAVIGATION ==========
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

// ========== DASHBOARD ==========
function renderDashboard() {
    const container = document.getElementById("pageContainer");
    const firstName = userData.fullName.split(" ")[0] || "User";
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

// ========== PROFILE ==========
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
                        <option value="lose" ${userData.healthGoal === 'lose' ? 'selected' : ''}>Lose weight</option>
                        <option value="maintain" ${userData.healthGoal === 'maintain' ? 'selected' : ''}>Maintain weight</option>
                        <option value="gain" ${userData.healthGoal === 'gain' ? 'selected' : ''}>Gain weight</option>
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
    
    document.getElementById("savePersonalBtn")?.addEventListener("click", async () => {
        const updatedData = {
            full_name: document.getElementById("fullNameInput").value,
            age: parseInt(document.getElementById("ageInput").value),
            email: document.getElementById("emailInput").value,
            health_goal: document.getElementById("healthGoalSelect").value
        };
        await saveProfileData(updatedData);
        await loadProfileData();
        renderProfile();
        alert("Profile saved!");
    });
    
    document.getElementById("saveWeightBtn")?.addEventListener("click", async () => {
        const updatedData = {
            starting_weight: parseFloat(document.getElementById("startingWeightInput").value),
            current_weight: parseFloat(document.getElementById("currentWeightInput").value),
            target_weight: parseFloat(document.getElementById("targetWeightInput").value)
        };
        await saveProfileData(updatedData);
        await loadProfileData();
        renderProfile();
        alert("Weight updated!");
    });
}

// ========== CONSULTATION - NOW WITH REAL NUTRITIONISTS ==========
function renderConsultation() {
    // Build nutritionist options from real data
    let nutritionistOptions = '';
    userData.nutritionists.forEach(n => {
        nutritionistOptions += `<option value="${n.id}">${n.full_name} - ${n.specialization || 'Nutritionist'}</option>`;
    });
    
    if (nutritionistOptions === '') {
        nutritionistOptions = '<option value="">No nutritionists available</option>';
    }
    
    // Build existing consultations list
    let consultationsList = '';
    userData.consultations.forEach(c => {
        consultationsList += `
            <div class="consultation-item">
                <span><strong>${c.consultation_type || 'Consultation'}</strong></span>
                <span>${c.date || 'No date'} at ${c.time || 'No time'}</span>
            </div>
        `;
    });
    
    if (consultationsList === '') {
        consultationsList = '<p>No consultations yet. Book one above!</p>';
    }
    
    const container = document.getElementById("pageContainer");
    container.innerHTML = `
        <div class="welcome-center"><h1>Professional Consultations</h1><p>Schedule sessions with certified specialists</p></div>
        <div class="info-card"><h3>Book New Consultation</h3>
            <div class="form-group"><label>Select Nutritionist</label>
                <select id="nutritionistSelect">${nutritionistOptions}</select>
            </div>
            <div class="form-group"><label>Consultation Type</label>
                <select id="consultationType">
                    <option value="online">Online (Video Call)</option>
                    <option value="physical">Physical (In Person)</option>
                    <option value="followup">Follow Up (30 min)</option>
                </select>
            </div>
            <div class="form-group"><label>Preferred Date</label><input type="date" id="consultDate"></div>
            <div class="form-group"><label>Preferred Time</label><input type="time" id="consultTime"></div>
            <div class="form-group"><label>Notes (Optional)</label><textarea id="consultNotes" placeholder="Any specific concerns?"></textarea></div>
            <button class="btn-primary" id="bookBtn">Confirm Booking</button>
        </div>
        <div class="info-card"><h3>Your Consultations</h3>
            ${consultationsList}
        </div>
    `;
    
    document.getElementById("bookBtn")?.addEventListener("click", async () => {
        const nutritionistId = document.getElementById("nutritionistSelect").value;
        const date = document.getElementById("consultDate").value;
        const time = document.getElementById("consultTime").value;
        const notes = document.getElementById("consultNotes").value;
        
        if (!nutritionistId || nutritionistId === '') {
            alert("Please select a nutritionist");
            return;
        }
        if (!date) {
            alert("Please select a date");
            return;
        }
        if (!time) {
            alert("Please select a time");
            return;
        }
        
        const success = await bookConsultationAPI({
            nutritionist: parseInt(nutritionistId),
            consultation_type: document.getElementById("consultationType").value,
            date: date,
            time: time,
            notes: notes
        });
        
        if (success) {
            alert("Consultation booked successfully!");
            await loadConsultations();
            renderConsultation();
        } else {
            alert("Booking failed. Please try again.");
        }
    });
}

// ========== NUTRITION PLAN - NOW WITH REAL DIET PLANS ==========
function renderNutritionPlan() {
    let plansHtml = '';
    
    if (userData.dietPlans.length > 0) {
        userData.dietPlans.forEach(plan => {
            plansHtml += `
                <div class="plan-detail-card">
                    <div class="plan-name">${plan.name || 'Nutrition Plan'}</div>
                    <div class="plan-meta">
                        <div class="plan-meta-item">Duration: ${plan.duration_weeks || 4} weeks</div>
                        <div class="plan-meta-item">Daily Calories: ${plan.daily_calories || 1800} kcal</div>
                        <div class="plan-meta-item">By: ${plan.nutritionist_name || 'Nutritionist'}</div>
                    </div>
                    <div class="plan-description">${plan.description || 'No description available'}</div>
                </div>
            `;
        });
    } else {
        plansHtml = '<div class="plan-detail-card"><p>No diet plans assigned yet. Contact your nutritionist.</p></div>';
    }
    
    const container = document.getElementById("pageContainer");
    container.innerHTML = `
        <div class="welcome-center"><h1>Your Nutrition Plan</h1><p>Personalized meal protocol</p></div>
        ${plansHtml}
    `;
}

// ========== AI TRACKING ==========
function renderAITracking() {
    const container = document.getElementById("pageContainer");
    container.innerHTML = `
        <div class="ai-page">
            <div class="ai-page-header"><h1>AI Meal Analysis</h1><p>Upload a photo of your meal and get instant nutritional insights</p></div>
            <div class="ai-main-card">
                <div class="upload-section" id="uploadSection">
                    <div class="upload-zone" id="uploadZone">
                        <div class="upload-icon-wrapper"><svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#16a34a" stroke-width="1.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg></div>
                        <h3>Upload your meal image</h3><p>Drag & drop or click to browse</p>
                        <label class="upload-btn" for="mealImageInput">Select Image</label>
                        <input type="file" id="mealImageInput" accept="image/*" hidden>
                    </div>
                </div>
                <div class="preview-section" id="previewSection" style="display: none;">
                    <div class="preview-container">
                        <div class="preview-image-wrapper"><img id="previewImg" class="preview-image" alt="Meal preview"></div>
                        <div style="display: flex; gap: 12px; margin-top: 16px;">
                            <button class="analyze-btn" id="analyzeBtn">Analyze Meal</button>
                            <button class="reset-btn" id="resetBtn">Cancel</button>
                        </div>
                    </div>
                </div>
                <div class="loading-section" id="loadingSection" style="display: none;"><div class="loading-spinner"></div><p>Analyzing your meal...</p></div>
                <div class="results-section" id="resultsSection" style="display: none;">
                    <div class="results-header"><h3>Analysis Complete</h3></div>
                    <div class="nutrition-grid">
                        <div class="nutrition-card"><div class="nutrition-value" id="caloriesValue">---</div><div class="nutrition-label">Calories</div></div>
                        <div class="nutrition-card"><div class="nutrition-value" id="proteinValue">---</div><div class="nutrition-label">Protein</div></div>
                        <div class="nutrition-card"><div class="nutrition-value" id="carbsValue">---</div><div class="nutrition-label">Carbs</div></div>
                        <div class="nutrition-card"><div class="nutrition-value" id="fatsValue">---</div><div class="nutrition-label">Fats</div></div>
                    </div>
                    <button class="new-analysis-btn" id="newAnalysisBtn">New Analysis</button>
                </div>
            </div>
            <div class="stats-summary">
                <div class="stat-item"><div class="stat-number" id="totalMealsCount">${userData.mealsLogged}</div><div class="stat-label">Total Meals</div></div>
                <div class="stat-divider"></div>
                <div class="stat-item"><div class="stat-number">${userData.streak}</div><div class="stat-label">Day Streak</div></div>
            </div>
        </div>
    `;
    
    // File upload logic
    const uploadZone = document.getElementById('uploadZone');
    const fileInput = document.getElementById('mealImageInput');
    const uploadSection = document.getElementById('uploadSection');
    const previewSection = document.getElementById('previewSection');
    const loadingSection = document.getElementById('loadingSection');
    const resultsSection = document.getElementById('resultsSection');
    const previewImg = document.getElementById('previewImg');
    
    let currentFile = null;
    
    function resetToUpload() {
        uploadSection.style.display = 'block';
        previewSection.style.display = 'none';
        loadingSection.style.display = 'none';
        resultsSection.style.display = 'none';
    }
    
    function handleFileSelect(file) {
        if (!file || !file.type.startsWith('image/')) return;
        currentFile = file;
        const reader = new FileReader();
        reader.onload = (e) => {
            previewImg.src = e.target.result;
            uploadSection.style.display = 'none';
            previewSection.style.display = 'block';
        };
        reader.readAsDataURL(file);
    }
    
    uploadZone?.addEventListener('click', () => fileInput.click());
    fileInput?.addEventListener('change', (e) => { if (e.target.files[0]) handleFileSelect(e.target.files[0]); });
    
    document.getElementById('analyzeBtn')?.addEventListener('click', async () => {
        if (!currentFile) return;
        previewSection.style.display = 'none';
        loadingSection.style.display = 'block';
        
        const formData = new FormData();
        formData.append('patient', 1);
        formData.append('image', currentFile);
        formData.append('calories_estimated', 400);
        
        const result = await uploadMealAPI(formData);
        
        if (result && result.success) {
            document.getElementById('caloriesValue').textContent = result.data.calories_estimated || 350;
            document.getElementById('proteinValue').textContent = '25g';
            document.getElementById('carbsValue').textContent = '45g';
            document.getElementById('fatsValue').textContent = '15g';
            document.getElementById('totalMealsCount').textContent = userData.mealsLogged + 1;
            userData.mealsLogged++;
            loadingSection.style.display = 'none';
            resultsSection.style.display = 'block';
        } else {
            loadingSection.style.display = 'none';
            resetToUpload();
            alert('Analysis failed. Please try again.');
        }
    });
    
    document.getElementById('resetBtn')?.addEventListener('click', () => { resetToUpload(); currentFile = null; });
    document.getElementById('newAnalysisBtn')?.addEventListener('click', () => { resetToUpload(); currentFile = null; });
}

// ========== PROGRESS ==========
function renderProgress() {
    const container = document.getElementById("pageContainer");
    const weightLost = userData.startingWeight - userData.currentWeight;
    const weightProgressPercent = userData.startingWeight > userData.targetWeight ? ((weightLost) / (userData.startingWeight - userData.targetWeight) * 100).toFixed(0) : 0;
    const planProgressPercent = userData.planTotalDays > 0 ? (userData.planCompleted / userData.planTotalDays * 100).toFixed(0) : 0;
    const overallProgress = ((parseInt(weightProgressPercent) + parseInt(planProgressPercent)) / 2).toFixed(0);
    
    container.innerHTML = `
        <div class="welcome-center"><h1>Progress Dashboard</h1><p>Track your health journey</p></div>
        <div class="progress-dashboard">
            <div class="progress-overview">
                <div class="goal-card"><h3>Weight Goal Progress</h3>
                    <div class="goal-stat"><span class="goal-label">Starting Weight</span><span class="goal-value">${userData.startingWeight} kg</span></div>
                    <div class="goal-stat"><span class="goal-label">Current Weight</span><span class="goal-value">${userData.currentWeight} kg</span></div>
                    <div class="goal-stat"><span class="goal-label">Target Weight</span><span class="goal-value">${userData.targetWeight} kg</span></div>
                    <div class="progress-percent">${weightProgressPercent}%</div>
                    <div class="progress-bar"><div class="progress-fill" style="width: ${weightProgressPercent}%;"></div></div>
                </div>
                <div class="goal-card"><h3>Plan Completion</h3>
                    <div class="goal-stat"><span class="goal-label">Completed Days</span><span class="goal-value">${userData.planCompleted} / ${userData.planTotalDays}</span></div>
                    <div class="progress-percent">${planProgressPercent}%</div>
                    <div class="progress-bar"><div class="progress-fill" style="width: ${planProgressPercent}%;"></div></div>
                </div>
            </div>
            <div class="overall-progress"><div class="overall-percent">${overallProgress}% Complete</div><div>Overall Progress</div><div class="progress-bar" style="margin-top: 16px;"><div class="progress-fill" style="width: ${overallProgress}%;"></div></div></div>
        </div>
    `;
}

// ========== PREMIUM ==========
function renderPremium() {
    const container = document.getElementById("pageContainer");
    container.innerHTML = `
        <div class="welcome-center"><h1>Premium Services</h1><p>Advanced features for comprehensive nutritional care</p></div>
        <div class="premium-card"><h3>Premium Benefits</h3>
            <div class="premium-features">
                <div class="premium-feature"><span>✓ Unlimited AI meal analysis</span></div>
                <div class="premium-feature"><span>✓ Priority consultation scheduling</span></div>
                <div class="premium-feature"><span>✓ Personalized weekly meal plans</span></div>
                <div class="premium-feature"><span>✓ Advanced analytics & reporting</span></div>
            </div>
            <button class="btn-primary" id="upgradeBtn">Upgrade to Premium</button>
        </div>
    `;
    document.getElementById("upgradeBtn")?.addEventListener("click", () => {
        alert("Premium subscription feature coming soon!");
    });
}

// ========== LOGOUT HANDLERS ==========
document.getElementById("signOutBtn")?.addEventListener("click", (e) => { e.preventDefault(); logout(); });
document.getElementById("mobileSignOutBtn")?.addEventListener("click", (e) => { e.preventDefault(); logout(); });
document.getElementById("logoutSidebarBtn")?.addEventListener("click", (e) => { e.preventDefault(); logout(); });

// ========== INITIALIZE ==========
initNavigation();
loadAllData();