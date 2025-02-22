(() => {
  'use strict'; // 厳格モードを使用して、より厳密なエラーチェックを行う

  // 【1】カメラの設定（背面カメラを使用）
  const constraints = {
    video: {
      width: 150, // ビデオの幅を設定
      height: 150, // ビデオの高さを設定
      aspectRatio: 1.5, // アスペクト比を設定
      facingMode: 'environment', // 背面カメラを使用
    },
  };

  // 【2】HTML要素の作成（ビデオとキャンバス）
  const video = document.createElement('video'); // カメラ映像を表示するビデオ要素を作成
  const canvas = document.createElement('canvas'); // QRコードを読み取るためのキャンバス要素を作成
  canvas.width = constraints.video.width; // キャンバスの幅を設定
  canvas.height = constraints.video.height; // キャンバスの高さを設定
  const context = canvas.getContext('2d'); // キャンバスの2D描画コンテキストを取得

  // 【3】フォームが作成された後のイベントリスナーを設定
  fb.events.form.mounted = [async function (state) {
    const sp = fb.getElementByCode('qr'); // QRコード読取ボタンを配置するスペース（ラベル要素）を取得
    const btn = document.createElement('button'); // ボタン要素を作成
    btn.textContent = 'QRコード読取'; // ボタンのテキストを設定
    btn.style.width = '150px'; // ボタンの幅を設定
    btn.style.height = '150px'; // ボタンの高さを設定
    sp.appendChild(btn); // ラベル要素にボタンを追加

    // 【4】ボタンがクリックされたときの処理（QRコードスキャン開始）
    btn.onclick = async () => {
      sp.appendChild(canvas); // ラベル要素にキャンバスを追加

      btn.style.display = 'none'; // ボタンを非表示
      canvas.style.display = 'block'; // キャンバスを表示（カメラ映像を表示）

      let stream;
      try {
        stream = await navigator.mediaDevices.getUserMedia(constraints); // カメラストリームを取得
      } catch (err) {
        console.error('カメラへのアクセスエラー: ', err); // エラー発生時はメッセージを表示
        return;
      }

      video.srcObject = stream; // ビデオ要素にカメラストリームを設定
      video.play(); // ビデオの再生を開始

      // 【5】QRコードをスキャンするループ処理
      const loop = async () => {
        const repeat = requestAnimationFrame(loop); // 次のフレームで再度ループを呼び出す
        if (video.readyState !== video.HAVE_ENOUGH_DATA) return; // ビデオの準備ができていない場合は処理をスキップ

        context.drawImage(video, 0, 0, constraints.video.width, constraints.video.height); // ビデオの現在のフレームをキャンバスに描画
        const imageData = context.getImageData(0, 0, constraints.video.width, constraints.video.height); // キャンバスの画像データを取得
        const code = jsQR(imageData.data, imageData.width, imageData.height, { inversionAttempts: 'dontInvert' }); // QRコードを読み取る

        if (!code || code.data === '') return; // QRコードが検出されなかった場合は何もしない

        cancelAnimationFrame(repeat); // QRコードを取得できたらループを停止
        stream.getTracks().forEach(track => track.stop()); // カメラストリームを停止

        // 【6】QRコードのデータをフォームのレコードに保存
        if (state.record.入力選択.value == '作業者') {
          state.record.名前1.value = code.data; // 作業者の名前フィールドにQRコードのデータを設定
        } else {
          state.record.名前2.value = code.data; // 確認者の名前フィールドにQRコードのデータを設定
        }

        // 【7】UIをリセット（ボタンを再表示）
        sp.innerHTML = ''; // ラベル要素の内容をクリア
        sp.appendChild(btn); // ラベル要素に再度ボタンを追加
        btn.style.display = 'block'; // ボタンを表示

        alert('読み取り成功'); // 読み取り成功メッセージを表示

        return state; // 変更後の状態を返す
      };

      requestAnimationFrame(loop); // ループを開始（QRコード読み取り）
    };
  }];
})();
