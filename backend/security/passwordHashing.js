const argon2 = require('argon2');

const hashPassword = async (password) => {
    try {
        const hashedPassword = await argon2.hash(password, {
            type: argon2.argon2id,
            memoryCost: 2 ** 16,
            timeCost: 3,
            parallelism: 1
        });
        return hashedPassword;
    } catch (error) {
        throw new Error(`Password hashing failed: ${error.message}`);
    }
};

const verifyPassword = async (password, hash) => {
    try {
        return await argon2.verify(hash, password);
    } catch (error) {
        throw new Error(`Password verification failed: ${error.message}`);
    }
};

module.exports = {
    hashPassword,
    verifyPassword
};
