const db = require('../config/db');
const bcrypt = require("bcrypt");
const { logAuditEvent } = require('../security/audit');
const { triggerEmergencyAlert } = require('../utils/emergencyAlertService');
const logger = require('../utils/logger');
const { User, Patient, user } = require("../models");

// Get doctor's profile
const getDoctorProfile = async (req, res) => {
    try {
        const userId = req.user.userId;

        const result = await db.query(
            `SELECT u.id, u.email, u.first_name, u.last_name, u.phone_number,
              d.license_number, d.specialization, d.hospital_name, d.hospital_location,
              d.years_of_experience, d.bio, d.is_verified_doctor
       FROM users u
       JOIN doctors d ON u.id = d.user_id
       WHERE u.id = $1`,
            [userId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Doctor profile not found' });
        }

        res.json(result.rows[0]);

    } catch (error) {
        logger.error('Failed to get doctor profile', { error: error.message });
        res.status(500).json({ error: 'Failed to fetch profile' });
    }
};

// Update doctor profile
const updateDoctorProfile = async (req, res) => {
    try {
        const userId = req.user.userId;
        const {
            specialization,
            hospital_name,
            hospital_location,
            hospital_phone,
            hospital_address,
            years_of_experience,
            bio,
            availability_status
        } = req.body;

        await db.query(
            `UPDATE doctors 
       SET specialization = COALESCE($1, specialization),
           hospital_name = COALESCE($2, hospital_name),
           hospital_location = COALESCE($3, hospital_location),
           hospital_phone = COALESCE($4, hospital_phone),
           hospital_address = COALESCE($5, hospital_address),
           years_of_experience = COALESCE($6, years_of_experience),
           bio = COALESCE($7, bio),
           availability_status = COALESCE($8, availability_status),
           updated_at = NOW()
       WHERE user_id = $9`,
            [
                specialization, hospital_name, hospital_location, hospital_phone,
                hospital_address, years_of_experience, bio, availability_status, userId
            ]
        );

        await logAuditEvent(userId, 'DOCTOR_PROFILE_UPDATED', 'doctor', userId, 'success');

        res.json({ message: 'Profile updated successfully' });

    } catch (error) {
        logger.error('Failed to update doctor profile', { error: error.message });
        res.status(500).json({ error: 'Failed to update profile' });
    }
};

// Get doctor's assigned patients
const getAssignedPatients = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { page = 1, limit = 10 } = req.query;
        const offset = (page - 1) * limit;

        const result = await db.query(
            `SELECT p.id, u.first_name, u.last_name, u.email, u.phone_number,
              p.date_of_birth, p.blood_type, p.medical_history
       FROM patients p
       JOIN users u ON p.user_id = u.id
       JOIN doctor_patient_relationships dpr ON p.id = dpr.patient_id
       JOIN doctors d ON dpr.doctor_id = d.id
       WHERE d.user_id = $1 AND dpr.is_active = TRUE
       LIMIT $2 OFFSET $3`,
            [userId, limit, offset]
        );

        const countResult = await db.query(
            `SELECT COUNT(*) as total
       FROM patients p
       JOIN doctor_patient_relationships dpr ON p.id = dpr.patient_id
       JOIN doctors d ON dpr.doctor_id = d.id
       WHERE d.user_id = $1 AND dpr.is_active = TRUE`,
            [userId]
        );

        res.json({
            patients: result.rows,
            pagination: {
                page,
                limit,
                total: parseInt(countResult.rows[0].total)
            }
        });

    } catch (error) {
        logger.error('Failed to fetch assigned patients', { error: error.message });
        res.status(500).json({ error: 'Failed to fetch patients' });
    }
};

// Add or update patient details
const addPatientDetails = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { patient_id, diagnoses, medications, clinical_notes } = req.body;

        // Verify doctor has access to this patient
        const accessCheck = await db.query(
            `SELECT 1 FROM doctor_patient_relationships dpr
       JOIN doctors d ON dpr.doctor_id = d.id
       JOIN patients p ON dpr.patient_id = p.id
       WHERE d.user_id = $1 AND p.id = $2 AND dpr.is_active = TRUE`,
            [userId, patient_id]
        );

        if (accessCheck.rows.length === 0) {
            await logAuditEvent(userId, 'UNAUTHORIZED_PATIENT_ACCESS', 'patient', patient_id, 'failed');
            return res.status(403).json({ error: 'Access denied to this patient' });
        }

        // Update or create extracted data
        await db.query(
            `INSERT INTO extracted_data (report_id, patient_id, diagnoses, medications, clinical_notes, is_verified, verified_by_id, verified_at)
       VALUES (NULL, $1, $2, $3, $4, TRUE, $5, NOW())
       ON CONFLICT (patient_id) DO UPDATE SET
         diagnoses = COALESCE($2, diagnoses),
         medications = COALESCE($3, medications),
         clinical_notes = COALESCE($4, clinical_notes),
         is_verified = TRUE,
         verified_by_id = $5,
         verified_at = NOW()`,
            [patient_id, diagnoses, medications, clinical_notes, userId]
        );

        await logAuditEvent(userId, 'PATIENT_DETAILS_ADDED', 'patient', patient_id, 'success');

        logger.info('Patient details added/updated', { patient_id, doctor: userId });

        res.json({ message: 'Patient details updated successfully' });

    } catch (error) {
        logger.error('Failed to add patient details', { error: error.message });
        res.status(500).json({ error: 'Failed to update patient details' });
    }
};

// Upload report for patient
const uploadReportForPatient = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { patient_id } = req.body;
        const file = req.file;

        if (!file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        // Verify doctor access to patient
        const accessCheck = await db.query(
            `SELECT 1 FROM doctor_patient_relationships dpr
       JOIN doctors d ON dpr.doctor_id = d.id
       WHERE d.user_id = $1 AND dpr.patient_id = $2 AND dpr.is_active = TRUE`,
            [userId, patient_id]
        );

        if (accessCheck.rows.length === 0) {
            return res.status(403).json({ error: 'Access denied' });
        }

        // Create report record
        const result = await db.query(
            `INSERT INTO medical_reports (patient_id, uploaded_by_id, file_name, file_path, file_size, mime_type, status)
       VALUES ($1, $2, $3, $4, $5, $6, 'pending')
       RETURNING id`,
            [patient_id, userId, file.filename, file.path, file.size, file.mimetype]
        );

        await logAuditEvent(userId, 'REPORT_UPLOADED', 'report', result.rows[0].id, 'success', {
            patient_id,
            file_name: file.filename
        });

        res.json({
            message: 'Report uploaded successfully',
            report_id: result.rows[0].id
        });

    } catch (error) {
        logger.error('Failed to upload report', { error: error.message });
        res.status(500).json({ error: 'Failed to upload report' });
    }
};

// Trigger Emergency SOS
const triggerEmergencySOS = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { patient_id, trigger_reason, hospital_location } = req.body;

        // Verify doctor access
        const accessCheck = await db.query(
            `SELECT 1 FROM doctor_patient_relationships dpr
       JOIN doctors d ON dpr.doctor_id = d.id
       WHERE d.user_id = $1 AND dpr.patient_id = $2 AND dpr.is_active = TRUE`,
            [userId, patient_id]
        );

        if (accessCheck.rows.length === 0) {
            return res.status(403).json({ error: 'Access denied to this patient' });
        }

        // Create SOS log
        const sosResult = await db.query(
            `INSERT INTO emergency_sos_logs (patient_id, triggered_by_id, trigger_reason, hospital_location, alert_message)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id`,
            [
                patient_id,
                userId,
                trigger_reason,
                hospital_location,
                `Emergency triggered by doctor. Reason: ${trigger_reason}`
            ]
        );

        const sosLogId = sosResult.rows[0].id;

        // Trigger emergency alerts to contacts
        const alertResult = await triggerEmergencyAlert(patient_id, sosLogId, hospital_location);

        await logAuditEvent(userId, 'EMERGENCY_SOS_TRIGGERED', 'patient', patient_id, 'success', {
            sos_log_id: sosLogId,
            contacts_notified: alertResult.notificationsSent
        });

        logger.info('Emergency SOS triggered', { patient_id, doctor: userId, sosLogId });

        res.json({
            message: 'Emergency alert triggered successfully',
            sos_log_id: sosLogId,
            contacts_notified: alertResult.notificationsSent
        });

    } catch (error) {
        logger.error('Failed to trigger emergency SOS', { error: error.message });
        res.status(500).json({ error: 'Failed to trigger emergency' });
    }
};
exports.createPatient = async (req, res) => {
    try {
        // derive logged-in user's id from token payload
        const userIdFromToken = req.user?.userId || req.user?.id;

        // find doctor's internal id from doctors table
        const doctorRow = await db.query(`SELECT id FROM doctors WHERE user_id = $1`, [userIdFromToken]);
        if (doctorRow.rows.length === 0) {
            return res.status(403).json({ error: 'Doctor profile not found for authenticated user' });
        }
        const doctorId = doctorRow.rows[0].id;
        const {
            first_name,
            last_name,
            email,
            phone_number,
            blood_type,
            password
        } = req.body;

        // 1. Create user
        const hashed = await bcrypt.hash(password, 10);
        const userResult = await db.query(
            `INSERT INTO users (email, password_hash, role, first_name, last_name, is_verified, is_active)
       VALUES ($1,$2,'patient',$3,$4,true,true)
       RETURNING id`,
            [email, hashed, first_name, last_name]
        );

        const userId = userResult.rows[0].id;

        // 2. Create patient profile
        const patientResult = await db.query(
            `INSERT INTO patients (user_id, phone_number, blood_type)
       VALUES ($1,$2,$3)
       RETURNING id`,
            [userId, phone_number, blood_type]
        );

        const patientId = patientResult.rows[0].id;

        // 3. Assign patient to doctor
        await db.query(
            `INSERT INTO doctor_patient_relationships (doctor_id, patient_id)
       VALUES ($1,$2)`,
            [doctorId, patientId]
        );

        res.json({ success: true, patient_id: patientId });

    } catch (err) {
        console.error("Create patient error:", err);
        res.status(400).json({ error: err.message || "Failed to create patient" });
    }
};


exports.addExistingPatient = async (req, res) => {
    try {
        const { email } = req.body;
        // derive logged-in user's id from token payload
        const userIdFromToken = req.user?.userId || req.user?.id;

        // resolve doctor internal id from doctors table
        const doctorRow = await db.query(`SELECT id FROM doctors WHERE user_id = $1`, [userIdFromToken]);
        if (doctorRow.rows.length === 0) {
            return res.status(403).json({ error: 'Doctor profile not found for authenticated user' });
        }
        const doctor_id = doctorRow.rows[0].id;

        // 1. Check if user exists and is patient
        const user = await db.query(
            `SELECT id, role FROM users WHERE email = $1`,
            [email]
        );

        if (user.rows.length === 0 || user.rows[0].role !== 'patient') {
            return res.status(404).json({ error: "Patient not found" });
        }

        const user_id = user.rows[0].id;

        // 2. Get patient table ID
        const patient = await db.query(
            `SELECT id FROM patients WHERE user_id = $1`,
            [user_id]
        );

        if (patient.rows.length === 0) {
            return res.status(404).json({ error: "Patient profile does not exist" });
        }

        const patient_id = patient.rows[0].id;

        // 3. Check if already linked
        const exists = await db.query(
            `SELECT id FROM doctor_patient_relationships WHERE doctor_id = $1 AND patient_id = $2`,
            [doctor_id, patient_id]
        );

        if (exists.rows.length > 0) {
            return res.status(400).json({ error: "Patient already linked to doctor" });
        }

        // 4. Insert new relationship
        await db.query(
            `INSERT INTO doctor_patient_relationships (doctor_id, patient_id, created_at)
             VALUES ($1, $2, NOW())`,
            [doctor_id, patient_id]
        );

        return res.json({ message: "Patient added to doctor's list successfully" });

    } catch (err) {
        console.error("Add Existing Patient Error:", err);
        return res.status(500).json({ error: "Internal server error" });
    }
};



// Get emergency SOS history
const getSOSHistory = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { patient_id, page = 1, limit = 10 } = req.query;
        const offset = (page - 1) * limit;

        let query = `SELECT esl.* FROM emergency_sos_logs esl
                 WHERE esl.triggered_by_id = $1`;
        let params = [userId];

        if (patient_id) {
            query += ` AND esl.patient_id = $2`;
            params.push(patient_id);
        }

        query += ` ORDER BY esl.triggered_at DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
        params.push(limit, offset);

        const result = await db.query(query, params);

        res.json({
            sos_events: result.rows,
            pagination: { page, limit, total: result.rows.length }
        });

    } catch (error) {
        logger.error('Failed to fetch SOS history', { error: error.message });
        res.status(500).json({ error: 'Failed to fetch SOS history' });
    }
};

module.exports = {
    getDoctorProfile,
    updateDoctorProfile,
    getAssignedPatients,
    addPatientDetails,
    uploadReportForPatient,
    triggerEmergencySOS,
    getSOSHistory,
    createPatient: exports.createPatient,
    addExistingPatient: exports.addExistingPatient
};
