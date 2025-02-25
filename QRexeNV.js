function QRactive(spID) { //ラベル要素のフィールドコードの受け取り
    return new Promise((resolve) => { //非同期処理
    let cancelLoop = false; // ループキャンセルフラグ
    // 【1】カメラの設定（背面カメラを使用）
    const constraints = {
    video: {
        width: 150, // ビデオの幅を設定
        height: 150, // ビデオの高さを設定
        aspectRatio: 1.5, // アスペクト比を設定
        facingMode: 'environment', // 背面カメラを使用
    },
    };
    // 【2】HTML要素の作成（ビデオとキャンバスとボタン）
    const sp = document.querySelector('[data-field-code="'+spID+'"]'); //ラベル要素の取得
    if (!sp) {
        alert('ラベル要素が見つかりません');
    }
    //ビデオとキャンバスの作成
    const video = document.createElement('video'); // カメラ映像を表示するビデオ要素を作成
    const canvas = document.createElement('canvas'); // QRコードを読み取るためのキャンバス要素を作成
    canvas.width = constraints.video.width; // キャンバスの幅を設定
    canvas.height = constraints.video.height; // キャンバスの高さを設定
    const context = canvas.getContext('2d'); // キャンバスの2D描画コンテキストを取得
    //QRコード読取ボタンの作成
    const btn = document.createElement('button'); // ボタン要素を作成
    btn.textContent = 'QRコード読取'; // ボタンのテキストを設定
    btn.style.width = '150px'; // ボタンの幅を設定
    btn.style.height = '150px'; // ボタンの高さを設定
    btn.style.backgroundColor = 'green';
    //キャンセルボタンの作成
    const Cbtn = document.createElement('button'); // ボタン要素を作成
    Cbtn.textContent = 'キャンセル'; // ボタンのテキストを設定
    Cbtn.style.width = '150px'; // ボタンの幅を設定
    Cbtn.style.height = '150px'; // ボタンの高さを設定
    Cbtn.style.backgroundColor = 'green';

    sp.appendChild(btn); // ラベル要素にボタンを追加

    // 【3】ボタンを押された後の処理
    btn.onclick = async () => {
        sp.appendChild(canvas); // ラベル要素にキャンバスを追加
        sp.appendChild(Cbtn); // ラベル要素にキャンセルボタンを追加
        btn.style.display = 'none'; // ボタンを非表示
        canvas.style.display = 'block'; // キャンバスを表示（カメラ映像を表示）
        Cbtn.style.display = 'block'; // キャンセルボタンを表示

        let stream;
        try {
        stream = await navigator.mediaDevices.getUserMedia(constraints); // カメラストリームを取得
        } catch (err) {
        alert('カメラが見つかりませんでした'); // エラー発生時はメッセージを表示
        // UIをリセット（ボタンを再表示）
        resetUI()
        return;
        }

        video.srcObject = stream; // ビデオ要素にカメラストリームを設定
        video.play(); // ビデオの再生を開始

        const loop = async () => {
            const repeat = requestAnimationFrame(loop); // 次のフレームで再度ループを呼び出す

            if (cancelLoop) { // キャンセルフラグが立っていたらQR読み取りを停止する
                cancelAnimationFrame(repeat); // ループを停止
                stream.getTracks().forEach(track => track.stop()); // カメラストリームを停止
                cancelLoop = false; // フラグをリセット

              // UIをリセット（ボタンを再表示）
                resetUI()
                return;
            }

            if (video.readyState !== video.HAVE_ENOUGH_DATA) return; // ビデオの準備ができていない場合は処理をスキップ

            context.drawImage(video, 0, 0, constraints.video.width, constraints.video.height); // ビデオの現在のフレームをキャンバスに描画
            const imageData = context.getImageData(0, 0, constraints.video.width, constraints.video.height); // キャンバスの画像データを取得
            const code = jsQR(imageData.data, imageData.width, imageData.height, { inversionAttempts: 'dontInvert' }); // QRコードを読み取る

            if (!code || code.data === '') return; // QRコードが検出されなかった場合は何もしない

            cancelAnimationFrame(repeat); // QRコードを取得できたらループを停止
            stream.getTracks().forEach(track => track.stop()); // カメラストリームを停止

            alert('読み取り成功'); // 読み取り成功メッセージを表示
            // UIをリセット（ボタンを再表示）
            sp.innerHTML = ''; // ラベル要素の内容をクリア
            resolve(code.data);

        };
        requestAnimationFrame(loop); // ループを開始（QRコード読み取り）
    };
    Cbtn.onclick = () => {
        cancelLoop = true;
    };
    //リセット関数
    function resetUI(){
        sp.innerHTML = ''; // ラベル要素の内容をクリア
        sp.appendChild(btn); // ラベル要素に再度ボタンを追加
        btn.style.display = 'block'; // ボタンを表示
    }
    });
}