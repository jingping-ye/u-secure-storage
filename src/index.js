import CryptoJS from "crypto-js";
import AES from "crypto-js/aes";
import LZString from "lz-string/libs/lz-string";
import WordArray from "./WordArray";
import PBKDF2 from "crypto-js/pbkdf2";

class uSecureStorage {
  constructor() {
    this.uni = uni;
    this.cipherKey = "" || this.uni.getStorageSync("key");
  }

  // 获取数据
  get(key) {
    let data = "",
      deCompressData,
      decryptedData,
      jsonData;
    data = this.uni.getStorageSync(key);

    if (!data) {
      return data;
    }

    deCompressData = LZString.decompressFromUTF16(data);
    decryptedData = AES.decrypt(deCompressData, this.cipherKey).toString(CryptoJS.enc.Utf8);

    try {
      jsonData = JSON.parse(decryptedData);
    } catch (e) {
      throw new Error("无法解析JSON！");
    }

    return jsonData;
  }

  // 产生密匙
  generateCipherKey() {
    let salt = WordArray.random(128 / 8);
    let key128Bits = PBKDF2("36yiKsWEuHbGz@WH", salt, { keySize: 128 / 32 });
    return key128Bits && key128Bits.toString();
  }

  //  处理数据
  processData(data) {
    if (!data === null || data === undefined || data === "") {
      return "";
    }

    let jsonData, encodedData, compressedData;

    try {
      jsonData = JSON.stringify(data);
    } catch (e) {
      throw new Error("无法序列化JSON！");
    }

    // 加密数据
    encodedData = AES.encrypt(jsonData, this.cipherKey).toString();

    // 压缩数据
    compressedData = LZString.compressToUTF16(encodedData);

    return compressedData;
  }

  // 存数据
  set(key, value) {
    if (this.cipherKey.length === 0) {
      this.cipherKey = this.generateCipherKey();
      this.uni.setStorageSync("key", this.cipherKey);
    }
    const strData = this.processData(value);
    this.uni.setStorageSync(key, strData);
  }

  // 移除数据
  remove(key) {
    this.uni.removeStorageSync(key);
  }

  // 移除所有数据
  clear() {
    this.uni.clearStorageSync();
  }
}

export default uSecureStorage;
export { uSecureStorage };
