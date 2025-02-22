(() => {
    'use strict'; // 厳格モードを使用して、より厳密なエラーチェックを行う
    let flag = false;
    formBridge.events.on('form.show', async function (context) {
        if (flag === true) {
        async function QRCode() {
            const qrData = await QRactive('qr'); //QR実行関数にラベル要素のフィールドコード「qr」として渡して実行
            alert(qrData)
            if (qrData !== '') {
                //ここから変更部分
                // const select = document.querySelector('input[type="radio"]').closest('label').getAttribute('aria-checked');
                const select = document.querySelector('input[value="作業者"]').closest('label').getAttribute('aria-checked');
                alert(select);
                if (select === 'true') {
                    context.setFieldValue('名前1', qrData);
                } else {
                    context.setFieldValue('名前2', qrData);
                }
                //ここまで
            }
            requestAnimationFrame(QRCode); // QRコード読み取り後に再度関数を呼び出す
        };
        requestAnimationFrame(QRCode); // 初回の関数を呼び出し
    }else{
        flag = true;
    };
    });
})();