const showPasswordButton = document.getElementById("showPassword-btn");
const passwordField = document.getElementById("password");
showPasswordButton.addEventListener("click", function () {
  if (passwordField.type == "password") {
    passwordField.type = "text";
  } else {
    passwordField.type = "password";
  }
});
setTimeout(() => {
  const flashMessage = document.getElementById("flashMessage");
  if (flashMessage) {
    flashMessage.classList.add("hidden");
    setTimeout(() => flashMessage.remove(), 500); // Xóa hẳn phần tử sau hiệu ứng
  }
}, 3000);
