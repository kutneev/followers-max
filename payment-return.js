(function () {
  'use strict';
  var panel = document.querySelector('[data-payment-return]');
  if (!panel || panel.dataset.started) return;
  panel.dataset.started = 'true';
  var prefix = panel.dataset.prefix;
  var endpoints = {
    RB: 'https://script.google.com/macros/s/AKfycbzKXubCFSqxj29t9qPhLgD0RXhJaRhjtM4Y13LiqMKLB6EGgB10qRSJCm1tGSQEqJkk/exec',
    TG: 'https://script.google.com/macros/s/AKfycby2bRUuVzYXiMHYHQPX20AZ6v0iKcQHUeRY4ejFoo-LzDhIGlk34IUS9SBRBnPNbH_k/exec'
  };
  var id = new URLSearchParams(location.search).get('order') || '';
  var heading = panel.querySelector('[data-heading]');
  var message = panel.querySelector('[data-message]');
  var button = panel.querySelector('[data-refresh]');
  var summary = panel.querySelector('[data-summary]');
  var saved;
  try { saved = JSON.parse(sessionStorage.getItem('prodamus.order.' + id) || 'null'); } catch (_) {}
  if (!endpoints[prefix] || !(new RegExp('^' + prefix + '-[A-Z0-9]{12}$')).test(id) ||
      !saved || saved.requestId !== id || !/^[a-f0-9-]{36}$/i.test(saved.token || '') ||
      ![500, 2000, 3500].includes(saved.amount) || !Number.isFinite(saved.createdAt) ||
      Date.now() - saved.createdAt > 86400000 || saved.createdAt > Date.now() + 60000) {
    heading.textContent = 'Проверим ваш заказ';
    message.textContent = 'Не удалось автоматически проверить оплату в этом браузере. Если вы уже оплатили заказ, повторно платить не нужно. Напишите нам в Telegram — проверим заказ.';
    if (/^(RB|TG)-[A-Z0-9]{12}$/.test(id)) panel.querySelector('[data-reference]').textContent = 'Номер заказа: ' + id;
    return;
  }
  summary.hidden = false;
  panel.querySelector('[data-order-id]').textContent = id;
  panel.querySelector('[data-plan]').textContent = String(saved.plan || '');
  panel.querySelector('[data-amount]').textContent = saved.amount.toLocaleString('ru-RU') + ' ₽';
  var busy = false, attempts = 0, timer, paid = false;
  var delays = [3000, 5000, 8000, 12000, 20000];
  async function check() {
    if (busy || paid) return;
    clearTimeout(timer);
    busy = true;
    button.hidden = false;
    button.disabled = true;
    button.textContent = 'Проверяем…';
    heading.textContent = 'Проверяем оплату';
    message.textContent = 'Ожидаем подтверждение от платёжной системы. Повторно оплачивать заказ не нужно.';
    try {
      var response = await fetch(endpoints[prefix], {
        method: 'POST', credentials: 'omit', headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify({ action: 'orderStatus', requestId: id, submissionToken: saved.token }),
        signal: AbortSignal.timeout(15000)
      });
      var result = await response.json();
      if (!response.ok || result.success !== true || result.requestId !== id || result.amount !== saved.amount ||
          typeof result.paymentStatus !== 'string') throw new Error('Unconfirmed order');
      if (result.paymentStatus === 'Оплачено') {
        paid = true;
        heading.textContent = 'Спасибо! Заказ оплачен';
        message.textContent = 'Оплату получили. Мы начнём работу по вашему заказу. Если понадобятся уточнения, свяжемся с вами.';
        panel.querySelector('[data-amount-label]').textContent = 'Оплачено';
        panel.dataset.state = 'paid';
        button.hidden = true;
        return;
      }
      if (result.paymentStatus !== 'Не проверена') {
        heading.textContent = 'Уточним статус заказа';
        message.textContent = 'Статус заказа изменился. Напишите нам в Telegram — уточним детали. Повторно оплачивать заказ не нужно.';
        attempts = delays.length;
      }
    } catch (_) {
      heading.textContent = 'Проверяем ваш заказ';
      message.textContent = 'Сейчас не удалось получить подтверждение оплаты. Если вы уже оплатили заказ, повторно платить не нужно. Попробуйте проверить статус чуть позже или напишите нам в Telegram.';
    } finally {
      busy = false;
      if (!paid) {
        button.disabled = false;
        button.textContent = 'Проверить статус';
        if (attempts < delays.length) timer = setTimeout(check, delays[attempts++]);
        else if (heading.textContent === 'Проверяем оплату') {
          heading.textContent = 'Подтверждение оплаты ещё не поступило';
          message.textContent = 'Подтверждение может прийти с задержкой. Если вы уже оплатили заказ, повторно платить не нужно. Проверьте статус чуть позже или напишите нам в Telegram.';
        }
      }
    }
  }
  button.addEventListener('click', function () { attempts = 0; check(); });
  window.addEventListener('pagehide', function () { clearTimeout(timer); });
  check();
})();
