// ---------- DATA ----------
let users = [
    { id: 1, name: "Emily Clark", email: "emily@example.com", role: "premium" },
    { id: 2, name: "David Miller", email: "david@example.com", role: "basic" }
];
let nutritionists = [
    { id: 1, name: "Dr. Sarah Lee", specialty: "Clinical Nutrition", email: "sarah@nutriai.com", experience: "8 years" },
    { id: 2, name: "Mark Wilson", specialty: "Sports Dietetics", email: "mark@nutriai.com", experience: "5 years" }
];
let subscriptions = [
    { id: 1, userId: 1, userName: "Emily Clark", plan: "Premium Yearly", startDate: "2024-01-10", endDate: "2025-01-10", status: "active" },
    { id: 2, userId: 2, userName: "David Miller", plan: "Basic Monthly", startDate: "2024-02-01", endDate: "2024-03-01", status: "expired" }
];
let systemLogs = [
    { id: Date.now() + 1, timestamp: new Date().toISOString(), message: "System initialized. Admin dashboard ready." }
];
let systemConfig = { siteName: "NutriAI", supportEmail: "admin@nutriai.com", maintenanceMode: false };

// Helper: add log
function addLog(message) {
    systemLogs.unshift({ id: Date.now(), timestamp: new Date().toISOString(), message });
    if (systemLogs.length > 50) systemLogs.pop();
    if (document.getElementById("systemLogsContainer")) renderSystemLogs();
}

// Update stats
function updateAdminStats() {
    document.getElementById("totalUsers").innerText = users.length;
    document.getElementById("totalNutritionists").innerText = nutritionists.length;
    const activeSubs = subscriptions.filter(s => s.status === "active").length;
    document.getElementById("activeSubscriptions").innerText = activeSubs;
    document.getElementById("sysHealth").innerHTML = systemConfig.maintenanceMode ? "⚠️ Maint" : "✓ Online";
}

// Render functions
function renderUsers() {
    const term = (document.getElementById("searchUser")?.value || "").toLowerCase();
    const filtered = users.filter(u => u.name.toLowerCase().includes(term) || u.email.toLowerCase().includes(term));
    const container = document.getElementById("usersList");
    if(!container) return;
    if(filtered.length===0){ container.innerHTML='<div style="padding:40px;text-align:center">No users</div>'; return; }
    container.innerHTML = filtered.map(u => `<div class="user-item"><div class="item-info"><h3>${escapeHtml(u.name)}</h3><p>${escapeHtml(u.email)} | Role: ${u.role}</p></div><div class="item-actions"><button class="edit-btn" onclick="editUser(${u.id})">Edit</button><button class="delete-btn" onclick="deleteUser(${u.id})">Delete</button></div></div>`).join('');
}
function renderNutritionists() {
    const term = (document.getElementById("searchNutritionist")?.value || "").toLowerCase();
    const filtered = nutritionists.filter(n => n.name.toLowerCase().includes(term) || n.specialty.toLowerCase().includes(term));
    const container = document.getElementById("nutritionistsList");
    if(!container) return;
    if(filtered.length===0){ container.innerHTML='<div style="padding:40px;text-align:center">No nutritionists</div>'; return; }
    container.innerHTML = filtered.map(n => `<div class="nutritionist-item"><div class="item-info"><h3>${escapeHtml(n.name)}</h3><p>${escapeHtml(n.specialty)} | ${escapeHtml(n.email)} | ${n.experience}</p></div><div class="item-actions"><button class="edit-btn" onclick="editNutritionist(${n.id})">Edit</button><button class="delete-btn" onclick="deleteNutritionist(${n.id})">Delete</button></div></div>`).join('');
}
function renderSubscriptions() {
    const term = (document.getElementById("searchSubscription")?.value || "").toLowerCase();
    const filtered = subscriptions.filter(s => s.userName.toLowerCase().includes(term) || s.plan.toLowerCase().includes(term));
    const container = document.getElementById("subscriptionsList");
    if(!container) return;
    if(filtered.length===0){ container.innerHTML='<div style="padding:40px;text-align:center">No subscriptions</div>'; return; }
    container.innerHTML = filtered.map(s => `<div class="subscription-item"><div class="item-info"><h3>${escapeHtml(s.userName)} - ${escapeHtml(s.plan)}</h3><p>${s.startDate} → ${s.endDate} | Status: ${s.status}</p></div><div class="item-actions"><button class="edit-btn" onclick="editSubscription(${s.id})">Edit</button><button class="delete-btn" onclick="deleteSubscription(${s.id})">Delete</button></div></div>`).join('');
}
function renderSystemLogs() {
    const container = document.getElementById("systemLogsContainer");
    if(!container) return;
    container.innerHTML = systemLogs.map(log => `<div class="log-entry"><span class="log-time">${new Date(log.timestamp).toLocaleString()}</span><br>${escapeHtml(log.message)}</div>`).join('');
    if(systemLogs.length===0) container.innerHTML = '<div class="log-entry">No logs available.</div>';
}
function loadSystemConfigForm() {
    document.getElementById("siteName").value = systemConfig.siteName;
    document.getElementById("supportEmail").value = systemConfig.supportEmail;
    document.getElementById("maintenanceMode").value = systemConfig.maintenanceMode ? "1" : "0";
}

// CRUD Users
function addUser() { openModal('user', null); }
function editUser(id) { const user = users.find(u=>u.id===id); openModal('user', user); }
function deleteUser(id) { if(confirm("Delete user?")){ const user = users.find(u=>u.id===id); users=users.filter(u=>u.id!==id); subscriptions=subscriptions.filter(s=>s.userId!==id); renderUsers(); renderSubscriptions(); updateAdminStats(); addLog(`Deleted user ${user?.name}`); showNotification("User deleted"); } }
// CRUD Nutritionists
function addNutritionist() { openModal('nutritionist', null); }
function editNutritionist(id) { const n = nutritionists.find(n=>n.id===id); openModal('nutritionist', n); }
function deleteNutritionist(id) { if(confirm("Remove nutritionist?")){ const nut=nutritionists.find(n=>n.id===id); nutritionists=nutritionists.filter(n=>n.id!==id); renderNutritionists(); updateAdminStats(); addLog(`Deleted nutritionist ${nut?.name}`); showNotification("Removed"); } }
// CRUD Subscriptions
function addSubscription() { openModal('subscription', null); }
function editSubscription(id) { const sub = subscriptions.find(s=>s.id===id); openModal('subscription', sub); }
function deleteSubscription(id) { if(confirm("Cancel subscription?")){ subscriptions=subscriptions.filter(s=>s.id!==id); renderSubscriptions(); updateAdminStats(); addLog(`Subscription id ${id} removed`); showNotification("Deleted"); } }

function openModal(type, item) {
    let html = '';
    if(type === 'user') {
        html = `<h2>${item ? 'Edit User' : 'Add User'}</h2><form id="dynamicForm"><div class="form-group"><label>Name</label><input name="name" value="${item ? escapeHtml(item.name) : ''}" required></div><div class="form-group"><label>Email</label><input name="email" value="${item ? escapeHtml(item.email) : ''}" required></div><div class="form-group"><label>Role</label><select name="role"><option ${item?.role==='premium'?'selected':''}>premium</option><option ${item?.role==='basic'?'selected':''}>basic</option></select></div><button type="submit" class="submit-btn">Save</button></form>`;
    } else if(type === 'nutritionist') {
        html = `<h2>${item ? 'Edit Nutritionist' : 'Add Nutritionist'}</h2><form id="dynamicForm"><div class="form-group"><label>Full Name</label><input name="name" value="${item ? escapeHtml(item.name) : ''}" required></div><div class="form-group"><label>Specialty</label><input name="specialty" value="${item ? escapeHtml(item.specialty) : ''}" required></div><div class="form-group"><label>Email</label><input name="email" value="${item ? escapeHtml(item.email) : ''}" required></div><div class="form-group"><label>Experience</label><input name="experience" value="${item ? escapeHtml(item.experience) : ''}" placeholder="e.g., 6 years"></div><button type="submit" class="submit-btn">Save</button></form>`;
    } else if(type === 'subscription') {
        const userOptions = users.map(u=>`<option value="${u.id}" data-name="${escapeHtml(u.name)}" ${item && item.userId===u.id ? 'selected' : ''}>${escapeHtml(u.name)}</option>`).join('');
        html = `<h2>${item ? 'Edit Subscription' : 'New Subscription'}</h2><form id="dynamicForm"><div class="form-group"><label>User</label><select name="userId" id="subUserSelect">${userOptions}</select></div><div class="form-group"><label>Plan</label><input name="plan" value="${item ? escapeHtml(item.plan) : 'Premium Monthly'}" required></div><div class="form-group"><label>Start Date</label><input type="date" name="startDate" value="${item ? item.startDate : new Date().toISOString().slice(0,10)}" required></div><div class="form-group"><label>End Date</label><input type="date" name="endDate" value="${item ? item.endDate : ''}" required></div><div class="form-group"><label>Status</label><select name="status"><option ${item?.status==='active'?'selected':''}>active</option><option ${item?.status==='expired'?'selected':''}>expired</option></select></div><button type="submit" class="submit-btn">Save</button></form>`;
    }
    const modal = document.getElementById("formModal");
    document.getElementById("modal-form-container").innerHTML = html;
    modal.style.display = "block";
    const form = document.getElementById("dynamicForm");
    form.onsubmit = (e) => {
        e.preventDefault();
        if(type === 'user') {
            if(item) { item.name = e.target.name.value; item.email = e.target.email.value; item.role = e.target.role.value; addLog(`User ${item.name} updated`); }
            else { const newId = Date.now(); const newUser = { id: newId, name: e.target.name.value, email: e.target.email.value, role: e.target.role.value }; users.push(newUser); addLog(`User ${newUser.name} added`); }
            renderUsers(); updateAdminStats();
        } else if(type === 'nutritionist') {
            if(item) { item.name = e.target.name.value; item.specialty = e.target.specialty.value; item.email = e.target.email.value; item.experience = e.target.experience.value; addLog(`Nutritionist ${item.name} updated`); }
            else { const newId = Date.now(); nutritionists.push({ id: newId, name: e.target.name.value, specialty: e.target.specialty.value, email: e.target.email.value, experience: e.target.experience.value || "1 year" }); addLog(`Added nutritionist ${e.target.name.value}`); }
            renderNutritionists(); updateAdminStats();
        } else if(type === 'subscription') {
            const userId = parseInt(e.target.userId.value);
            const selectedUser = users.find(u=>u.id===userId);
            const userName = selectedUser ? selectedUser.name : "Unknown";
            if(item) {
                item.userId = userId; item.userName = userName; item.plan = e.target.plan.value; item.startDate = e.target.startDate.value; item.endDate = e.target.endDate.value; item.status = e.target.status.value;
                addLog(`Subscription updated for ${userName}`);
            } else {
                subscriptions.push({ id: Date.now(), userId, userName, plan: e.target.plan.value, startDate: e.target.startDate.value, endDate: e.target.endDate.value, status: e.target.status.value });
                addLog(`New subscription for ${userName}`);
            }
            renderSubscriptions(); updateAdminStats();
        }
        closeModal();
        showNotification("Saved successfully");
    };
}
function closeModal() { document.getElementById("formModal").style.display = "none"; document.getElementById("modal-form-container").innerHTML = ""; }
function showNotification(msg) { const n = document.createElement("div"); n.textContent = msg; n.style.cssText = "position:fixed;bottom:24px;right:24px;background:#1e293b;color:white;padding:12px 24px;border-radius:12px;z-index:3000;font-size:13px;"; document.body.appendChild(n); setTimeout(()=>n.remove(),2500); }
function escapeHtml(str) { if(!str) return ''; return str.replace(/[&<>]/g, function(m){ if(m==='&') return '&amp;'; if(m==='<') return '&lt;'; if(m==='>') return '&gt;'; return m;}); }
function toggleMenu() { const m = document.getElementById("mobileMenu"); m.style.display = m.style.display === "flex" ? "none" : "flex"; }

// Navigation & Events
function setupNavigation() {
    const links = document.querySelectorAll(".sidebar nav a");
    const cards = document.querySelectorAll(".card");
    const statNavs = document.querySelectorAll(".stat-card");
    function navigate(pageId) {
        document.querySelectorAll(".page").forEach(p => p.classList.remove("active-page"));
        document.getElementById(`${pageId}-page`).classList.add("active-page");
        links.forEach(l => l.classList.remove("active"));
        const target = Array.from(links).find(l => l.getAttribute("data-page") === pageId);
        if(target) target.classList.add("active");
        if(pageId === "users") renderUsers(); if(pageId === "nutritionists") renderNutritionists(); if(pageId === "subscriptions") renderSubscriptions(); if(pageId === "system") { renderSystemLogs(); loadSystemConfigForm(); }
    }
    links.forEach(l => l.addEventListener("click", (e) => { e.preventDefault(); const pg = l.getAttribute("data-page"); if(pg === "logout") { if(confirm("Sign out?")) location.reload(); return; } navigate(pg); }));
    cards.forEach(c => c.addEventListener("click", () => { const pg = c.getAttribute("data-page"); if(pg) navigate(pg); }));
    statNavs.forEach(s => { const navTo = s.getAttribute("data-nav"); if(navTo) s.addEventListener("click", () => navigate(navTo)); });
    window.addEventListener("click", (e) => { if(e.target === document.getElementById("formModal")) closeModal(); });
    document.querySelector(".close").onclick = closeModal;
    document.getElementById("signOutBtn").onclick = () => { if(confirm("Sign out?")) location.reload(); };
    document.getElementById("mobileSignOutBtn").onclick = () => { if(confirm("Sign out?")) location.reload(); };
}

document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("year").innerText = new Date().getFullYear();
    setupNavigation();
    renderUsers(); renderNutritionists(); renderSubscriptions(); renderSystemLogs(); loadSystemConfigForm();
    updateAdminStats();
    document.getElementById("addUserBtn").onclick = addUser;
    document.getElementById("addNutritionistBtn").onclick = addNutritionist;
    document.getElementById("addSubscriptionBtn").onclick = addSubscription;
    document.getElementById("searchUser")?.addEventListener("input", () => renderUsers());
    document.getElementById("searchNutritionist")?.addEventListener("input", () => renderNutritionists());
    document.getElementById("searchSubscription")?.addEventListener("input", () => renderSubscriptions());
    document.getElementById("systemConfigForm")?.addEventListener("submit", (e) => { e.preventDefault(); systemConfig.siteName = document.getElementById("siteName").value; systemConfig.supportEmail = document.getElementById("supportEmail").value; systemConfig.maintenanceMode = document.getElementById("maintenanceMode").value === "1"; updateAdminStats(); addLog("System configuration updated"); showNotification("Settings saved"); });
    document.getElementById("clearLogsBtn")?.addEventListener("click", () => { systemLogs = []; renderSystemLogs(); addLog("Logs cleared by admin"); showNotification("Logs cleared"); });
});

// Make CRUD functions globally accessible for inline onclick attributes
window.editUser = editUser; window.deleteUser = deleteUser;
window.editNutritionist = editNutritionist; window.deleteNutritionist = deleteNutritionist;
window.editSubscription = editSubscription; window.deleteSubscription = deleteSubscription;
window.addUser = addUser; window.addNutritionist = addNutritionist; window.addSubscription = addSubscription;