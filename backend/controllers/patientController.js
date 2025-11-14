const { Patient, User } = require('../models');
const logger = require('../utils/logger');

exports.getProfile = async (req, res) => {
    try {
        const userId = req.user?.userId || req.user?.id;

        const user = await User.findByPk(userId, {
            attributes: { exclude: ['password'] },
            include: [{ model: Patient }]
        });

        if (!user) {
            return res.status(404).json({ error: "Patient not found" });
        }

        res.status(200).json({ success: true, data: user });
    } catch (error) {
        logger.error(error);
        res.status(500).json({ error: "Unable to fetch profile" });
    }
};

exports.updateProfile = async (req, res) => {
    try {
        const userId = req.user?.userId || req.user?.id;

        // Allowed user fields to update
        const userFields = [
            'first_name',
            'last_name',
            'phone_number',
            'profile_picture_url',
            'is_verified',
            'is_active'
        ];

        // Allowed patient fields to update
        const patientFields = [
            'date_of_birth',
            'age',
            'gender',
            'blood_type',
            'emergency_contact_name',
            'emergency_contact_phone',
            'assigned_doctor_id',
            'medical_history',
            'allergies',
            'chronic_conditions',
            'encrypted_fields'
        ];

        const payload = req.body || {};

        const userUpdate = {};
        userFields.forEach((f) => {
            if (Object.prototype.hasOwnProperty.call(payload, f)) userUpdate[f] = payload[f];
        });

        const patientUpdate = {};
        patientFields.forEach((f) => {
            if (Object.prototype.hasOwnProperty.call(payload, f)) patientUpdate[f] = payload[f];
        });

        // Apply updates if any
        if (Object.keys(userUpdate).length > 0) {
            await User.update(userUpdate, { where: { id: userId } });
        }

        if (Object.keys(patientUpdate).length > 0) {
            await Patient.update(patientUpdate, { where: { user_id: userId } });
        }

        // Return refreshed user + patient
        const updated = await User.findByPk(userId, {
            attributes: { exclude: ['password'] },
            include: [{ model: Patient }]
        });

        res.json({ success: true, data: updated });
    } catch (error) {
        logger.error(error);
        res.status(500).json({ error: "Unable to update profile" });
    }
};

exports.getMe = async (req, res) => {
    try {
        const userId = req.user?.userId || req.user?.id;

        const user = await User.findByPk(userId, {
            attributes: { exclude: ['password'] }
        });

        if (!user) return res.status(404).json({ error: "Patient not found" });

        res.json({ success: true, data: user });
    } catch (error) {
        logger.error(error);
        res.status(500).json({ error: "Unable to fetch user info" });
    }
};
