function removeDuplicates(str) {
  const map = {};
  let filtered = "";
  for (let i = 0; i < str.length; i += 1) {
    if (map[str[i]] === undefined) {
      map[str[i]] = true;
      filtered += str[i];
    }
  }
  return filtered;
}

/**
 * @param {string} keyword
 */
class Cipher {
  constructor(keyword) {
    if (!keyword) {
      return new Error("keyword required");
    }
    const uniqueKey = removeDuplicates(keyword.toLowerCase());
    const alphabet = "abcdefghijklmnopqrstuvwxyz";
    const regex = new RegExp(`[${uniqueKey}]`, "g");

    this.offset = 97;
    this.cipher = uniqueKey + alphabet.replace(regex, "");
    this.inverseCipher = alphabet.split("").map(char => String.fromCharCode(this.cipher.indexOf(char) + this.offset)).join("");
  }

  /**
   * @param {string} plaintext
   * @return {string} encrypted string
   */
  encipher(plaintext) {
    const lowerCase = plaintext.toLowerCase();
    let output = "";
    for (let i = 0; i < lowerCase.length; i += 1) {
      output += this.cipher.charAt(lowerCase.charCodeAt(i) - this.offset);
    }
    return output;
  }

  /**
   * @param {string} cipherText
   * @return {string} plaintext string
   */
  decipher(cipherText) {
    const lowerCase = cipherText.toLowerCase();
    let output = "";
    for (let i = 0; i < lowerCase.length; i += 1) {
      output += this.inverseCipher.charAt(lowerCase.charCodeAt(i) - this.offset);
    }
    return output;
  }
}

module.exports = Cipher;

const ciphertexts = [
  "aiqixwnusgnaqydem",
  "cvanobqmuvtmiv",
  "eruxoraxuyirigocemeru",
  "jqt",
  "jtisfkmsflkmitkfsba",
  "jybt",
  "kzvsyfmsvjimts",
  "njblgtmetagbngq",
  "pqylvrerzzecwutarq",
  "ufadocibobeq",
  "xniuaywjkjvtkrjqmnp",
  "ymupjmibjbpibdg",
  "DGGNIMLLGITCMLQ"
];

const cipher = new Cipher("fidelio");
ciphertexts.forEach((ciphertext) => {
  console.log(cipher.decipher(ciphertext));
});
// console.log(decipher("aiqixwnusgnaqydem", cipher));
