// backend/src/utils/passwordUtils.js
const bcrypt = require('bcrypt');
const saltRounds = 10; 

/**
 * Mengenkripsi password menggunakan bcrypt.
 */
const hashPassword = async (password) => {
  return await bcrypt.hash(password, saltRounds);
};

/**
 * Membandingkan password plain-text dengan password hash yang tersimpan.
 * @param {string} plainPassword - Password dari input form
 * @param {string} hash - Password hash dari database
 * @returns {Promise<boolean>} - True jika cocok
 */
const comparePassword = async (plainPassword, hash) => {
  return await bcrypt.compare(plainPassword, hash);
};

module.exports = {
  hashPassword,
  comparePassword,
};