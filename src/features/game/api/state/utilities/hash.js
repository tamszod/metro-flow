const CryptoJS = require('crypto-js');

export const hashObject = (obj) => {
  const jsonString = JSON.stringify(obj);
  const hash = CryptoJS.SHA256(jsonString);
  return hash.toString(CryptoJS.enc.Hex);
}