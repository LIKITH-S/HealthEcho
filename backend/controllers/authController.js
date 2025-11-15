const db = require('../config/db');
const { hashPassword, verifyPassword } = require('../security/passwordHashing');
const { generateAccessToken, generateRefreshToken } = require('../config/auth');
const { logAuditEvent } = require('../security/audit');
const logger = require('../utils/logger');
const { generateOTP } = require('../utils/helpers');
const { sendEmail } = require('../utils/notificationService');

// User Registration (Unified for doctor & patient)
const register = async (req, res) => {
    const client = await db.getConnection();

    try {
        const {
            email,
            password,
            role,
            first_name,
            last_name,
            phone_number,
            license_number, // For doctors
            specialization, // For doctors
            date_of_birth, // For patients
            blood_type // For patients
        } = req.body;

        // Check if user already exists
        const existingUser = await db.query(
            'SELECT id FROM users WHERE email = $1',
            [email]
        );

        if (existingUser.rows.length > 0) {
            await logAuditEvent(null, 'REGISTRATION_FAILED', 'user', null, 'failed', {
                reason: 'Email already exists'
            });
            return res.status(400).json({ error: 'Email already registered' });
        }

        // Hash password
        const hashedPassword = await hashPassword(password);

        // Start transaction
        await client.query('BEGIN');

        // Create user
        const userResult = await client.query(
            `INSERT INTO users (email, password_hash, role, first_name, last_name, phone_number, verification_token)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING id, email, role`,
            [email, hashedPassword, role, first_name, last_name, phone_number, generateOTP(20)]
        );

        const userId = userResult.rows[0].id;

        // Create role-specific profile
        if (role === 'doctor') {
            await client.query(
                `INSERT INTO doctors (user_id, license_number, specialization)
         VALUES ($1, $2, $3)`,
                [userId, license_number, specialization]
            );
        } else if (role === 'patient') {
            await client.query(
                `INSERT INTO patients (user_id, date_of_birth, blood_type)
         VALUES ($1, $2, $3)`,
                [userId, date_of_birth, blood_type]
            );
        }

        // Commit transaction
        await client.query('COMMIT');

        // Send verification email
        await sendEmail(
            email,
            'HealthEcho - Verify Your Email',
            `<p>Welcome to HealthEcho!</p><p>Please verify your email to complete registration.</p>`
        );

        await logAuditEvent(userId, 'USER_REGISTERED', 'user', userId, 'success', {
            role,
            email
        });

        logger.info('User registered successfully', { email, role });

        res.status(201).json({
            message: 'Registration successful',
            user: {
                id: userId,
                email,
                role
            }
        });

    } catch (error) {
        await client.query('ROLLBACK');
        logger.error('Registration failed', { error: error.message });
        res.status(500).json({ error: 'Registration failed' });
    } finally {
        client.release();
    }
};

// User Login (Unified for doctor & patient)
const login = async (req, res) => {
    try {
        const { email, password, role } = req.body;

        // Find user
        const userResult = await db.query(
            'SELECT id, email, password_hash, role, is_active FROM users WHERE email = $1 AND role = $2',
            [email, role]
        );

        if (userResult.rows.length === 0) {
            await logAuditEvent(null, 'LOGIN_FAILED', 'auth', null, 'failed', {
                reason: 'Invalid credentials',
                email,
                role
            });
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        const user = userResult.rows[0];

        // Check if account is active
        if (!user.is_active) {
            await logAuditEvent(user.id, 'LOGIN_FAILED', 'auth', user.id, 'failed', {
                reason: 'Account inactive'
            });
            return res.status(401).json({ error: 'Account is inactive' });
        }

        // Verify password
        const passwordValid = await verifyPassword(password, user.password_hash);
        if (!passwordValid) {
            await logAuditEvent(user.id, 'LOGIN_FAILED', 'auth', user.id, 'failed', {
                reason: 'Invalid password'
            });
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        // Generate tokens
        const accessToken = generateAccessToken(user.id, role);
        const refreshToken = generateRefreshToken(user.id);

        // Update last login
        await db.query(
            'UPDATE users SET last_login = NOW() WHERE id = $1',
            [user.id]
        );

        await logAuditEvent(user.id, 'LOGIN_SUCCESS', 'auth', user.id, 'success', {
            role
        });

        logger.info('User logged in successfully', { email, role });

        res.json({
            message: 'Login successful',
            tokens: {
                accessToken,
                refreshToken
            },
            user: {
                id: user.id,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {
        logger.error('Login failed', { error: error.message });
        res.status(500).json({ error: 'Login failed' });
    }
};

// Refresh Token
const refreshToken = async (req, res) => {
    try {
        const { refreshToken: token } = req.body;

        if (!token) {
            return res.status(400).json({ error: 'Refresh token required' });
        }

        // Verify refresh token
        const { verifyRefreshToken } = require('../config/auth');
        const decoded = verifyRefreshToken(token);

        // Get user role
        const userResult = await db.query(
            'SELECT role FROM users WHERE id = $1',
            [decoded.userId]
        );

        if (userResult.rows.length === 0) {
            return res.status(401).json({ error: 'User not found' });
        }

        const role = userResult.rows[0].role;
        const newAccessToken = generateAccessToken(decoded.userId, role);

        res.json({
            accessToken: newAccessToken,
            message: 'Token refreshed successfully'
        });

    } catch (error) {
        logger.error('Token refresh failed', { error: error.message });
        res.status(401).json({ error: 'Invalid refresh token' });
    }
};

// Logout
const logout = async (req, res) => {
    try {
        const userId = req.user.userId;

        await logAuditEvent(userId, 'LOGOUT', 'auth', userId, 'success');

        res.json({ message: 'Logged out successfully' });

    } catch (error) {
        logger.error('Logout failed', { error: error.message });
        res.status(500).json({ error: 'Logout failed' });
    }
};

// Change Password
const changePassword = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { currentPassword, newPassword } = req.body;

        // Get current password hash
        const userResult = await db.query(
            'SELECT password_hash FROM users WHERE id = $1',
            [userId]
        );

        if (userResult.rows.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        const { password_hash } = userResult.rows[0];

        // Verify current password
        const passwordValid = await verifyPassword(currentPassword, password_hash);
        if (!passwordValid) {
            await logAuditEvent(userId, 'PASSWORD_CHANGE_FAILED', 'user', userId, 'failed', {
                reason: 'Invalid current password'
            });
            return res.status(401).json({ error: 'Current password is incorrect' });
        }

        // Hash new password
        const newHashedPassword = await hashPassword(newPassword);

        // Update password
        await db.query(
            'UPDATE users SET password_hash = $1, updated_at = NOW() WHERE id = $2',
            [newHashedPassword, userId]
        );

        await logAuditEvent(userId, 'PASSWORD_CHANGED', 'user', userId, 'success');

        logger.info('Password changed successfully', { userId });

        res.json({ message: 'Password changed successfully' });

    } catch (error) {
        logger.error('Password change failed', { error: error.message });
        res.status(500).json({ error: 'Password change failed' });
    }
};

// Forgot Password
const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;

        const userResult = await db.query(
            'SELECT id FROM users WHERE email = $1',
            [email]
        );

        if (userResult.rows.length === 0) {
            // Don't reveal if email exists
            return res.json({ message: 'If email exists, reset link will be sent' });
        }

        const userId = userResult.rows[0].id;
        const resetToken = generateOTP(32);

        // Store reset token
        await db.query(
            `UPDATE users SET verification_token = $1, verification_token_expires_at = NOW() + INTERVAL '1 hour'
       WHERE id = $2`,
            [resetToken, userId]
        );

        // Send reset email
        await sendEmail(
            email,
            'HealthEcho - Reset Your Password',
            `<p>Click the link below to reset your password:</p><p><a href="${process.env.APP_URL}/reset-password?token=${resetToken}">Reset Password</a></p><p>This link expires in 1 hour.</p>`
        );

        await logAuditEvent(userId, 'PASSWORD_RESET_REQUESTED', 'auth', userId, 'success');

        res.json({ message: 'Password reset link sent to email' });

    } catch (error) {
        logger.error('Forgot password failed', { error: error.message });
        res.status(500).json({ error: 'Failed to process password reset' });
    }
};

module.exports = {
    register,
    login,
    refreshToken,
    logout,
    changePassword,
    forgotPassword
};
