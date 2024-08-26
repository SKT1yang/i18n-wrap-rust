import { JSEncrypt } from '@guolisec/jsencrypt';

/**
 * 密码加密
 * @param src 明文
 * @param key 密钥
 * @constructor
 */
function encrypt(key: string, src: string) {
  //RSA非对称加密
  const encryptor = new JSEncrypt();
  encryptor.setPublicKey(key);
  const result = encryptor.encrypt(src);
  return result === false ? '' : result;
}

function decrypt(privateKey: string, encryptedPassword: string) {
  const decryptor = new JSEncrypt();
  decryptor.setPrivateKey(privateKey);
  return decryptor.decrypt(encryptedPassword);
}

export { encrypt, decrypt };
