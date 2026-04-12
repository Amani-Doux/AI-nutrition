function login(event) {
  event.preventDefault();

  let email = document.getElementById("email").value;
  let password = document.getElementById("password").value;
  let error = document.getElementById("error");

  if (email === "" || password === "") {
    error.textContent = "Please fill all fields";
    error.style.color = "red";
    return;
  }

  if (password.length < 6) {
    error.textContent = "Password must be at least 6 characters";
    error.style.color = "red";
    return;
  }

  error.style.color = "green";
  error.textContent = "Login successful ✔";

  // redirect later
  // window.location.href = "dashboard.html";
}// small enhancement: smooth scroll for links
document.querySelectorAll("a").forEach(link => {
  link.addEventListener("click", function(e) {
    console.log("Navigating to:", this.textContent);
  });
});