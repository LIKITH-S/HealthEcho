const { Patient, User } = require('../models');
const logger = require('../utils/logger');
const db = require('../config/db');

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

        // Log incoming payload for debugging
        logger.info('updateProfile called', { userId, payloadPreview: req.body ? Object.keys(req.body) : null });

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

        // map common frontend field names to DB columns
        // phone -> phone_number
        if (payload.phone && !payload.phone_number) {
            payload.phone_number = payload.phone
        }

        // date picker may send dd-mm-yyyy, convert to ISO yyyy-mm-dd
        if (payload.date_of_birth) {
            const dob = payload.date_of_birth
            // accept formats like dd-mm-yyyy or yyyy-mm-dd
            if (/^\d{2}-\d{2}-\d{4}$/.test(dob)) {
                const [d, m, y] = dob.split('-')
                payload.date_of_birth = `${y}-${m.padStart(2, '0')}-${d.padStart(2, '0')}`
            }
        } else if (payload.dob) {
            const dob = payload.dob
            if (/^\d{2}-\d{2}-\d{4}$/.test(dob)) {
                const [d, m, y] = dob.split('-')
                payload.date_of_birth = `${y}-${m.padStart(2, '0')}-${d.padStart(2, '0')}`
            } else {
                payload.date_of_birth = payload.dob
            }
        }

        // blood group field mapping
        if (payload.blood_group && !payload.blood_type) {
            payload.blood_type = payload.blood_group
        }

        // map insurance_provider into encrypted_fields JSON (merge with existing)
        if (payload.insurance_provider) {
            try {
                // ensure column exists before querying (protects older DBs without column)
                const colCheck = await db.query(`SELECT 1 FROM information_schema.columns WHERE table_name = 'patients' AND column_name = 'encrypted_fields' LIMIT 1`)
                if (colCheck.rows.length > 0) {
                    const res = await db.query('SELECT encrypted_fields FROM patients WHERE user_id = $1', [userId])
                    const existing = res.rows[0]?.encrypted_fields ? res.rows[0].encrypted_fields : null
                    let parsed = {}
                    if (existing) {
                        try { parsed = typeof existing === 'string' ? JSON.parse(existing) : existing } catch (e) { parsed = {} }
                    }
                    parsed.insurance_provider = payload.insurance_provider
                    // store as an object so pg can send it as JSON/JSONB param
                    payload.encrypted_fields = parsed
                } else {
                    // column doesn't exist yet; store as object so later migration can pick it up
                    payload.encrypted_fields = { insurance_provider: payload.insurance_provider }
                }
            } catch (err) {
                // if anything goes wrong reading DB, fall back to simple object
                logger.error('Failed to merge encrypted_fields', { userId, error: err.message, stack: err.stack });
                payload.encrypted_fields = { insurance_provider: payload.insurance_provider }
            }
        }

        const userUpdate = {};
        userFields.forEach((f) => {
            if (Object.prototype.hasOwnProperty.call(payload, f)) userUpdate[f] = payload[f];
        });

        const patientUpdate = {};
        patientFields.forEach((f) => {
            if (Object.prototype.hasOwnProperty.call(payload, f)) patientUpdate[f] = payload[f];
        });

        // Log computed updates for debugging
        logger.info('Computed profile updates', { userId, userUpdateKeys: Object.keys(userUpdate), patientUpdateKeys: Object.keys(patientUpdate) });

        // Log patient column types for updated keys to help debug type mismatches
        if (Object.keys(patientUpdate).length > 0) {
            try {
                const cols = Object.keys(patientUpdate);
                const q = `SELECT column_name, data_type, udt_name FROM information_schema.columns WHERE table_name = 'patients' AND column_name = ANY($1)`
                const colInfo = await db.query(q, [cols]);
                logger.debug('Patient update column info', { userId, colInfo: colInfo.rows });
            } catch (err) {
                logger.debug('Failed to fetch column info for patients', { userId, err: err.message });
            }
        }

        // Apply updates if any
        if (Object.keys(userUpdate).length > 0) {
            try {
                await User.update(userUpdate, { where: { id: userId } });
            } catch (err) {
                logger.error('User.update failed', { userId, userUpdate, message: err.message, stack: err.stack });
                throw err;
            }
        }

        if (Object.keys(patientUpdate).length > 0) {
            try {
                await Patient.update(patientUpdate, { where: { user_id: userId } });
            } catch (err) {
                logger.error('Patient.update failed', { userId, patientUpdate, message: err.message, stack: err.stack });
                throw err;
            }
        }

        // Return refreshed user + patient
        const updated = await User.findByPk(userId, {
            attributes: { exclude: ['password'] },
            include: [{ model: Patient }]
        });

        res.json({ success: true, data: updated });
    } catch (error) {
        // log full error and stack for debugging
        logger.error('updateProfile failed', { message: error.message, stack: error.stack });
        // return stack trace in development to make debugging faster
        const resp = { error: "Unable to update profile" }
        if (process.env.NODE_ENV === 'development') resp.details = error.stack
        res.status(500).json(resp)
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
