window.renderOrderPayment = function (container, order) {
  container.innerHTML = '<section class="order-payment" aria-label="Оплата заявки" data-clarity-mask="true">' +
    '<h3>Заявка сохранена — можно оплатить</h3>' +
    '<dl class="order-summary"><div><dt>Номер заявки</dt><dd data-order-id></dd></div><div><dt>Пакет</dt><dd data-order-plan></dd></div><div><dt>К оплате</dt><dd class="order-amount" data-order-amount></dd></div></dl>' +
    '<button type="button" class="payment-copy">Скопировать номер заявки</button>' +
    '<p>Выберите один способ оплаты. Введите указанную сумму вручную и проверьте получателя в приложении банка перед переводом.</p>' +
    '<div class="payment-banks"><article class="payment-bank"><h4>Сбер</h4><p>Сбер и Т-Банк</p><img src="/assets/payments/sber.png" width="600" height="600" alt="QR-код оплаты через Сбер"><a href="https://www.sberbank.ru/ru/choise_bank?requisiteNumber=79174812644&amp;bankCode=100000000111" target="_blank" rel="noopener noreferrer">Оплатить через Сбер ↗</a></article>' +
    '<article class="payment-bank"><h4>Альфа-Банк</h4><p>Альфа, Газпромбанк, ВТБ, МТС Банк, Совкомбанк</p><img src="/assets/payments/alfa.png" width="600" height="600" alt="QR-код оплаты через Альфа-Банк"><a href="https://c2c.cbrpay.ru/BS1I000S80DJB659986O6F6FV53371EP" target="_blank" rel="noopener noreferrer">Оплатить через Альфу ↗</a></article></div>' +
    '<p>После перевода отправьте номер заявки <strong data-order-id></strong> и подтверждение оплаты в <a href="https://t.me/Savkin_1337" target="_blank" rel="noopener noreferrer">Telegram @Savkin_1337</a>. Оплату проверяем вручную, днём в течение нескольких часов. Повторно оплачивать до ответа не нужно.</p>' +
    '<p class="payment-status">Статус оплаты: не проверена. Переход в банк сам по себе не подтверждает оплату.</p>' +
    '<p>Можно оплатить позже или сначала задать нам вопрос. <a href="/offer/">Условия заказа</a> · <a href="/returns/">Отмена и возврат</a>.</p></section>';
  container.querySelectorAll('[data-order-id]').forEach(function (node) { node.textContent = order.requestId; });
  container.querySelector('[data-order-plan]').textContent = order.plan;
  container.querySelector('[data-order-amount]').textContent = order.amount.toLocaleString('ru-RU') + ' ₽';
  var copyButton = container.querySelector('.payment-copy');
  copyButton.addEventListener('click', async function () {
    try { await navigator.clipboard.writeText(order.requestId); copyButton.textContent = 'Номер скопирован'; }
    catch (error) { copyButton.textContent = 'Выделите и скопируйте номер выше'; }
  });
};
