// Toggle password visibility
function togglePassword() {
  const input = document.getElementById("password");
  input.type = input.type === "password" ? "text" : "password";
}

function toggleConfirmPassword() {
  const input = document.getElementById("confirmPassword");
  input.type = input.type === "password" ? "text" : "password";
}

function toggleMenu() {
  const menu = document.getElementById("mobileMenu");
  menu.style.display = menu.style.display === "flex" ? "none" : "flex";
}

document.getElementById("year").textContent = new Date().getFullYear();

window.addEventListener('resize', function() {
  const menu = document.getElementById("mobileMenu");
  if (window.innerWidth > 768 && menu.style.display === "flex") {
    menu.style.display = "none";
  }
});

// ===== PASSWORD STRENGTH =====
const passwordInput = document.getElementById('password');
const strengthBar = document.getElementById('strengthBar');
const strengthText = document.getElementById('strengthText');

function checkPasswordStrength(password) {
  let strength = 0;
  if (password.length >= 8) strength++;
  if (password.match(/[a-z]/) && password.match(/[A-Z]/)) strength++;
  if (password.match(/[0-9]/)) strength++;
  if (password.match(/[^a-zA-Z0-9]/)) strength++;
  
  if (password.length === 0) return { level: 0, text: 'Enter password', color: '#e5e7eb', width: '0%' };
  if (strength === 1) return { level: 1, text: 'Weak', color: '#ef4444', width: '25%' };
  if (strength === 2) return { level: 2, text: 'Fair', color: '#f59e0b', width: '50%' };
  if (strength === 3) return { level: 3, text: 'Good', color: '#10b981', width: '75%' };
  return { level: 4, text: 'Strong', color: '#16a34a', width: '100%' };
}

passwordInput.addEventListener('input', function() {
  const result = checkPasswordStrength(this.value);
  strengthBar.style.width = result.width;
  strengthBar.style.background = result.color;
  strengthText.textContent = result.text;
  strengthText.style.color = result.color;
  checkPasswordMatch();
});

// ===== PASSWORD MATCH =====
const confirmInput = document.getElementById('confirmPassword');
const matchMessage = document.getElementById('matchMessage');

function checkPasswordMatch() {
  const password = passwordInput.value;
  const confirm = confirmInput.value;
  
  if (confirm.length === 0) {
    matchMessage.textContent = '';
    matchMessage.className = 'match-message';
    return;
  }
  
  if (password === confirm) {
    matchMessage.textContent = 'Passwords match';
    matchMessage.className = 'match-message success';
  } else {
    matchMessage.textContent = 'Passwords do not match';
    matchMessage.className = 'match-message error';
  }
}

confirmInput.addEventListener('input', checkPasswordMatch);

// ===== BACKEND API =====
const API_BASE = 'http://127.0.0.1:8000/api';

async function registerUser(userData) {
  const response = await fetch(`${API_BASE}/auth/register/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData)
  });
  return await response.json();
}

// ===== FORM SUBMISSION =====
const submitBtn = document.getElementById('submitBtn');
const btnTextSpan = submitBtn.querySelector('.btn-text');
const btnLoader = submitBtn.querySelector('.btn-loader');

submitBtn.addEventListener('click', async function() {
  const firstName = document.getElementById('firstName').value.trim();
  const lastName = document.getElementById('lastName').value.trim();
  const email = document.getElementById('email').value.trim();
  const password = passwordInput.value;
  const confirm = confirmInput.value;
  const goal = document.getElementById('goal').value;
  
  if (!firstName) { showError('Please enter your first name'); return; }
  if (!lastName) { showError('Please enter your last name'); return; }
  if (!email) { showError('Please enter your email address'); return; }
  if (!email.includes('@')) { showError('Enter a valid email'); return; }
  if (!password) { showError('Please create a password'); return; }
  if (password.length < 8) { showError('Password must be at least 8 characters'); return; }
  if (password !== confirm) { showError('Passwords do not match'); return; }
  if (!goal) { showError('Please select your health goal'); return; }
  
  btnTextSpan.textContent = 'Creating Account...';
  btnLoader.style.display = 'inline-block';
  submitBtn.disabled = true;
  
  // Prepare data for backend (matching the serializer)
  const userData = {
    username: `${firstName.toLowerCase()}${lastName.toLowerCase()}`,
    password: password,
    password2: password,  // ← IMPORTANT: confirm password field
    email: email,
    role: 'client',
    full_name: `${firstName} ${lastName}`
  };
  
  console.log('Sending data:', userData);
  
  try {
    const result = await registerUser(userData);
    console.log('Response:', result);
    
    if (result.success !== false && result.data) {
      showSuccess('Account created! Redirecting to dashboard...');
      
      // Auto login after registration
      setTimeout(async () => {
        try {
          const loginResponse = await fetch(`${API_BASE}/auth/login/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: email, password: password })
          });
          
          const loginData = await loginResponse.json();
          
          let token = null;
          let role = null;
          
          if (loginData.access) {
            token = loginData.access;
            role = loginData.role;
          } else if (loginData.data && loginData.data.access) {
            token = loginData.data.access;
            role = loginData.data.role;
          }
          
          if (token) {
            localStorage.setItem('access_token', token);
            localStorage.setItem('user_role', role);
            window.location.href = 'client.html';
          } else {
            window.location.href = 'login.html';
          }
        } catch (error) {
          window.location.href = 'login.html';
        }
      }, 1000);
      
    } else {
      let errorMsg = 'Registration failed';
      if (result.error) {
        if (typeof result.error === 'object') {
          errorMsg = Object.values(result.error).flat()[0];
        } else {
          errorMsg = result.error;
        }
      }
      showError(errorMsg);
      btnTextSpan.textContent = 'Create Account';
      btnLoader.style.display = 'none';
      submitBtn.disabled = false;
    }
  } catch (error) {
    console.error('Registration error:', error);
    showError('Cannot connect to server');
    btnTextSpan.textContent = 'Create Account';
    btnLoader.style.display = 'none';
    submitBtn.disabled = false;
  }
});

function showError(message) {
  const div = document.createElement('div');
  div.innerHTML = `<div style="background:#ef4444;color:white;padding:12px 24px;border-radius:12px;position:fixed;top:100px;left:50%;transform:translateX(-50%);z-index:9999;">${message}</div>`;
  document.body.appendChild(div);
  setTimeout(() => div.remove(), 3000);
}

function showSuccess(message) {
  const div = document.createElement('div');
  div.innerHTML = `<div style="background:#16a34a;color:white;padding:12px 24px;border-radius:12px;position:fixed;top:100px;left:50%;transform:translateX(-50%);z-index:9999;">${message}</div>`;
  document.body.appendChild(div);
  setTimeout(() => div.remove(), 3000);
}