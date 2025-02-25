(() => {
    'use strict';
    formBridge.events.on('form.show', function () {
    const sp = document.querySelector('[data-field-code="qr"]');
    const btn = document.createElement('button'); // ボタン要素を作成
    btn.textContent = 'QRコード読取'; // ボタンのテキストを設定
    btn.style.width = '150px'; // ボタンの幅を設定
    btn.style.height = '150px'; // ボタンの高さを設定
    btn.style.backgroundColor = 'green';
    sp.appendChild(btn); // ラベル要素にボタンを追加
    });
})();
