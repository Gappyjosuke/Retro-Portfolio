document.addEventListener('DOMContentLoaded', () => {
  const input = document.getElementById("usernameInput");
  
  // Focus the input immediately
  input.focus();
  
  input.addEventListener("keydown", function (e) {
    if (e.key === "Enter") {
      const username = input.value.trim();
      if (username) {
        localStorage.setItem("portfolioUsername", username);
        // Add loading state
        input.disabled = true;
        input.placeholder = "Booting system...";
        setTimeout(() => {
          window.location.href = "boot.html";
        }, 500);
      }
    }
  });
  
  // Load previous username if exists
  const savedName = localStorage.getItem("portfolioUsername");
  if (savedName) {
    input.placeholder = `Welcome back, ${savedName}. Press Enter to continue...`;
  }
});