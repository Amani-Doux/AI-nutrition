// Initialize Lucide icons
lucide.createIcons();

// DOM elements
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const emailError = document.getElementById('emailError');
const passwordError = document.getElementById('passwordError');
const loginBtn = document.getElementById('loginBtn');
const btnText = document.getElementById('btnText');
const btnLoader = document.getElementById('btnLoader');
const errorPara = document.getElementById('error');
const rememberCheckbox = document.getElementById('rememberMe');

// Real-time validation
function validateEmail() {
  const email = emailInput.value.trim();
  const emailRegex = /^[^\s@]+@([^\s@]+\.)+[^\s@]+$/;
  if (email === '') {
    emailError.textContent = 'Email is required';
    return false;
  }
  if (!emailRegex.test(email)) {
    emailError.textContent = 'Enter a valid email address';
    return false;
  }
  emailError.textContent = '';
  return true;
}

function validatePassword() {
  const password = passwordInput.value;
  if (password === '') {
    passwordError.textContent = 'Password is required';
    return false;
  }
  if (password.length < 6) {
    passwordError.textContent = 'Password must be at least 6 characters';
    return false;
  }
  passwordError.textContent = '';
  return true;
}

emailInput.addEventListener('input', validateEmail);
passwordInput.addEventListener('input', validatePassword);

// Password visibility toggle
function togglePasswordVisibility() {
  const type = passwordInput.type === 'password' ? 'text' : 'password';
  passwordInput.type = type;
  lucide.createIcons(); // refresh icon
}

// Load saved email if "Remember Me" was checked
function loadSavedCredentials() {
  const savedEmail = localStorage.getItem('rememberedEmail');
  if (savedEmail) {
    emailInput.value = savedEmail;
    rememberCheckbox.checked = true;
  }
}

// Login function
async function login(event) {
  event.preventDefault();

  const isEmailValid = validateEmail();
  const isPasswordValid = validatePassword();

  if (!isEmailValid || !isPasswordValid) {
    errorPara.style.color = '#dc2626';
    errorPara.textContent = '❌ Please fix the errors above';
    return;
  }

  // Show loading state
  btnText.classList.add('hidden');
  btnLoader.classList.remove('hidden');
  loginBtn.disabled = true;
  errorPara.textContent = '';

  // Simulate API call (replace with actual backend)
  await new Promise(resolve => setTimeout(resolve, 1500));

  // Handle "Remember Me"
  if (rememberCheckbox.checked) {
    localStorage.setItem('rememberedEmail', emailInput.value.trim());
  } else {
    localStorage.removeItem('rememberedEmail');
  }

  errorPara.style.color = '#16a34a';
  errorPara.innerHTML = '✅ Login successful! Redirecting...';

  // Redirect to dashboard (change to your actual page)
  setTimeout(() => {
    window.location.href = 'dashboard.html';
  }, 1200);
}

// Mobile menu toggle (FIXED: was missing)
function toggleMenu() {
  const menu = document.getElementById('mobileMenu');
  if (menu.style.display === 'flex') {
    menu.style.display = 'none';
  } else {
    menu.style.display = 'flex';
  }
}

// Set current year in footer
document.getElementById('year').textContent = new Date().getFullYear();

// Load saved credentials on page load
document.addEventListener('DOMContentLoaded', () => {
  loadSavedCredentials();
});

// Make functions global for inline onclick
window.togglePasswordVisibility = togglePasswordVisibility;
window.login = login;
window.toggleMenu = toggleMenu;