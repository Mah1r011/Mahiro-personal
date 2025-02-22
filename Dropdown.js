(() => {
    'use strict';

    async function GetName() {
        const app = 'https://70d08775.viewer.kintoneapp.com/public/api/records/3658874fd666e86eefe812f30aa63307737457dca6193b03d688498e6a20e250/1';
        const res = await fetch(app);
        const data = await res.json();
        const names = data.records.map(record => record.名前.value);
        return names;
    };

    fb.events.form.mounted = [async function (state) {
        const Namelist = await GetName();
        console.log(Namelist)
        state.fields.find(({code}) => code === "名前").options = Namelist;
        // state.fields.find(({code}) => code === "複数選択").options = Namelist;
    }];


})();
