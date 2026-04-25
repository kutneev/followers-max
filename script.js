document.addEventListener("DOMContentLoaded", function () {
  var forms = document.querySelectorAll(".lead-form");

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
