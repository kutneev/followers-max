document.addEventListener("DOMContentLoaded", function () {
  var forms = document.querySelectorAll(".lead-form");
  var planButtons = document.querySelectorAll("[data-plan-select]");

  planButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      var planId = button.getAttribute("data-plan-select");
      var targetInput = document.querySelector(
        'input[data-plan-id="' + planId + '"]'
      );

      if (targetInput) {
        targetInput.checked = true;
      }
    });
  });

  forms.forEach(function (form) {
    form.addEventListener("submit", function (event) {
      event.preventDefault();

      var message = form.querySelector(".form-message");

      if (message) {
        message.textContent = "Заявка отправлена";
        message.classList.add("is-visible");
      }

      form.reset();
    });
  });
});
