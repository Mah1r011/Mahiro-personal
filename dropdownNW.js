(() => {
    'use strict'; // 厳格モードを使用する
    // `__NEXT_DATA__`要素を取得
    const scriptTag = document.getElementById('__NEXT_DATA__');
    if (scriptTag) {
        // JSONデータを解析
        let nextData = JSON.parse(scriptTag.textContent);
        // APIリクエストを作成
        const xhr = new XMLHttpRequest();
        xhr.open('GET', 'https://70d08775.viewer.kintoneapp.com/public/api/records/3658874fd666e86eefe812f30aa63307737457dca6193b03d688498e6a20e250/1', false);
        xhr.send();

        if (xhr.status === 200) { // リクエストが成功した場合
            // 名前のリストを作成
            const res = JSON.parse(xhr.responseText);
            const names = res.records.map(record => record.名前.value);
            // ドロップダウンフィールドのオプションを更新
            nextData.props.pageProps.formSetting.fields.forEach(field => {
                if (field.type === "DROP_DOWN") { // ドロップダウンフィールドを確認
                    field.options = names; // オプションを更新
                }
            });
            // 複数選択フィールドのオプションを更新
            nextData.props.pageProps.formSetting.fields.forEach(field => {
                if (field.type === "MULTI_SELECT") { // 複数選択フィールドを確認
                    field.options = names; // オプションを更新
                }
            });
            // サブテーブルのドロップダウンフィールドのオプションを更新
            nextData.props.pageProps.formSetting.fields.forEach(field => {
                if (field.type === "SUBTABLE") { // サブテーブルを確認
                    field.tableFields.forEach(subField => {
                        if (subField.type === "DROP_DOWN") { // サブフィールドのドロップダウンフィールドを確認
                            subField.options = names; // オプションを更新
                        }
                    });
                }
            });
            // 更新されたデータを戻す
            scriptTag.textContent = JSON.stringify(nextData);
        } else {
            console.log(xhr.status); // エラーの場合、ステータスコードを出力
        }
    };

    formBridge.events.on('form.field.change.複数選択', function (context) {
        const NAMElist = context.value;
        console.log(NAMElist);
        const NAMETEXT = NAMElist.join(',');
        context.setFieldValue('名前2',NAMETEXT)
    });
})();
