// activate icons
lucide.createIcons();

function sendMessage(event) {
  event.preventDefault();

  let name = document.getElementById("name").value;
  let email = document.getElementById("email").value;
  let message = document.getElementById("message").value;
  let status = document.getElementById("status");

  if (name === "" || email === "" || message === "") {
    status.style.color = "red";
    status.textContent = "Please fill all fields";
    return;
  }

  status.style.color = "green";
  status.textContent = "Message sent successfully ✔";

  // later: connect to backend
}