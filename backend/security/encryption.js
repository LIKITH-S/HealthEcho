const crypto = require('crypto');

// Simple wrapper to reuse encryption logic (placeholder)
const ENCRYPTION_ALGO = 'aes-256-cbc';
const IV_LENGTH = 16;

function encrypt(text, keyHex){
  if (!text) return null;
  const key = Buffer.from(keyHex, 'hex');
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(ENCRYPTION_ALGO, key, iv);
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return iv.toString('hex') + ':' + encrypted;
}

function decrypt(data, keyHex){
  if (!data) return null;
  const parts = data.split(':');
  const iv = Buffer.from(parts.shift(), 'hex');
  const encryptedText = parts.join(':');
  const key = Buffer.from(keyHex, 'hex');
  const decipher = crypto.createDecipheriv(ENCRYPTION_ALGO, key, iv);
  let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}

module.exports = { encrypt, decrypt };
