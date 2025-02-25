const showPasswordButton = document.getElementById("showPassword-btn");
const passwordField = document.getElementById("password");
const showConfirmPasswordButton = document.getElementById(
  "showConfirmPassword-btn"
);
const confirmPasswordField = document.getElementById("confirmPassword");

showPasswordButton.addEventListener("click", function () {
  if (passwordField.type == "password") {
    passwordField.type = "text";
  } else {
    passwordField.type = "password";
  }
});
showConfirmPasswordButton.addEventListener("click", function () {
  if (confirmPasswordField.type == "password") {
    confirmPasswordField.type = "text";
  } else {
    confirmPasswordField.type = "password";
  }
});
//request
document
  .getElementById("registerForm")
  .addEventListener("submit", async (e) => {
    e.preventDefault();

    const username = document.getElementById("username").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirmPassword").value;

    if (password !== confirmPassword) {
      alert("Confirmation password does not match!");
      return;
    }
    const response = await fetch("/api/av1/user", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username,
        email,
        password,
      }),
    });

    const data = await response.json();
    if (data.success === true) {
      alert("Your registration was successful.");
      window.location.href = `/login`;
    } else {
      alert(data.message);
    }
  });
