document.addEventListener("DOMContentLoaded", function () {
  var attribution = getAttribution();
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
        trackGoal("rb_plan_select", targetInput.form, planId);
      }
    });
  });

  forms.forEach(function (form) {
    var formStarted = false;

    form.addEventListener("input", function (event) {
      if (!formStarted && event.target.matches('input[name="email"], input[name="link"]')) {
        formStarted = true;
        trackGoal("rb_form_start", form);
      }
    });

    form.addEventListener("change", function (event) {
      if (event.target.matches('input[name="plan"]:checked')) {
        trackGoal("rb_plan_select", form, event.target.dataset.planId);
      }
    });

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
        var response = await fetch(endpoint, {
          method: "POST",
          credentials: "omit",
          headers: {
            "Content-Type": "text/plain;charset=utf-8",
          },
          body: JSON.stringify({
            platform: form.getAttribute("data-platform") || "",
            email: formData.get("email") || "",
            channel: formData.get("link") || "",
            plan: selectedPlan ? selectedPlan.value : "",
            audience: formData.get("audience") || "",
            attribution: attribution,
          }),
        });

        if (!response.ok || (await response.json()).success !== true) {
          throw new Error("Заявка не подтверждена обработчиком");
        }

        trackGoal("rb_lead_success", form, selectedPlan && selectedPlan.dataset.planId);

        if (message) {
          message.dataset.state = "success";
          message.textContent = "Заявка получена. Свяжемся с вами по указанному контакту, чтобы обсудить запуск.";
          message.classList.add("is-visible");
        }

        form.reset();

        var defaultPlan = form.querySelector('input[data-plan-id="standard"]');
        if (defaultPlan) {
          defaultPlan.checked = true;
        }
      } catch (error) {
        trackGoal("rb_lead_error", form, selectedPlan && selectedPlan.dataset.planId);
        if (message) {
          message.dataset.state = "error";
          message.textContent = "Не удалось подтвердить получение заявки. Напишите нам в Telegram по ссылке под формой.";
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

  function trackGoal(goal, form, planId) {
    if (typeof window.ym !== "function") return;

    try {
      window.ym(105293150, "reachGoal", goal, {
        platform: form.dataset.platform,
        plan: planId || "",
      });
    } catch (error) {
      // Analytics must not interrupt submission or change its result.
    }
  }

  function getAttribution() {
    var query = new URLSearchParams(window.location.search);
    var attribution = { source: "Прямой переход" };
    var externalReferrer = false;
    if (document.referrer) {
      var referrer = new URL(document.referrer);
      if (referrer.origin !== window.location.origin) {
        externalReferrer = true;
        attribution.source = referrer.hostname;
      }
    }

    var hasCampaign = false;
    ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"].forEach(function (key) {
      var value = query.get(key);
      if (value && value.trim()) {
        hasCampaign = true;
        attribution[key] = value.trim().slice(0, 200);
      }
    });
    if (attribution.utm_source) attribution.source = attribution.utm_source;

    try {
      var saved = window.sessionStorage.getItem("realbuzz.attribution");
      if (saved && !hasCampaign && !externalReferrer) return JSON.parse(saved);
      window.sessionStorage.setItem("realbuzz.attribution", JSON.stringify(attribution));
    } catch (error) {
      // The current page's attribution is usable without browser storage.
    }
    return attribution;
  }
});

