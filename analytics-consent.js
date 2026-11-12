(function () {
  var settings = document.currentScript.dataset;
  var counter = Number(settings.metrika);
  var clarityId = settings.clarity;
  var storageKey = "analytics-choice-v1";
  var loaded = false;
  var panel;

  function loadAnalytics() {
    if (loaded) return;
    loaded = true;
    window.ym = window.ym || function () {
      (window.ym.a = window.ym.a || []).push(arguments);
    };
    window.ym.l = Date.now();
    var tag = document.createElement("script");
    tag.async = true;
    tag.src = "https://mc.yandex.ru/metrika/tag.js";
    document.head.appendChild(tag);
    window.ym(counter, "init", {
      clickmap: true,
      trackLinks: true,
      accurateTrackBounce: true,
      webvisor: true
    });
    if (clarityId) {
      window.clarity = window.clarity || function () {
        (window.clarity.q = window.clarity.q || []).push(arguments);
      };
      var clarity = document.createElement("script");
      clarity.async = true;
      clarity.src = "https://www.clarity.ms/tag/" + clarityId;
      document.head.appendChild(clarity);
    }
  }

  function choose(choice) {
    try {
      localStorage.setItem(storageKey, choice);
    } catch {
      // This choice still applies to the current page without local storage.
    }
    panel.hidden = true;
    if (choice === "allowed") loadAnalytics();
    if (choice === "necessary" && loaded) window.location.reload();
  }

  function showSettings() {
    if (!panel) {
      var style = document.createElement("style");
      style.textContent = ".analytics-choice{position:fixed;z-index:1000;bottom:16px;left:16px;right:16px;max-width:600px;margin-left:auto;padding:20px;border:1px solid #dce4ed;border-radius:16px;background:#fff;color:#17242d;box-shadow:0 6px 32px #17242d26;font:15px/1.5 system-ui,sans-serif}.analytics-choice[hidden]{display:none}.analytics-choice p{margin:0 0 12px}.analytics-choice strong{font-size:17px}.analytics-choice a{color:#1758ca;text-decoration:underline}.analytics-choice__buttons{display:flex;gap:10px;flex-wrap:wrap}.analytics-choice button{min-height:44px;padding:10px 16px;border:1px solid #b7c5d5;border-radius:9px;background:#fff;color:#17242d;font:inherit;cursor:pointer}.analytics-choice button:last-child{background:#eaf3ff}.analytics-choice button:focus-visible{outline:3px solid #1674e8;outline-offset:3px}@media(max-width:480px){.analytics-choice{padding:16px;bottom:10px;left:10px;right:10px}.analytics-choice button{flex:1 1 150px}}";
      document.head.appendChild(style);
      panel = document.createElement("section");
      panel.className = "analytics-choice";
      panel.setAttribute("role", "region");
      panel.setAttribute("aria-label", "Настройки аналитики");
      panel.innerHTML = '<p><strong>Аналитика сайта</strong></p><p>С вашего разрешения подключим сервисы аналитики, чтобы понимать, как пользуются сайтом. Заявку можно отправить при любом выборе. <a href="/privacy/">Политика обработки данных</a>.</p><p class="analytics-choice__reload" hidden>Для отключения уже включённой аналитики страница перезагрузится. Перед этим сохраните введённые в форму данные.</p><div class="analytics-choice__buttons"><button type="button" data-choice="necessary">Только необходимые</button><button type="button" data-choice="allowed">Разрешить аналитику</button></div>';
      panel.querySelector('[data-choice="necessary"]').addEventListener("click", function () { choose("necessary"); });
      panel.querySelector('[data-choice="allowed"]').addEventListener("click", function () { choose("allowed"); });
      document.body.appendChild(panel);
    }
    panel.querySelector(".analytics-choice__reload").hidden = !loaded;
    panel.querySelector('[data-choice="necessary"]').textContent = loaded ? "Отключить и перезагрузить" : "Только необходимые";
    panel.hidden = false;
  }

  document.addEventListener("click", function (event) {
    var link = event.target instanceof Element && event.target.closest("[data-analytics-settings]");
    if (!link) return;
    event.preventDefault();
    showSettings();
    panel.querySelector("button").focus();
  });

  var choice;
  try {
    choice = localStorage.getItem(storageKey);
  } catch {
    choice = null;
  }
  if (choice === "allowed") loadAnalytics();
  else if (choice !== "necessary") showSettings();
})();
