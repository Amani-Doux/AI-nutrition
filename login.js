lucide.createIcons();

const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const emailError = document.getElementById('emailError');
const passwordError = document.getElementById('passwordError');
const loginBtn = document.getElementById('loginBtn');
const btnText = document.getElementById('btnText');
const btnLoader = document.getElementById('btnLoader');
const errorPara = document.getElementById('error');
const rememberCheckbox = document.getElementById('rememberMe');

const API_BASE = 'http://127.0.0.1:8000/api';

function validateEmail() {
    const value = emailInput.value.trim();
    if (value === '') {
        emailError.textContent = 'Email or Username is required';
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
    passwordError.textContent = '';
    return true;
}

emailInput.addEventListener('input', validateEmail);
passwordInput.addEventListener('input', validatePassword);

function togglePasswordVisibility() {
    const type = passwordInput.type === 'password' ? 'text' : 'password';
    passwordInput.type = type;
    lucide.createIcons();
}

function loadSavedCredentials() {
    const savedEmail = localStorage.getItem('rememberedEmail');
    if (savedEmail) {
        emailInput.value = savedEmail;
        rememberCheckbox.checked = true;
    }
}

async function login(event) {
    event.preventDefault();

    if (!validateEmail() || !validatePassword()) {
        errorPara.style.color = '#dc2626';
        errorPara.textContent = '❌ Please fix the errors above';
        return;
    }

    btnText.classList.add('hidden');
    btnLoader.classList.remove('hidden');
    loginBtn.disabled = true;
    errorPara.textContent = '';

    try {
        const response = await fetch(`${API_BASE}/auth/login/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: emailInput.value.trim(),
                password: passwordInput.value
            })
        });

        const data = await response.json();
        
        let token = null;
        let role = null;
        
        if (data.access) {
            token = data.access;
            role = data.role;
        } else if (data.data && data.data.access) {
            token = data.data.access;
            role = data.data.role;
        }
        
        if (token) {
            localStorage.setItem('access_token', token);
            
            if (rememberCheckbox.checked) {
                localStorage.setItem('rememberedEmail', emailInput.value.trim());
            }
            
            errorPara.style.color = '#16a34a';
            errorPara.innerHTML = '✅ Login successful! Redirecting...';
            
            setTimeout(() => {
                if (role === 'nutritionist') {
                    window.location.href = 'nutritionist.html';
                } else if (role === 'admin') {
                    window.location.href = 'admin.html';
                } else {
                    window.location.href = 'client.html';
                }
            }, 1000);
            
        } else {
            errorPara.style.color = '#dc2626';
            errorPara.textContent = '❌ Invalid email or password';
            btnText.classList.remove('hidden');
            btnLoader.classList.add('hidden');
            loginBtn.disabled = false;
        }
        
    } catch (error) {
        errorPara.style.color = '#dc2626';
        errorPara.textContent = '❌ Cannot connect to server';
        btnText.classList.remove('hidden');
        btnLoader.classList.add('hidden');
        loginBtn.disabled = false;
    }
}

function toggleMenu() {
    const menu = document.getElementById('mobileMenu');
    if (menu.style.display === 'flex') {
        menu.style.display = 'none';
    } else {
        menu.style.display = 'flex';
    }
}

document.getElementById('year').textContent = new Date().getFullYear();
document.addEventListener('DOMContentLoaded', loadSavedCredentials);

window.togglePasswordVisibility = togglePasswordVisibility;
window.login = login;
window.toggleMenu = toggleMenu;