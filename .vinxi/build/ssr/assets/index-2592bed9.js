import r from"axios";const t=r.create();t.interceptors.response.use(e=>e,e=>Promise.reject(e));export{t as r};
