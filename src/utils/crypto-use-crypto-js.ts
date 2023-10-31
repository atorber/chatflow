import CryptoJS from 'crypto-js';

// 加密函数
export function encrypt(payload: string, keyBase64: string) {
  const key = CryptoJS.enc.Base64.parse(keyBase64);
  const iv = CryptoJS.lib.WordArray.random(16);  // 生成一个16字节的随机IV
  const encrypted = CryptoJS.AES.encrypt(payload, key, { iv: iv });
  return { data: encrypted.ciphertext.toString(CryptoJS.enc.Hex), iv: iv.toString(CryptoJS.enc.Hex) };
}

export interface DecryptedMessage {
  iv: string;
  data: string;
}

// 解密函数
export function decrypt(message: DecryptedMessage, keyBase64: string): any {
  const key = CryptoJS.enc.Base64.parse(keyBase64);
  const iv = CryptoJS.enc.Hex.parse(message.iv);
  const encryptedText = CryptoJS.enc.Hex.parse(message.data);
  const cipherParams = CryptoJS.lib.CipherParams.create({
    ciphertext: encryptedText,
  });
  const decrypted = CryptoJS.AES.decrypt(cipherParams, key, { iv: iv });
  return decrypted.toString(CryptoJS.enc.Utf8);
}

// 生成密钥
export function getKey() {
  return CryptoJS.lib.WordArray.random(32).toString(CryptoJS.enc.Base64);
}

// 使用基础字符串生成密钥
export function getKeyByBasicString(basicString: string) {
  const hash = CryptoJS.SHA256(basicString);
  return hash.toString(CryptoJS.enc.Base64);
}
