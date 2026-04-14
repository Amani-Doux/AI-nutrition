// ---------- PERSISTENT DATA (localStorage) ----------
let users = [];
let nutritionists = [];
let subscriptions = [];
let systemLogs = [];
let systemConfig = { siteName: "NutriAI", supportEmail: "admin@nutriai.com", maintenanceMode: false };

// Load from localStorage or defaults
function loadData() {
  users = JSON.parse(localStorage.getItem('admin_users')) || [
    { id: 1, name: "Emily Clark", email: "emily@example.com", role: "premium" },
    { id: 2, name: "David Miller", email: "david@example.com", role: "basic" }
  ];
  nutritionists = JSON.parse(localStorage.getItem('admin_nutritionists')) || [
    { id: 1, name: "Dr. Sarah Lee", specialty: "Clinical Nutrition", email: "sarah@nutriai.com", experience: "8 years" },
    { id: 2, name: "Mark Wilson", specialty: "Sports Dietetics", email: "mark@nutriai.com", experience: "5 years" }
  ];
  subscriptions = JSON.parse(localStorage.getItem('admin_subscriptions')) || [
    { id: 1, userId: 1, userName: "Emily Clark", plan: "Premium Yearly", startDate: "2024-01-10", endDate: "2025-01-10", status: "active" },
    { id: 2, userId: 2, userName: "David Miller", plan: "Basic Monthly", startDate: "2024-02-01", endDate: "2024-03-01", status: "expired" }
  ];
  systemLogs = JSON.parse(localStorage.getItem('admin_logs')) || [
    { id: Date.now(), timestamp: new Date().toISOString(), message: "System initialized with persistence." }
  ];
  const savedConfig = localStorage.getItem('admin_config');
  if (savedConfig) systemConfig = JSON.parse(savedConfig);
}
function saveAll() {
  localStorage.setItem('admin_users', JSON.stringify(users));
  localStorage.setItem('admin_nutritionists', JSON.stringify(nutritionists));
  localStorage.setItem('admin_subscriptions', JSON.stringify(subscriptions));
  localStorage.setItem('admin_logs', JSON.stringify(systemLogs));
  localStorage.setItem('admin_config', JSON.stringify(systemConfig));
}
function addLog(message) {
  systemLogs.unshift({ id: Date.now(), timestamp: new Date().toISOString(), message });
  if (systemLogs.length > 100) systemLogs.pop();
  saveAll();
  if (document.getElementById("systemLogsContainer")) renderSystemLogs();
}

// Pagination state
let currentPage = { users: 1, nutritionists: 1, subscriptions: 1 };
const ITEMS_PER_PAGE = 5;

// Render helpers
function escapeHtml(str) { if(!str) return ''; return str.replace(/[&<>]/g, m => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;' }[m])); }
function showNotification(msg, isError=false) {
  let n = document.createElement("div");
  n.textContent = msg;
  n.style.cssText = `position:fixed;bottom:24px;right:24px;background:${isError ? '#b91c1c' : '#1e293b'};color:white;padding:12px 24px;border-radius:12px;z-index:3000;font-size:13px;`;
  document.body.appendChild(n);
  setTimeout(()=>n.remove(), 3000);
}

// Generic paginated render
function renderPaginated(containerId, items, searchTerm, searchFields, renderItemFunc, pageKey) {
  const filtered = items.filter(item => searchFields.some(field => String(item[field]).toLowerCase().includes(searchTerm)));
  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  let page = currentPage[pageKey];
  if (page > totalPages && totalPages > 0) page = totalPages;
  if (page < 1) page = 1;
  currentPage[pageKey] = page;
  const start = (page-1) * ITEMS_PER_PAGE;
  const paginated = filtered.slice(start, start + ITEMS_PER_PAGE);
  const container = document.getElementById(containerId);
  if(!container) return;
  if(paginated.length === 0) { container.innerHTML = '<div style="padding:40px;text-align:center">No items</div>'; }
  else { container.innerHTML = paginated.map(renderItemFunc).join(''); }
  // render pagination controls
  const paginationDiv = document.getElementById(`${containerId}Pagination`);
  if(paginationDiv) {
    let btns = `<button class="pagination-btn" data-page="prev" ${page===1?'disabled':''}>◀ Prev</button>`;
    for(let i=1; i<=totalPages; i++) btns += `<button class="pagination-btn ${i===page?'active':''}" data-page="${i}">${i}</button>`;
    btns += `<button class="pagination-btn" data-page="next" ${page===totalPages||totalPages===0?'disabled':''}>Next ▶</button>`;
    paginationDiv.innerHTML = btns;
    paginationDiv.querySelectorAll('.pagination-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        let newPage = btn.getAttribute('data-page');
        if(newPage === 'prev') newPage = page-1;
        else if(newPage === 'next') newPage = page+1;
        else newPage = parseInt(newPage);
        if(newPage >=1 && newPage <= totalPages) {
          currentPage[pageKey] = newPage;
          if(pageKey === 'users') renderUsers();
          else if(pageKey === 'nutritionists') renderNutritionists();
          else if(pageKey === 'subscriptions') renderSubscriptions();
        }
      });
    });
  }
}

// Render functions with pagination
function renderUsers() {
  const term = (document.getElementById("searchUser")?.value || "").toLowerCase();
  renderPaginated('usersList', users, term, ['name','email'], u => `
    <div class="user-item"><div><strong>${escapeHtml(u.name)}</strong><br>${escapeHtml(u.email)} | ${u.role}</div>
    <div class="item-actions"><button class="edit-btn" onclick="editUser(${u.id})">Edit</button><button class="delete-btn" onclick="deleteUser(${u.id})">Delete</button></div></div>`, 'users');
}
function renderNutritionists() {
  const term = (document.getElementById("searchNutritionist")?.value || "").toLowerCase();
  renderPaginated('nutritionistsList', nutritionists, term, ['name','specialty'], n => `
    <div class="nutritionist-item"><div><strong>${escapeHtml(n.name)}</strong><br>${escapeHtml(n.specialty)} | ${escapeHtml(n.email)} | ${n.experience}</div>
    <div class="item-actions"><button class="edit-btn" onclick="editNutritionist(${n.id})">Edit</button><button class="delete-btn" onclick="deleteNutritionist(${n.id})">Delete</button></div></div>`, 'nutritionists');
}
function renderSubscriptions() {
  const term = (document.getElementById("searchSubscription")?.value || "").toLowerCase();
  renderPaginated('subscriptionsList', subscriptions, term, ['userName','plan'], s => `
    <div class="subscription-item"><div><strong>${escapeHtml(s.userName)}</strong><br>${escapeHtml(s.plan)}<br>${s.startDate} → ${s.endDate} | ${s.status}</div>
    <div class="item-actions"><button class="edit-btn" onclick="editSubscription(${s.id})">Edit</button><button class="delete-btn" onclick="deleteSubscription(${s.id})">Delete</button></div></div>`, 'subscriptions');
}
function renderSystemLogs() {
  const container = document.getElementById("systemLogsContainer");
  if(container) container.innerHTML = systemLogs.slice(0,30).map(log => `<div class="log-entry"><small>${new Date(log.timestamp).toLocaleString()}</small><br>${escapeHtml(log.message)}</div><hr>`).join('');
}
function loadSystemConfigForm() {
  document.getElementById("siteName").value = systemConfig.siteName;
  document.getElementById("supportEmail").value = systemConfig.supportEmail;
  document.getElementById("maintenanceMode").value = systemConfig.maintenanceMode ? "1" : "0";
}
function updateAdminStats() {
  document.getElementById("totalUsers").innerText = users.length;
  document.getElementById("totalNutritionists").innerText = nutritionists.length;
  document.getElementById("activeSubscriptions").innerText = subscriptions.filter(s => s.status === "active").length;
  document.getElementById("sysHealth").innerHTML = systemConfig.maintenanceMode ? "⚠️ Maint" : "✓ Online";
  updateChart();
}
let statsChart = null;
function updateChart() {
  const ctx = document.getElementById('statsChart')?.getContext('2d');
  if(!ctx) return;
  if(statsChart) statsChart.destroy();
  statsChart = new Chart(ctx, {
    type: 'bar',
    data: { labels: ['Users', 'Nutritionists', 'Active Subs'], datasets: [{ label: 'Count', data: [users.length, nutritionists.length, subscriptions.filter(s=>s.status==='active').length], backgroundColor: '#16a34a' }] },
    options: { responsive: true, maintainAspectRatio: true }
  });
}

// CRUD operations
function addUser() { openModal('user', null); }
function editUser(id) { openModal('user', users.find(u=>u.id===id)); }
function deleteUser(id) { if(confirm("Delete user?")){ users = users.filter(u=>u.id!==id); subscriptions = subscriptions.filter(s=>s.userId!==id); saveAll(); renderUsers(); renderSubscriptions(); updateAdminStats(); addLog(`Deleted user ${id}`); showNotification("User deleted"); } }
function addNutritionist() { openModal('nutritionist', null); }
function editNutritionist(id) { openModal('nutritionist', nutritionists.find(n=>n.id===id)); }
function deleteNutritionist(id) { if(confirm("Remove?")){ nutritionists = nutritionists.filter(n=>n.id!==id); saveAll(); renderNutritionists(); updateAdminStats(); addLog(`Deleted nutritionist ${id}`); showNotification("Removed"); } }
function addSubscription() { openModal('subscription', null); }
function editSubscription(id) { openModal('subscription', subscriptions.find(s=>s.id===id)); }
function deleteSubscription(id) { if(confirm("Cancel?")){ subscriptions = subscriptions.filter(s=>s.id!==id); saveAll(); renderSubscriptions(); updateAdminStats(); addLog(`Deleted subscription ${id}`); showNotification("Deleted"); } }

function openModal(type, item) {
  let html = '';
  if(type === 'user') {
    html = `<h2>${item ? 'Edit User' : 'Add User'}</h2><form id="dynamicForm"><div class="form-group"><label>Name</label><input name="name" value="${item ? escapeHtml(item.name) : ''}" required></div><div class="form-group"><label>Email</label><input name="email" value="${item ? escapeHtml(item.email) : ''}" required></div><div class="form-group"><label>Role</label><select name="role"><option ${item?.role==='premium'?'selected':''}>premium</option><option ${item?.role==='basic'?'selected':''}>basic</option></select></div><button type="submit" class="submit-btn">Save</button></form>`;
  } else if(type === 'nutritionist') {
    html = `<h2>${item ? 'Edit Nutritionist' : 'Add Nutritionist'}</h2><form id="dynamicForm"><div class="form-group"><label>Name</label><input name="name" value="${item ? escapeHtml(item.name) : ''}" required></div><div class="form-group"><label>Specialty</label><input name="specialty" value="${item ? escapeHtml(item.specialty) : ''}" required></div><div class="form-group"><label>Email</label><input name="email" value="${item ? escapeHtml(item.email) : ''}" required></div><div class="form-group"><label>Experience</label><input name="experience" value="${item ? escapeHtml(item.experience) : ''}"></div><button type="submit" class="submit-btn">Save</button></form>`;
  } else if(type === 'subscription') {
    const opts = users.map(u=>`<option value="${u.id}" ${item && item.userId===u.id ? 'selected' : ''}>${escapeHtml(u.name)}</option>`).join('');
    html = `<h2>${item ? 'Edit Subscription' : 'New Subscription'}</h2><form id="dynamicForm"><div class="form-group"><label>User</label><select name="userId">${opts}</select></div><div class="form-group"><label>Plan</label><input name="plan" value="${item ? escapeHtml(item.plan) : 'Premium Monthly'}" required></div><div class="form-group"><label>Start Date</label><input type="date" name="startDate" value="${item ? item.startDate : new Date().toISOString().slice(0,10)}" required></div><div class="form-group"><label>End Date</label><input type="date" name="endDate" value="${item ? item.endDate : ''}" required></div><div class="form-group"><label>Status</label><select name="status"><option ${item?.status==='active'?'selected':''}>active</option><option ${item?.status==='expired'?'selected':''}>expired</option></select></div><button type="submit" class="submit-btn">Save</button></form>`;
  }
  document.getElementById("modal-form-container").innerHTML = html;
  document.getElementById("formModal").style.display = "block";
  document.getElementById("dynamicForm").onsubmit = (e) => {
    e.preventDefault();
    if(type === 'user') {
      if(item) { item.name = e.target.name.value; item.email = e.target.email.value; item.role = e.target.role.value; addLog(`User ${item.name} updated`); }
      else { const newId = Date.now(); users.push({ id: newId, name: e.target.name.value, email: e.target.email.value, role: e.target.role.value }); addLog(`User ${e.target.name.value} added`); }
      saveAll(); renderUsers(); updateAdminStats();
    } else if(type === 'nutritionist') {
      if(item) { item.name = e.target.name.value; item.specialty = e.target.specialty.value; item.email = e.target.email.value; item.experience = e.target.experience.value; addLog(`Nutritionist ${item.name} updated`); }
      else { nutritionists.push({ id: Date.now(), name: e.target.name.value, specialty: e.target.specialty.value, email: e.target.email.value, experience: e.target.experience.value || "1 year" }); addLog(`Added nutritionist ${e.target.name.value}`); }
      saveAll(); renderNutritionists(); updateAdminStats();
    } else if(type === 'subscription') {
      const userId = parseInt(e.target.userId.value);
      const userName = users.find(u=>u.id===userId)?.name || "Unknown";
      if(item) {
        item.userId = userId; item.userName = userName; item.plan = e.target.plan.value; item.startDate = e.target.startDate.value; item.endDate = e.target.endDate.value; item.status = e.target.status.value;
        addLog(`Subscription updated for ${userName}`);
      } else {
        subscriptions.push({ id: Date.now(), userId, userName, plan: e.target.plan.value, startDate: e.target.startDate.value, endDate: e.target.endDate.value, status: e.target.status.value });
        addLog(`New subscription for ${userName}`);
      }
      saveAll(); renderSubscriptions(); updateAdminStats();
    }
    closeModal();
    showNotification("Saved");
  };
}
function closeModal() { document.getElementById("formModal").style.display = "none"; }

// Dark mode
const darkToggle = document.getElementById('darkModeToggle');
darkToggle?.addEventListener('click', () => {
  document.body.classList.toggle('dark');
  localStorage.setItem('darkMode', document.body.classList.contains('dark'));
});
if(localStorage.getItem('darkMode') === 'true') document.body.classList.add('dark');

// Navigation & init
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
    if(pageId === "users") renderUsers();
    if(pageId === "nutritionists") renderNutritionists();
    if(pageId === "subscriptions") renderSubscriptions();
    if(pageId === "system") { renderSystemLogs(); loadSystemConfigForm(); }
  }
  links.forEach(l => l.addEventListener("click", (e) => { e.preventDefault(); const pg = l.getAttribute("data-page"); if(pg === "logout") { if(confirm("Sign out?")) location.reload(); return; } navigate(pg); }));
  cards.forEach(c => c.addEventListener("click", () => { const pg = c.getAttribute("data-page"); if(pg) navigate(pg); }));
  statNavs.forEach(s => { const navTo = s.getAttribute("data-nav"); if(navTo) s.addEventListener("click", () => navigate(navTo)); });
  document.querySelector(".close").onclick = closeModal;
  window.onclick = (e) => { if(e.target === document.getElementById("formModal")) closeModal(); };
}

document.addEventListener("DOMContentLoaded", () => {
  loadData();
  document.getElementById("year").innerText = new Date().getFullYear();
  setupNavigation();
  renderUsers(); renderNutritionists(); renderSubscriptions(); renderSystemLogs(); loadSystemConfigForm();
  updateAdminStats();
  document.getElementById("addUserBtn").onclick = addUser;
  document.getElementById("addNutritionistBtn").onclick = addNutritionist;
  document.getElementById("addSubscriptionBtn").onclick = addSubscription;
  document.getElementById("searchUser")?.addEventListener("input", () => { currentPage.users=1; renderUsers(); });
  document.getElementById("searchNutritionist")?.addEventListener("input", () => { currentPage.nutritionists=1; renderNutritionists(); });
  document.getElementById("searchSubscription")?.addEventListener("input", () => { currentPage.subscriptions=1; renderSubscriptions(); });
  document.getElementById("systemConfigForm")?.addEventListener("submit", (e) => {
    e.preventDefault();
    systemConfig.siteName = document.getElementById("siteName").value;
    systemConfig.supportEmail = document.getElementById("supportEmail").value;
    systemConfig.maintenanceMode = document.getElementById("maintenanceMode").value === "1";
    saveAll(); updateAdminStats(); addLog("System config updated"); showNotification("Settings saved");
  });
  document.getElementById("clearLogsBtn")?.addEventListener("click", () => { systemLogs = []; saveAll(); renderSystemLogs(); addLog("Logs cleared"); showNotification("Logs cleared"); });
  // Initialize Lucide icons
  if (typeof lucide !== 'undefined') lucide.createIcons();
});

window.editUser = editUser; window.deleteUser = deleteUser;
window.editNutritionist = editNutritionist; window.deleteNutritionist = deleteNutritionist;
window.editSubscription = editSubscription; window.deleteSubscription = deleteSubscription;
function toggleMenu() { const m = document.getElementById("mobileMenu"); if(m) m.style.display = m.style.display === "flex" ? "none" : "flex"; }