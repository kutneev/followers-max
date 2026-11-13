window.renderOrderPayment = function (container, order) {
  container.innerHTML = '<section class="order-payment" aria-label="Оплата заявки" data-clarity-mask="true">' +
    '<h3>Заявка сохранена — можно оплатить</h3>' +
    '<dl class="order-summary"><div><dt>Номер заявки</dt><dd data-order-id></dd></div><div><dt>Пакет</dt><dd data-order-plan></dd></div><div><dt>К оплате</dt><dd class="order-amount" data-order-amount></dd></div></dl>' +
    '<p><span class="payment-instruction--desktop">Выберите банк, отсканируйте QR-код и введите сумму.</span><span class="payment-instruction--mobile">Выберите банк и введите сумму.</span></p>' +
    '<div class="payment-banks"><article class="payment-bank"><h4>Сбер и Т-Банк</h4><img src="/assets/payments/sber.png" width="600" height="600" alt="QR-код оплаты через Сбер"><a href="https://www.sberbank.ru/ru/choise_bank?requisiteNumber=79174812644&amp;bankCode=100000000111" target="_blank" rel="noopener noreferrer">Оплатить через Сбер ↗</a><small class="payment-help">Не открывается? Попробуйте Яндекс Браузер.</small><small class="payment-help payment-help--desktop">QR-код можно сканировать в приложении банка.</small></article>' +
    '<article class="payment-bank"><h4>Альфа, Газпромбанк, ВТБ, МТС Банк, Совкомбанк</h4><img src="/assets/payments/alfa.png" width="600" height="600" alt="QR-код оплаты через Альфа-Банк"><a href="https://c2c.cbrpay.ru/BS1I000S80DJB659986O6F6FV53371EP" target="_blank" rel="noopener noreferrer">Оплатить через Альфу ↗</a></article></div>' +
    '<p class="payment-support">Есть вопросы? <a href="https://t.me/Savkin_1337" target="_blank" rel="noopener noreferrer">Напишите нам в Telegram</a>.</p></section>';
  container.querySelectorAll('[data-order-id]').forEach(function (node) { node.textContent = order.requestId; });
  container.querySelector('[data-order-plan]').textContent = order.plan;
  container.querySelector('[data-order-amount]').textContent = order.amount.toLocaleString('ru-RU') + ' ₽';

};
