// Toggle password visibility
function togglePassword() {
  const input = document.getElementById("password");
  if (input.type === "password") {
    input.type = "text";
  } else {
    input.type = "password";
  }
}

// Toggle confirm password visibility
function toggleConfirmPassword() {
  const input = document.getElementById("confirmPassword");
  if (input.type === "password") {
    input.type = "text";
  } else {
    input.type = "password";
  }
}

// Toggle mobile menu
function toggleMenu() {
  const menu = document.getElementById("mobileMenu");
  if (menu.style.display === "flex") {
    menu.style.display = "none";
  } else {
    menu.style.display = "flex";
  }
}

// Set current year in footer
document.getElementById("year").textContent = new Date().getFullYear();

// Close mobile menu on window resize
window.addEventListener('resize', function() {
  const menu = document.getElementById("mobileMenu");
  if (window.innerWidth > 768 && menu.style.display === "flex") {
    menu.style.display = "none";
  }
});

// ===== FORM VALIDATION & INTERACTIONS =====

// Password strength checker
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

// Confirm password matching
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

// Form validation and submission
const submitBtn = document.getElementById('submitBtn');
const btnText = submitBtn.querySelector('.btn-text');
const btnLoader = submitBtn.querySelector('.btn-loader');

submitBtn.addEventListener('click', function() {
  const firstName = document.getElementById('firstName').value.trim();
  const lastName = document.getElementById('lastName').value.trim();
  const email = document.getElementById('email').value.trim();
  const password = passwordInput.value;
  const confirm = confirmInput.value;
  const goal = document.getElementById('goal').value;
  
  // Validation
  if (!firstName) {
    showError('Please enter your first name');
    document.getElementById('firstName').focus();
    return;
  }
  
  if (!lastName) {
    showError('Please enter your last name');
    document.getElementById('lastName').focus();
    return;
  }
  
  if (!email) {
    showError('Please enter your email address');
    document.getElementById('email').focus();
    return;
  }
  
  if (!email.includes('@') || !email.includes('.')) {
    showError('Please enter a valid email address');
    document.getElementById('email').focus();
    return;
  }
  
  if (!password) {
    showError('Please create a password');
    passwordInput.focus();
    return;
  }
  
  if (password.length < 8) {
    showError('Password must be at least 8 characters');
    passwordInput.focus();
    return;
  }
  
  if (password !== confirm) {
    showError('Passwords do not match');
    confirmInput.focus();
    return;
  }
  
  if (!goal) {
    showError('Please select your health goal');
    document.getElementById('goal').focus();
    return;
  }
  
  // Show loading state
  btnText.textContent = 'Creating Account';
  btnLoader.style.display = 'inline-block';
  submitBtn.disabled = true;
  
  // Simulate API call
  setTimeout(() => {
    btnText.textContent = 'Create Account';
    btnLoader.style.display = 'none';
    submitBtn.disabled = false;
    
    showSuccess('Account created successfully!');
  }, 1500);
});

// Helper function to show error
function showError(message) {
  const existingError = document.querySelector('.toast-error');
  if (existingError) existingError.remove();
  
  const errorDiv = document.createElement('div');
  errorDiv.className = 'toast-error';
  errorDiv.innerHTML = `
    <div style="background: #ef4444; color: white; padding: 12px 24px; border-radius: 12px; position: fixed; top: 100px; left: 50%; transform: translateX(-50%); z-index: 9999; box-shadow: 0 4px 12px rgba(0,0,0,0.15); font-size: 14px; font-family: 'Inter', sans-serif;">
      ${message}
    </div>
  `;
  document.body.appendChild(errorDiv);
  
  setTimeout(() => {
    errorDiv.remove();
  }, 3000);
}

// Helper function to show success
function showSuccess(message) {
  const successDiv = document.createElement('div');
  successDiv.className = 'toast-success';
  successDiv.innerHTML = `
    <div style="background: #16a34a; color: white; padding: 12px 24px; border-radius: 12px; position: fixed; top: 100px; left: 50%; transform: translateX(-50%); z-index: 9999; box-shadow: 0 4px 12px rgba(0,0,0,0.15); font-size: 14px; font-family: 'Inter', sans-serif;">
      ${message}
    </div>
  `;
  document.body.appendChild(successDiv);
  
  setTimeout(() => {
    successDiv.remove();
  }, 3000);
}