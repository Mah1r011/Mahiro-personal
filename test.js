(() => {
    'use strict';

    // QRコードリーダーの初期化と設定
    const video = document.createElement('video');
    const canvasElement = document.createElement('canvas');
    const canvas = canvasElement.getContext('2d');
    
    // QRコードリーダーの要素をラベルフィールドに追加
    formBridge.events.on('form.load', () => {
        const qrLabel = document.querySelector('[data-field-name="qr"]');
        if (qrLabel) {
            qrLabel.appendChild(video);
            qrLabel.appendChild(canvasElement);
            
            // カメラの起動
            navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } })
                .then(function(stream) {
                    video.srcObject = stream;
                    video.setAttribute("playsinline", true);
                    video.play();
                    requestAnimationFrame(tick);
                })
                .catch(function(err) {
                    console.error("カメラの起動に失敗しました: ", err);
                });
        }
    });

    function tick() {
        if (video.readyState === video.HAVE_ENOUGH_DATA) {
            canvasElement.height = video.videoHeight;
            canvasElement.width = video.videoWidth;
            canvas.drawImage(video, 0, 0, canvasElement.width, canvasElement.height);
            
            const imageData = canvas.getImageData(0, 0, canvasElement.width, canvasElement.height);
            const code = jsQR(imageData.data, imageData.width, imageData.height, {
                inversionAttempts: "dontInvert",
            });
            
            if (code) {
                console.log("QRコードを検出: " + code.data);
                // ここでQRコードの値を使用して必要な処理を実行
            }
        }
        requestAnimationFrame(tick);
    }
})();
