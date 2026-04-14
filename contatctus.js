// Initialize Lucide icons
lucide.createIcons();

// Mobile menu toggle
function toggleMenu() {
  const menu = document.getElementById("mobileMenu");
  if (menu.style.display === "flex") {
    menu.style.display = "none";
  } else {
    menu.style.display = "flex";
  }
}

// Set current year
document.getElementById("year").innerText = new Date().getFullYear();

// Close mobile menu on resize
window.addEventListener('resize', function() {
  const menu = document.getElementById("mobileMenu");
  if (window.innerWidth > 768 && menu.style.display === "flex") {
    menu.style.display = "none";
  }
});

// ===== FORM VALIDATION & SUBMISSION =====
const nameInput = document.getElementById('name');
const emailInput = document.getElementById('email');
const messageInput = document.getElementById('message');
const nameError = document.getElementById('nameError');
const emailError = document.getElementById('emailError');
const messageError = document.getElementById('messageError');
const charCountSpan = document.getElementById('charCount');
const submitBtn = document.getElementById('submitBtn');
const btnText = document.getElementById('btnText');
const btnLoader = document.getElementById('btnLoader');
const statusPara = document.getElementById('status');

// Character counter
if (messageInput) {
  messageInput.addEventListener('input', () => {
    const len = messageInput.value.length;
    charCountSpan.textContent = len;
    if (len === 500) {
      messageError.textContent = 'Maximum 500 characters reached';
    } else {
      messageError.textContent = '';
    }
  });
}

function validateName() {
  const name = nameInput.value.trim();
  if (name === '') {
    nameError.textContent = 'Name is required';
    return false;
  }
  nameError.textContent = '';
  return true;
}

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

function validateMessage() {
  const msg = messageInput.value.trim();
  if (msg === '') {
    messageError.textContent = 'Message cannot be empty';
    return false;
  }
  if (msg.length > 500) {
    messageError.textContent = 'Message exceeds 500 characters';
    return false;
  }
  messageError.textContent = '';
  return true;
}

nameInput?.addEventListener('input', validateName);
emailInput?.addEventListener('input', validateEmail);
messageInput?.addEventListener('input', validateMessage);

async function sendMessage(event) {
  event.preventDefault();

  const isNameValid = validateName();
  const isEmailValid = validateEmail();
  const isMsgValid = validateMessage();

  if (!isNameValid || !isEmailValid || !isMsgValid) {
    statusPara.style.color = '#dc2626';
    statusPara.textContent = '❌ Please fix the errors above';
    return;
  }

  btnText.classList.add('hidden');
  btnLoader.classList.remove('hidden');
  submitBtn.disabled = true;
  statusPara.textContent = '';

  await new Promise(resolve => setTimeout(resolve, 1500));

  const contactData = {
    name: nameInput.value.trim(),
    email: emailInput.value.trim(),
    message: messageInput.value.trim(),
    date: new Date().toISOString()
  };
  let messages = JSON.parse(localStorage.getItem('contact_messages') || '[]');
  messages.push(contactData);
  localStorage.setItem('contact_messages', JSON.stringify(messages));

  statusPara.style.color = '#16a34a';
  statusPara.innerHTML = '✅ Message sent successfully! We’ll reply soon.';
  
  nameInput.value = '';
  emailInput.value = '';
  messageInput.value = '';
  charCountSpan.textContent = '0';
  
  btnText.classList.remove('hidden');
  btnLoader.classList.add('hidden');
  submitBtn.disabled = false;

  setTimeout(() => {
    if (statusPara.innerHTML.includes('successfully')) {
      statusPara.textContent = '';
    }
  }, 5000);
}

// FAQ Accordion
document.querySelectorAll('.faq-question').forEach(question => {
  question.addEventListener('click', () => {
    const faqItem = question.parentElement;
    faqItem.classList.toggle('active');
  });
});