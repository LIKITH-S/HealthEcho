const db = require('../config/db');
const { logAuditEvent } = require('../security/audit');
const logger = require('../utils/logger');
const { extractTextFromPDF, validatePDFContent } = require('../utils/pdfParser');
const axios = require('axios');

// Upload medical report (patient or doctor)
const uploadReport = async (req, res) => {
    try {
        const userId = req.user.userId;
        const role = req.user.role;
        const file = req.file;
        const { patient_id } = req.body;

        if (!file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        // Determine actual patient ID
        let actualPatientId = patient_id;

        if (role === 'patient') {
            // Patient uploading for themselves
            const patientResult = await db.query(
                'SELECT id FROM patients WHERE user_id = $1',
                [userId]
            );
            actualPatientId = patientResult.rows[0].id;
        }

        // Create report record
        const result = await db.query(
            `INSERT INTO medical_reports (patient_id, uploaded_by_id, file_name, file_path, file_size, mime_type, status)
       VALUES ($1, $2, $3, $4, $5, $6, 'pending')
       RETURNING id`,
            [actualPatientId, userId, file.filename, file.path, file.size, file.mimetype]
        );

        const reportId = result.rows[0].id;

        // Extract text from PDF
        try {
            const extractedText = await extractTextFromPDF(file.path);
            const validation = validatePDFContent(extractedText);

            // Send to NLP service for processing
            if (validation.isValid) {
                await axios.post(`${process.env.NLP_SERVICE_URL}/api/extract`, {
                    report_id: reportId,
                    text: extractedText
                });

                await db.query(
                    `UPDATE medical_reports SET status = 'processing', processing_start_time = NOW() WHERE id = $1`,
                    [reportId]
                );
            }
        } catch (error) {
            logger.error('PDF extraction failed', { reportId, error: error.message });
        }

        await logAuditEvent(userId, 'REPORT_UPLOADED', 'report', reportId, 'success', {
            patient_id: actualPatientId,
            file_name: file.filename
        });

        res.json({
            message: 'Report uploaded successfully',
            report_id: reportId,
            status: 'processing'
        });

    } catch (error) {
        logger.error('Failed to upload report', { error: error.message });
        res.status(500).json({ error: 'Failed to upload report' });
    }
};

// Get patient reports
const getPatientReports = async (req, res) => {
    try {
        const userId = req.user.userId;
        const role = req.user.role;
        const { patient_id, page = 1, limit = 10 } = req.query;
        const offset = (page - 1) * limit;

        let queryPatientId = patient_id;

        // If patient, get their own reports
        if (role === 'patient') {
            const patientResult = await db.query(
                'SELECT id FROM patients WHERE user_id = $1',
                [userId]
            );
            queryPatientId = patientResult.rows[0].id;
        }

        const result = await db.query(
            `SELECT mr.*, u.first_name || ' ' || u.last_name as uploaded_by
       FROM medical_reports mr
       JOIN users u ON mr.uploaded_by_id = u.id
       WHERE mr.patient_id = $1
       ORDER BY mr.upload_date DESC
       LIMIT $2 OFFSET $3`,
            [queryPatientId, limit, offset]
        );

        res.json({
            reports: result.rows,
            pagination: { page, limit, total: result.rows.length }
        });

    } catch (error) {
        logger.error('Failed to fetch reports', { error: error.message });
        res.status(500).json({ error: 'Failed to fetch reports' });
    }
};

// Get report details with extracted data
const getReportDetails = async (req, res) => {
    try {
        const { report_id } = req.params;

        const result = await db.query(
            `SELECT mr.*, ed.diagnoses, ed.medications, ed.dosages, ed.test_results, ed.vital_signs, ed.clinical_notes
       FROM medical_reports mr
       LEFT JOIN extracted_data ed ON mr.id = ed.report_id
       WHERE mr.id = $1`,
            [report_id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Report not found' });
        }

        res.json(result.rows[0]);

    } catch (error) {
        logger.error('Failed to fetch report details', { error: error.message });
        res.status(500).json({ error: 'Failed to fetch report details' });
    }
};

// Delete report
const deleteReport = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { report_id } = req.params;

        const result = await db.query(
            'DELETE FROM medical_reports WHERE id = $1 AND uploaded_by_id = $2 RETURNING id',
            [report_id, userId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Report not found or unauthorized' });
        }

        await logAuditEvent(userId, 'REPORT_DELETED', 'report', report_id, 'success');

        res.json({ message: 'Report deleted successfully' });

    } catch (error) {
        logger.error('Failed to delete report', { error: error.message });
        res.status(500).json({ error: 'Failed to delete report' });
    }
};

module.exports = {
    uploadReport,
    getPatientReports,
    getReportDetails,
    deleteReport
};
