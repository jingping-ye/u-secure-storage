# u-secure-storage

uni-app 安全存储工具(vuex)

## 使用指南

> 假设存储持久化数据为 token 和 userInfo

```js
// store/index.js
import Vue from "vue";
import Vuex from "vuex";
import createPersistedState from "vuex-persistedstate";
import USecureStorage from "u-secure-storage";
const uSecureStorage = new USecureStorage();

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    userInfo: {},
    token: "",
  },
  mutations: {
    setToken(state, val) {
      state.token = val;
    },
    setUserInfo(state, val) {
      state.userInfo = val;
    },
  },
  actions: {},
  modules: {},
  plugins: [
    createPersistedState({
      storage: {
        getItem: (key) => uSecureStorage.get(key),
        setItem: (key, value) => uSecureStorage.set(key, value),
        removeItem: (key) => uSecureStorage.remove(key),
      },
      paths: ["userInfo", "token"],
    }),
  ],
});
```

## Q-A

- 使用的加密方式

使用的是`crypto-js`中的 AES 加密，同时使用了压缩。
