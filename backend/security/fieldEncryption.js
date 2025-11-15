const { encrypt, decrypt } = require('../config/encryption');

const SENSITIVE_FIELDS = [
    'health_data',
    'diagnoses',
    'medications',
    'test_results',
    'personal_notes'
];

const encryptFields = (data, fieldsToEncrypt = SENSITIVE_FIELDS) => {
    const encrypted = { ...data };

    fieldsToEncrypt.forEach(field => {
        if (encrypted[field]) {
            encrypted[field] = encrypt(encrypted[field]);
        }
    });

    return encrypted;
};

const decryptFields = (data, fieldsToDecode = SENSITIVE_FIELDS) => {
    const decrypted = { ...data };

    fieldsToDecode.forEach(field => {
        if (decrypted[field]) {
            decrypted[field] = decrypt(decrypted[field]);
        }
    });

    return decrypted;
};

module.exports = {
    encryptFields,
    decryptFields,
    SENSITIVE_FIELDS
};
