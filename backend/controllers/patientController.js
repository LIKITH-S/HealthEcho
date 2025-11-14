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
        const { first_name, last_name, age, gender, address } = req.body;

        await User.update({ first_name, last_name }, { where: { id: userId } });
        await Patient.update({ age, gender, address }, { where: { user_id: userId } });

        res.json({ success: true, message: "Profile updated successfully" });
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
