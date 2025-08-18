// public/delete.js

document.addEventListener("DOMContentLoaded", () => {
  // Select all delete forms
  const deleteForms = document.querySelectorAll('form[action*="?_method=DELETE"]');

  deleteForms.forEach(form => {
    form.addEventListener("submit", function (event) {
      const confirmed = confirm("⚠️ Are you sure you want to delete this chat?");
      if (!confirmed) {
        event.preventDefault(); // stop form submission
      }
    });
  });
});
