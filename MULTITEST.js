'use strict'; // 厳格モードを使用する
formBridge.events.on('form.field.change.複数選択', function (context) {

const NAMElist = context.value;
console.log(NAMElist);
const NAMETEXT = NAMElist.join(',');
context.setFieldValue('名前2',NAMETEXT)

});
