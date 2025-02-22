(() => {
    'use strict'; // 厳格モードを使用して、より厳密なエラーチェックを行う
    fb.events.form.mounted = [async function (state) { //フォームのDOMが作成された後のイベントリスナーを設定
        async function QRCode() {
            const qrData = await QRactive('qr'); //QR実行関数にラベル要素のフィールドコード「qr」として渡して実行
            if (qrData !== '') {
                //ここから変更部分
                if (state.record.入力選択.value === '作業者') {
                    state.record.名前1.value = qrData;
                } else {
                    state.record.名前2.value = qrData;
                }
                //ここまで
            }
            //return state; //必須か不明
            requestAnimationFrame(QRCode); // QRコード読み取り後に再度関数を呼び出す
        }
        requestAnimationFrame(QRCode); // 初回の関数を呼び出し
    }];
})();