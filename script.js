document.addEventListener("DOMContentLoaded", function () {
  var forms = document.querySelectorAll(".lead-form");
  var planButtons = document.querySelectorAll("[data-plan-select]");
  var menuButton = document.querySelector(".tg-menu-button");
  var mobileNav = document.querySelector(".tg-nav");

  if (menuButton && mobileNav) {
    menuButton.addEventListener("click", function () {
      var isOpen = mobileNav.classList.toggle("is-open");
      menuButton.classList.toggle("is-open", isOpen);
      menuButton.setAttribute("aria-expanded", String(isOpen));
    });

    mobileNav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        mobileNav.classList.remove("is-open");
        menuButton.classList.remove("is-open");
        menuButton.setAttribute("aria-expanded", "false");
      });
    });
  }

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
    form.addEventListener("submit", async function (event) {
      event.preventDefault();

      var message = form.querySelector(".form-message");
      var submitButton = form.querySelector('button[type="submit"]');
      var formData = new FormData(form);
      var endpoint = form.getAttribute("data-endpoint");
      var selectedPlan = form.querySelector('input[name="plan"]:checked');
      var honeypot = formData.get("company");

      if (honeypot) {
        return;
      }

      if (!endpoint) {
        if (message) {
          message.textContent = "Не настроена отправка формы";
          message.classList.add("is-visible");
        }
        return;
      }

      if (submitButton) {
        submitButton.disabled = true;
        submitButton.textContent = "Отправка...";
      }

      if (message) {
        message.classList.remove("is-visible");
        message.textContent = "";
      }

      try {
        await fetch(endpoint, {
          method: "POST",
          mode: "no-cors",
          headers: {
            "Content-Type": "text/plain;charset=utf-8",
          },
          body: JSON.stringify({
            platform: form.getAttribute("data-platform") || "",
            email: formData.get("email") || "",
            channel: formData.get("link") || "",
            plan: selectedPlan ? selectedPlan.value : "",
            audience: formData.get("audience") || "",
          }),
        });

        if (message) {
          message.textContent = "Заявка отправлена";
          message.classList.add("is-visible");
        }

        form.reset();

        var defaultPlan = form.querySelector('input[data-plan-id="standard"]');
        if (defaultPlan) {
          defaultPlan.checked = true;
        }
      } catch (error) {
        if (message) {
          message.textContent = "Не удалось отправить заявку. Попробуйте еще раз.";
          message.classList.add("is-visible");
        }
      } finally {
        if (submitButton) {
          submitButton.disabled = false;
          submitButton.textContent = "Отправить заявку";
        }
      }
    });
  });
});
