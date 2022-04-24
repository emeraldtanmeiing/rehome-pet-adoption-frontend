import CryptoJS from "crypto-js";

export const hash = (str) => {
  return CryptoJS.SHA256(str).toString(CryptoJS.enc.Hex);
};
