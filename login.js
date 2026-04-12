function toggleMenu() {
  const menu = document.getElementById("mobileMenu");

  if (menu.style.display === "flex") {
    menu.style.display = "none";
  } else {
    menu.style.display = "flex";
  }
}function login(event) {
  event.preventDefault();

  let email = document.getElementById("email").value;
  let password = document.getElementById("password").value;
  let error = document.getElementById("error");

  if (email === "" || password === "") {
    error.textContent = "Please fill all fields";
    return;
  }

  // fake login check
  error.style.color = "green";
  error.textContent = "Login successful ✔";

  // redirect example (dashboard later)
  // window.location.href = "dashboard.html";
}

document.getElementById("year").textContent = new Date().getFullYear();