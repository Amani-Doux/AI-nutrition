// Sample Data with Progress Tracking
let patients = [
    { 
        id: 1, 
        name: "John Doe", 
        age: 35, 
        email: "john@example.com", 
        goal: "Weight Loss",
        startingWeight: 95,
        currentWeight: 88,
        targetWeight: 75,
        planCompletedDays: 14,
        planTotalDays: 28
    },
    { 
        id: 2, 
        name: "Jane Smith", 
        age: 28, 
        email: "jane@example.com", 
        goal: "Muscle Gain",
        startingMuscle: 28,
        currentMuscle: 32,
        targetMuscle: 40,
        planCompletedDays: 21,
        planTotalDays: 42
    },
    { 
        id: 3, 
        name: "Mike Johnson", 
        age: 42, 
        email: "mike@example.com", 
        goal: "Diabetes Management",
        startingWeight: 110,
        currentWeight: 105,
        targetWeight: 85,
        planCompletedDays: 7,
        planTotalDays: 56
    }
];

let consultations = [
    { id: 1, patientName: "John Doe", date: "2024-01-15", time: "10:00 AM", type: "Initial" },
    { id: 2, patientName: "Jane Smith", date: "2024-01-16", time: "2:00 PM", type: "Follow-up" }
];

let plans = [
    { id: 1, patientName: "John Doe", name: "Low Carb Diet", duration: "4 weeks", calories: "1800" },
    { id: 2, patientName: "Jane Smith", name: "High Protein Plan", duration: "6 weeks", calories: "2200" }
];

// Calculate Goal-Based Progress
function calculateGoalProgress(patient) {
    if (patient.goal === "Weight Loss") {
        const totalToLose = patient.startingWeight - patient.targetWeight;
        const lostSoFar = patient.startingWeight - patient.currentWeight;
        if (totalToLose <= 0) return 0;
        return Math.min(100, Math.round((lostSoFar / totalToLose) * 100));
    } 
    else if (patient.goal === "Muscle Gain") {
        const totalToGain = patient.targetMuscle - patient.startingMuscle;
        const gainedSoFar = patient.currentMuscle - patient.startingMuscle;
        if (totalToGain <= 0) return 0;
        return Math.min(100, Math.round((gainedSoFar / totalToGain) * 100));
    }
    else {
        const totalToLose = patient.startingWeight - patient.targetWeight;
        const lostSoFar = patient.startingWeight - patient.currentWeight;
        if (totalToLose <= 0) return 0;
        return Math.min(100, Math.round((lostSoFar / totalToLose) * 100));
    }
}

function calculatePlanProgress(patient) {
    if (patient.planTotalDays <= 0) return 0;
    return Math.min(100, Math.round((patient.planCompletedDays / patient.planTotalDays) * 100));
}

function calculateOverallProgress(patient) {
    const goalProgress = calculateGoalProgress(patient);
    const planProgress = calculatePlanProgress(patient);
    return Math.min(100, Math.round((goalProgress * 0.6) + (planProgress * 0.4)));
}

// Initialize
document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("year").textContent = new Date().getFullYear();
    
    setupNavigation();
    renderPatients();
    renderConsultations();
    renderPlans();
    renderProgress();
    updateStats();
    
    // Modal close buttons
    document.querySelector(".close").onclick = () => closeModal();
    document.querySelector(".close-progress").onclick = () => closeProgressModal();
    window.onclick = (e) => { 
        if(e.target == document.getElementById("formModal")) closeModal();
        if(e.target == document.getElementById("progressModal")) closeProgressModal();
    };
    
    // Sign out
    document.getElementById("signOutBtn").addEventListener("click", () => {
        if(confirm("Are you sure you want to sign out?")) {
            location.reload();
        }
    });
    document.getElementById("mobileSignOutBtn").addEventListener("click", () => {
        if(confirm("Are you sure you want to sign out?")) {
            location.reload();
        }
    });
});

function updateStats() {
    const totalPatients = patients.length;
    const totalConsultations = consultations.length;
    const totalPlans = plans.length;
    
    let totalProgress = 0;
    patients.forEach(patient => {
        totalProgress += calculateOverallProgress(patient);
    });
    const avgProgress = patients.length > 0 ? Math.round(totalProgress / patients.length) : 0;
    
    document.getElementById("totalPatients").textContent = totalPatients;
    document.getElementById("totalConsultations").textContent = totalConsultations;
    document.getElementById("totalPlans").textContent = totalPlans;
    document.getElementById("completionRate").textContent = `${avgProgress}%`;
}

function setupNavigation() {
    const sidebarLinks = document.querySelectorAll(".sidebar nav a");
    const cardBtns = document.querySelectorAll(".card");
    const statCards = document.querySelectorAll(".stat-card");
    
    const navigateTo = (pageId) => {
        document.querySelectorAll(".page").forEach(page => {
            page.classList.remove("active-page");
        });
        document.getElementById(`${pageId}-page`).classList.add("active-page");
        
        sidebarLinks.forEach(link => {
            link.classList.remove("active");
            if(link.getAttribute("data-page") === pageId) {
                link.classList.add("active");
            }
        });
        
        if(pageId === "patients") renderPatients();
        if(pageId === "consultations") renderConsultations();
        if(pageId === "plans") renderPlans();
        if(pageId === "progress") renderProgress();
        updateStats();
    };
    
    sidebarLinks.forEach(link => {
        link.addEventListener("click", (e) => {
            e.preventDefault();
            const pageId = link.getAttribute("data-page");
            if(pageId === "logout") {
                if(confirm("Are you sure you want to logout?")) {
                    location.reload();
                }
                return;
            }
            navigateTo(pageId);
        });
    });
    
    cardBtns.forEach(card => {
        card.addEventListener("click", () => {
            const pageId = card.getAttribute("data-page");
            if(pageId) navigateTo(pageId);
        });
    });
    
    // Stats cards navigation
    statCards.forEach(card => {
        card.addEventListener("click", () => {
            const navPage = card.getAttribute("data-nav");
            if(navPage) navigateTo(navPage);
        });
    });
}

// Patient Functions
function renderPatients() {
    const searchTerm = document.getElementById("searchPatient")?.value.toLowerCase() || "";
    const filtered = patients.filter(p => p.name.toLowerCase().includes(searchTerm));
    
    const container = document.getElementById("patientsList");
    if(!container) return;
    
    if(filtered.length === 0) {
        container.innerHTML = '<div style="text-align:center; padding:60px; color:#64748b;">No patients found</div>';
        return;
    }
    
    container.innerHTML = filtered.map(patient => `
        <div class="patient-item">
            <div class="patient-info">
                <h3>${escapeHtml(patient.name)}</h3>
                <p>Age: ${patient.age} | Email: ${escapeHtml(patient.email)}</p>
                <p>Goal: ${escapeHtml(patient.goal)}</p>
            </div>
            <div class="item-actions">
                <button class="edit-btn" onclick="editPatient(${patient.id})">Edit</button>
                <button class="delete-btn" onclick="deletePatient(${patient.id})">Delete</button>
            </div>
        </div>
    `).join('');
    
    const searchInput = document.getElementById("searchPatient");
    if(searchInput) {
        searchInput.oninput = () => renderPatients();
    }
}

function addPatient() {
    showModal(`
        <h2 style="margin-bottom: 20px; font-size: 20px; font-weight: 600;">Add New Patient</h2>
        <form id="patientForm">
            <div class="form-group"><label>Full Name</label><input type="text" name="name" required placeholder="Enter patient name"></div>
            <div class="form-group"><label>Age</label><input type="number" name="age" required placeholder="Enter age"></div>
            <div class="form-group"><label>Email Address</label><input type="email" name="email" required placeholder="patient@example.com"></div>
            <div class="form-group"><label>Health Goal</label>
                <select name="goal" required>
                    <option value="Weight Loss">Weight Loss</option>
                    <option value="Muscle Gain">Muscle Gain</option>
                    <option value="Diabetes Management">Diabetes Management</option>
                </select>
            </div>
            <div class="form-group"><label>Starting Weight (kg)</label><input type="number" name="startingWeight" step="0.1" required></div>
            <div class="form-group"><label>Current Weight (kg)</label><input type="number" name="currentWeight" step="0.1" required></div>
            <div class="form-group"><label>Target Weight (kg)</label><input type="number" name="targetWeight" step="0.1" required></div>
            <button type="submit" class="submit-btn">Add Patient</button>
        </form>
    `);
    
    document.getElementById("patientForm").onsubmit = (e) => {
        e.preventDefault();
        const newPatient = {
            id: Date.now(),
            name: e.target.name.value,
            age: parseInt(e.target.age.value),
            email: e.target.email.value,
            goal: e.target.goal.value,
            startingWeight: parseFloat(e.target.startingWeight.value),
            currentWeight: parseFloat(e.target.currentWeight.value),
            targetWeight: parseFloat(e.target.targetWeight.value),
            startingMuscle: 28,
            currentMuscle: 30,
            targetMuscle: 40,
            planCompletedDays: 0,
            planTotalDays: 28
        };
        patients.push(newPatient);
        renderPatients();
        updateStats();
        closeModal();
        showNotification("Patient added successfully");
    };
}

function editPatient(id) {
    const patient = patients.find(p => p.id === id);
    if(!patient) return;
    
    showModal(`
        <h2 style="margin-bottom: 20px; font-size: 20px; font-weight: 600;">Edit Patient</h2>
        <form id="patientForm">
            <div class="form-group"><label>Full Name</label><input type="text" name="name" value="${escapeHtml(patient.name)}" required></div>
            <div class="form-group"><label>Age</label><input type="number" name="age" value="${patient.age}" required></div>
            <div class="form-group"><label>Email Address</label><input type="email" name="email" value="${escapeHtml(patient.email)}" required></div>
            <div class="form-group"><label>Health Goal</label>
                <select name="goal" required>
                    <option ${patient.goal === 'Weight Loss' ? 'selected' : ''}>Weight Loss</option>
                    <option ${patient.goal === 'Muscle Gain' ? 'selected' : ''}>Muscle Gain</option>
                    <option ${patient.goal === 'Diabetes Management' ? 'selected' : ''}>Diabetes Management</option>
                </select>
            </div>
            <div class="form-group"><label>Starting Weight (kg)</label><input type="number" name="startingWeight" step="0.1" value="${patient.startingWeight}" required></div>
            <div class="form-group"><label>Current Weight (kg)</label><input type="number" name="currentWeight" step="0.1" value="${patient.currentWeight}" required></div>
            <div class="form-group"><label>Target Weight (kg)</label><input type="number" name="targetWeight" step="0.1" value="${patient.targetWeight}" required></div>
            <button type="submit" class="submit-btn">Update Patient</button>
        </form>
    `);
    
    document.getElementById("patientForm").onsubmit = (e) => {
        e.preventDefault();
        patient.name = e.target.name.value;
        patient.age = parseInt(e.target.age.value);
        patient.email = e.target.email.value;
        patient.goal = e.target.goal.value;
        patient.startingWeight = parseFloat(e.target.startingWeight.value);
        patient.currentWeight = parseFloat(e.target.currentWeight.value);
        patient.targetWeight = parseFloat(e.target.targetWeight.value);
        renderPatients();
        renderProgress();
        updateStats();
        closeModal();
        showNotification("Patient updated successfully");
    };
}

function deletePatient(id) {
    if(confirm("Are you sure you want to delete this patient?")) {
        const patientToDelete = patients.find(p => p.id === id);
        patients = patients.filter(p => p.id !== id);
        consultations = consultations.filter(c => c.patientName !== patientToDelete?.name);
        plans = plans.filter(p => p.patientName !== patientToDelete?.name);
        renderPatients();
        renderConsultations();
        renderPlans();
        renderProgress();
        updateStats();
        showNotification("Patient deleted successfully");
    }
}

// Consultation Functions
function renderConsultations() {
    const container = document.getElementById("consultationsList");
    if(!container) return;
    
    if(consultations.length === 0) {
        container.innerHTML = '<div style="text-align:center; padding:60px; color:#64748b;">No consultations scheduled</div>';
        return;
    }
    
    container.innerHTML = consultations.map(consult => `
        <div class="consultation-item">
            <div class="consultation-info">
                <h3>${escapeHtml(consult.patientName)}</h3>
                <p>Date: ${consult.date} | Time: ${consult.time}</p>
                <p>Type: ${escapeHtml(consult.type)}</p>
            </div>
            <div class="item-actions">
                <button class="edit-btn" onclick="editConsultation(${consult.id})">Edit</button>
                <button class="delete-btn" onclick="deleteConsultation(${consult.id})">Delete</button>
            </div>
        </div>
    `).join('');
}

function addConsultation() {
    const patientOptions = patients.map(p => `<option value="${escapeHtml(p.name)}">${escapeHtml(p.name)}</option>`).join('');
    
    showModal(`
        <h2 style="margin-bottom: 20px; font-size: 20px; font-weight: 600;">Schedule Consultation</h2>
        <form id="consultationForm">
            <div class="form-group"><label>Patient</label><select name="patientName" required>${patientOptions || '<option>No patients available</option>'}</select></div>
            <div class="form-group"><label>Date</label><input type="date" name="date" required></div>
            <div class="form-group"><label>Time</label><input type="text" name="time" placeholder="e.g., 10:00 AM" required></div>
            <div class="form-group"><label>Consultation Type</label><select name="type"><option>Initial</option><option>Follow-up</option></select></div>
            <button type="submit" class="submit-btn">Schedule Consultation</button>
        </form>
    `);
    
    document.getElementById("consultationForm").onsubmit = (e) => {
        e.preventDefault();
        const newConsult = {
            id: Date.now(),
            patientName: e.target.patientName.value,
            date: e.target.date.value,
            time: e.target.time.value,
            type: e.target.type.value
        };
        consultations.push(newConsult);
        renderConsultations();
        updateStats();
        closeModal();
        showNotification("Consultation scheduled successfully");
    };
}

function editConsultation(id) {
    const consult = consultations.find(c => c.id === id);
    if(!consult) return;
    
    const patientOptions = patients.map(p => `<option value="${escapeHtml(p.name)}" ${p.name === consult.patientName ? 'selected' : ''}>${escapeHtml(p.name)}</option>`).join('');
    
    showModal(`
        <h2 style="margin-bottom: 20px; font-size: 20px; font-weight: 600;">Edit Consultation</h2>
        <form id="consultationForm">
            <div class="form-group"><label>Patient</label><select name="patientName" required>${patientOptions}</select></div>
            <div class="form-group"><label>Date</label><input type="date" name="date" value="${consult.date}" required></div>
            <div class="form-group"><label>Time</label><input type="text" name="time" value="${consult.time}" required></div>
            <div class="form-group"><label>Consultation Type</label><select name="type"><option ${consult.type === 'Initial' ? 'selected' : ''}>Initial</option><option ${consult.type === 'Follow-up' ? 'selected' : ''}>Follow-up</option></select></div>
            <button type="submit" class="submit-btn">Update Consultation</button>
        </form>
    `);
    
    document.getElementById("consultationForm").onsubmit = (e) => {
        e.preventDefault();
        consult.patientName = e.target.patientName.value;
        consult.date = e.target.date.value;
        consult.time = e.target.time.value;
        consult.type = e.target.type.value;
        renderConsultations();
        closeModal();
        showNotification("Consultation updated successfully");
    };
}

function deleteConsultation(id) {
    if(confirm("Delete this consultation?")) {
        consultations = consultations.filter(c => c.id !== id);
        renderConsultations();
        updateStats();
        showNotification("Consultation deleted successfully");
    }
}

// Plan Functions
function renderPlans() {
    const container = document.getElementById("plansList");
    if(!container) return;
    
    if(plans.length === 0) {
        container.innerHTML = '<div style="text-align:center; padding:60px; color:#64748b;">No nutrition plans created</div>';
        return;
    }
    
    container.innerHTML = plans.map(plan => `
        <div class="plan-item">
            <div class="plan-info">
                <h3>${escapeHtml(plan.name)}</h3>
                <p>Patient: ${escapeHtml(plan.patientName)}</p>
                <p>Duration: ${plan.duration} | Daily Calories: ${plan.calories} kcal</p>
            </div>
            <div class="item-actions">
                <button class="edit-btn" onclick="editPlan(${plan.id})">Edit</button>
                <button class="delete-btn" onclick="deletePlan(${plan.id})">Delete</button>
            </div>
        </div>
    `).join('');
}

function addPlan() {
    const patientOptions = patients.map(p => `<option value="${escapeHtml(p.name)}">${escapeHtml(p.name)}</option>`).join('');
    
    showModal(`
        <h2 style="margin-bottom: 20px; font-size: 20px; font-weight: 600;">Create Nutrition Plan</h2>
        <form id="planForm">
            <div class="form-group"><label>Patient</label><select name="patientName" required>${patientOptions || '<option>No patients available</option>'}</select></div>
            <div class="form-group"><label>Plan Name</label><input type="text" name="name" required placeholder="e.g., Keto Diet, Mediterranean"></div>
            <div class="form-group"><label>Duration</label><input type="text" name="duration" placeholder="e.g., 4 weeks, 3 months" required></div>
            <div class="form-group"><label>Daily Calories</label><input type="number" name="calories" required placeholder="e.g., 2000"></div>
            <button type="submit" class="submit-btn">Create Plan</button>
        </form>
    `);
    
    document.getElementById("planForm").onsubmit = (e) => {
        e.preventDefault();
        const newPlan = {
            id: Date.now(),
            patientName: e.target.patientName.value,
            name: e.target.name.value,
            duration: e.target.duration.value,
            calories: e.target.calories.value
        };
        plans.push(newPlan);
        renderPlans();
        updateStats();
        closeModal();
        showNotification("Nutrition plan created successfully");
    };
}

function editPlan(id) {
    const plan = plans.find(p => p.id === id);
    if(!plan) return;
    
    const patientOptions = patients.map(p => `<option value="${escapeHtml(p.name)}" ${p.name === plan.patientName ? 'selected' : ''}>${escapeHtml(p.name)}</option>`).join('');
    
    showModal(`
        <h2 style="margin-bottom: 20px; font-size: 20px; font-weight: 600;">Edit Plan</h2>
        <form id="planForm">
            <div class="form-group"><label>Patient</label><select name="patientName" required>${patientOptions}</select></div>
            <div class="form-group"><label>Plan Name</label><input type="text" name="name" value="${escapeHtml(plan.name)}" required></div>
            <div class="form-group"><label>Duration</label><input type="text" name="duration" value="${plan.duration}" required></div>
            <div class="form-group"><label>Daily Calories</label><input type="number" name="calories" value="${plan.calories}" required></div>
            <button type="submit" class="submit-btn">Update Plan</button>
        </form>
    `);
    
    document.getElementById("planForm").onsubmit = (e) => {
        e.preventDefault();
        plan.patientName = e.target.patientName.value;
        plan.name = e.target.name.value;
        plan.duration = e.target.duration.value;
        plan.calories = e.target.calories.value;
        renderPlans();
        closeModal();
        showNotification("Plan updated successfully");
    };
}

function deletePlan(id) {
    if(confirm("Delete this plan?")) {
        plans = plans.filter(p => p.id !== id);
        renderPlans();
        renderProgress();
        updateStats();
        showNotification("Plan deleted successfully");
    }
}

// Progress Functions
function renderProgress() {
    const container = document.getElementById("progressList");
    if(!container) return;
    
    if(patients.length === 0) {
        container.innerHTML = '<div style="text-align:center; padding:60px; color:#64748b;">No patients to monitor</div>';
        return;
    }
    
    const patientProgress = patients.map(patient => {
        const goalProgress = calculateGoalProgress(patient);
        const planProgress = calculatePlanProgress(patient);
        const overallProgress = calculateOverallProgress(patient);
        const patientPlans = plans.filter(p => p.patientName === patient.name);
        const consultationsCount = consultations.filter(c => c.patientName === patient.name).length;
        
        let goalText = "";
        if (patient.goal === "Weight Loss") {
            goalText = `${patient.currentWeight} / ${patient.targetWeight} kg (${goalProgress}%)`;
        } else if (patient.goal === "Muscle Gain") {
            goalText = `${patient.currentMuscle} / ${patient.targetMuscle} % (${goalProgress}%)`;
        } else {
            goalText = `${patient.currentWeight} / ${patient.targetWeight} kg (${goalProgress}%)`;
        }
        
        return `
            <div class="progress-item">
                <div class="patient-info">
                    <h3>${escapeHtml(patient.name)}</h3>
                    <p>Goal: ${escapeHtml(patient.goal)}</p>
                    <p>Active Plans: ${patientPlans.length} | Consultations: ${consultationsCount}</p>
                </div>
                <div class="progress-stats">
                    <div class="progress-details">
                        <div class="progress-bar-container">
                            <div class="progress-bar-fill" style="width: ${overallProgress}%"></div>
                        </div>
                        <span class="progress-text">Overall Progress: ${overallProgress}%</span>
                        <span class="goal-progress-text">Goal Progress: ${goalText}</span>
                        <span class="progress-text">Plan Completion: ${planProgress}%</span>
                    </div>
                    <div class="item-actions">
                        <button class="view-btn" onclick="viewProgressDetails('${escapeHtml(patient.name)}')">View Details</button>
                        <button class="update-progress-btn" onclick="updatePatientProgress(${patient.id})">Update</button>
                    </div>
                </div>
            </div>
        `;
    }).join('');
    
    container.innerHTML = patientProgress;
}

function updatePatientProgress(patientId) {
    const patient = patients.find(p => p.id === patientId);
    if(!patient) return;
    
    showProgressModal(`
        <h2 style="margin-bottom: 20px; font-size: 20px; font-weight: 600;">Update Progress - ${escapeHtml(patient.name)}</h2>
        <form id="progressUpdateForm">
            <div class="form-group">
                <label>Current Weight (kg)</label>
                <input type="number" name="currentWeight" step="0.1" value="${patient.currentWeight}" required>
            </div>
            <div class="form-group">
                <label>Plan Completed Days</label>
                <input type="number" name="planCompletedDays" value="${patient.planCompletedDays}" required>
            </div>
            <div class="form-group">
                <label>Total Plan Days</label>
                <input type="number" name="planTotalDays" value="${patient.planTotalDays}" required>
            </div>
            <button type="submit" class="submit-btn">Update Progress</button>
        </form>
    `);
    
    document.getElementById("progressUpdateForm").onsubmit = (e) => {
        e.preventDefault();
        patient.currentWeight = parseFloat(e.target.currentWeight.value);
        patient.planCompletedDays = parseInt(e.target.planCompletedDays.value);
        patient.planTotalDays = parseInt(e.target.planTotalDays.value);
        renderProgress();
        updateStats();
        closeProgressModal();
        showNotification("Progress updated successfully");
    };
}

function viewProgressDetails(patientName) {
    const patient = patients.find(p => p.name === patientName);
    const patientPlans = plans.filter(p => p.patientName === patientName);
    const patientConsultations = consultations.filter(c => c.patientName === patientName);
    const goalProgress = calculateGoalProgress(patient);
    const planProgress = calculatePlanProgress(patient);
    const overallProgress = calculateOverallProgress(patient);
    
    let goalDetails = "";
    if (patient.goal === "Weight Loss") {
        goalDetails = `
            <p>Starting Weight: ${patient.startingWeight} kg</p>
            <p>Current Weight: ${patient.currentWeight} kg</p>
            <p>Target Weight: ${patient.targetWeight} kg</p>
            <p>Progress: ${goalProgress}%</p>
        `;
    } else if (patient.goal === "Muscle Gain") {
        goalDetails = `
            <p>Starting Muscle: ${patient.startingMuscle}%</p>
            <p>Current Muscle: ${patient.currentMuscle}%</p>
            <p>Target Muscle: ${patient.targetMuscle}%</p>
            <p>Progress: ${goalProgress}%</p>
        `;
    } else {
        goalDetails = `
            <p>Starting Weight: ${patient.startingWeight} kg</p>
            <p>Current Weight: ${patient.currentWeight} kg</p>
            <p>Target Weight: ${patient.targetWeight} kg</p>
            <p>Progress: ${goalProgress}%</p>
        `;
    }
    
    let plansHtml = patientPlans.length ? patientPlans.map(p => `<li style="margin-bottom: 8px;">${escapeHtml(p.name)} (${p.duration}) - ${p.calories} kcal/day</li>`).join('') : '<li>No plans assigned</li>';
    let consultsHtml = patientConsultations.length ? patientConsultations.map(c => `<li style="margin-bottom: 8px;">${c.type} consultation on ${c.date} at ${c.time}</li>`).join('') : '<li>No consultations</li>';
    
    showProgressModal(`
        <h2 style="margin-bottom: 20px; font-size: 20px; font-weight: 600;">${escapeHtml(patient.name)} - Progress Details</h2>
        <div style="margin-top: 20px;">
            <div style="margin-bottom: 20px;">
                <h3 style="font-size: 15px; font-weight: 600; margin-bottom: 12px; color: #1e293b;">Goal Progress</h3>
                ${goalDetails}
                <div class="progress-bar-container" style="margin-top: 10px;">
                    <div class="progress-bar-fill" style="width: ${goalProgress}%"></div>
                </div>
            </div>
            <div style="margin-bottom: 20px;">
                <h3 style="font-size: 15px; font-weight: 600; margin-bottom: 12px; color: #1e293b;">Plan Completion</h3>
                <p>Completed: ${patient.planCompletedDays} / ${patient.planTotalDays} days</p>
                <div class="progress-bar-container" style="margin-top: 10px;">
                    <div class="progress-bar-fill" style="width: ${planProgress}%"></div>
                </div>
            </div>
            <div style="margin-bottom: 20px;">
                <h3 style="font-size: 15px; font-weight: 600; margin-bottom: 12px; color: #1e293b;">Nutrition Plans</h3>
                <ul style="margin-left: 20px; color: #64748b;">${plansHtml}</ul>
            </div>
            <div style="margin-bottom: 20px;">
                <h3 style="font-size: 15px; font-weight: 600; margin-bottom: 12px; color: #1e293b;">Consultations</h3>
                <ul style="margin-left: 20px; color: #64748b;">${consultsHtml}</ul>
            </div>
            <div>
                <h3 style="font-size: 15px; font-weight: 600; margin-bottom: 12px; color: #1e293b;">Overall Progress</h3>
                <div class="progress-bar-container" style="margin-top: 10px;">
                    <div class="progress-bar-fill" style="width: ${overallProgress}%"></div>
                </div>
                <p style="margin-top: 8px; font-weight: 500;">${overallProgress}% Complete</p>
            </div>
        </div>
    `);
}

// Helper Functions
function showModal(content) {
    const modal = document.getElementById("formModal");
    const container = document.getElementById("modal-form-container");
    container.innerHTML = content;
    modal.style.display = "block";
}

function closeModal() {
    document.getElementById("formModal").style.display = "none";
    document.getElementById("modal-form-container").innerHTML = "";
}

function showProgressModal(content) {
    const modal = document.getElementById("progressModal");
    const container = document.getElementById("progress-modal-container");
    container.innerHTML = content;
    modal.style.display = "block";
}

function closeProgressModal() {
    document.getElementById("progressModal").style.display = "none";
    document.getElementById("progress-modal-container").innerHTML = "";
}

function showNotification(message) {
    const notification = document.createElement("div");
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        bottom: 24px;
        right: 24px;
        background: #1e293b;
        color: white;
        padding: 12px 24px;
        border-radius: 12px;
        z-index: 3000;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        font-size: 13px;
        font-weight: 500;
        box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        animation: slideInRight 0.25s ease;
    `;
    document.body.appendChild(notification);
    setTimeout(() => {
        notification.style.animation = "slideOutRight 0.25s ease";
        setTimeout(() => notification.remove(), 250);
    }, 3000);
}

const styleSheet = document.createElement("style");
styleSheet.textContent = `
    @keyframes slideInRight {
        from { opacity: 0; transform: translateX(100px); }
        to { opacity: 1; transform: translateX(0); }
    }
    @keyframes slideOutRight {
        from { opacity: 1; transform: translateX(0); }
        to { opacity: 0; transform: translateX(100px); }
    }
`;
document.head.appendChild(styleSheet);

function escapeHtml(str) {
    if(!str) return '';
    return str.replace(/[&<>]/g, function(m) {
        if(m === '&') return '&amp;';
        if(m === '<') return '&lt;';
        if(m === '>') return '&gt;';
        return m;
    });
}

function toggleMenu() {
    const menu = document.getElementById("mobileMenu");
    menu.style.display = menu.style.display === "flex" ? "none" : "flex";
}

// Attach global functions
window.addPatient = addPatient;
window.editPatient = editPatient;
window.deletePatient = deletePatient;
window.addConsultation = addConsultation;
window.editConsultation = editConsultation;
window.deleteConsultation = deleteConsultation;
window.addPlan = addPlan;
window.editPlan = editPlan;
window.deletePlan = deletePlan;
window.viewProgressDetails = viewProgressDetails;
window.updatePatientProgress = updatePatientProgress;

// Button listeners
document.addEventListener("DOMContentLoaded", () => {
    const addPatientBtn = document.getElementById("addPatientBtn");
    if(addPatientBtn) addPatientBtn.onclick = addPatient;
    
    const addConsultationBtn = document.getElementById("addConsultationBtn");
    if(addConsultationBtn) addConsultationBtn.onclick = addConsultation;
    
    const addPlanBtn = document.getElementById("addPlanBtn");
    if(addPlanBtn) addPlanBtn.onclick = addPlan;
});