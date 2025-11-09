const { body, param, query, validationResult } = require('express-validator');

// Validation rules for authentication
const validateSignup = [
    body('email')
        .isEmail()
        .normalizeEmail()
        .withMessage('Invalid email address'),
    body('password')
        .isLength({ min: 8 })
        .withMessage('Password must be at least 8 characters')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
        .withMessage('Password must contain uppercase, lowercase, number, and special character'),
    body('role')
        .isIn(['patient', 'doctor'])
        .withMessage('Role must be patient or doctor'),
    body('first_name')
        .trim()
        .notEmpty()
        .withMessage('First name is required'),
    body('last_name')
        .trim()
        .notEmpty()
        .withMessage('Last name is required')
];

const validateLogin = [
    body('email')
        .isEmail()
        .normalizeEmail()
        .withMessage('Invalid email address'),
    body('password')
        .notEmpty()
        .withMessage('Password is required'),
    body('role')
        .isIn(['patient', 'doctor'])
        .withMessage('Role must be patient or doctor')
];

// Validation for medical report upload
const validateReportUpload = [
    body('patient_id')
        .isUUID()
        .withMessage('Invalid patient ID'),
    param('report_id')
        .optional()
        .isUUID()
        .withMessage('Invalid report ID')
];

// Validation for doctor patient management
const validateAddPatientDetails = [
    body('patient_id')
        .isUUID()
        .withMessage('Invalid patient ID'),
    body('diagnoses')
        .optional()
        .isArray()
        .withMessage('Diagnoses must be an array'),
    body('medications')
        .optional()
        .isArray()
        .withMessage('Medications must be an array'),
    body('clinical_notes')
        .optional()
        .trim()
        .isLength({ max: 2000 })
        .withMessage('Clinical notes cannot exceed 2000 characters')
];

// Validation for emergency SOS
const validateEmergencySOS = [
    body('patient_id')
        .isUUID()
        .withMessage('Invalid patient ID'),
    body('trigger_reason')
        .trim()
        .notEmpty()
        .withMessage('Trigger reason is required'),
    body('hospital_location')
        .optional()
        .trim()
        .isLength({ max: 500 })
        .withMessage('Location cannot exceed 500 characters')
];

// Validation for medication reminders
const validateMedicationReminder = [
    body('medication_name')
        .trim()
        .notEmpty()
        .withMessage('Medication name is required'),
    body('dosage')
        .trim()
        .notEmpty()
        .withMessage('Dosage is required'),
    body('frequency')
        .isIn(['once', 'daily', 'weekly', 'monthly'])
        .withMessage('Invalid frequency'),
    body('start_date')
        .isISO8601()
        .withMessage('Invalid start date'),
    body('reminder_method')
        .isIn(['sms', 'email', 'push', 'in_app'])
        .withMessage('Invalid reminder method')
];

// Validation for mental health assessment
const validateMentalHealthAssessment = [
    body('assessment_type')
        .isIn(['PHQ9', 'GAD7', 'DASS21'])
        .withMessage('Invalid assessment type'),
    body('scores')
        .isObject()
        .withMessage('Scores must be an object'),
    body('total_score')
        .isInt({ min: 0 })
        .withMessage('Total score must be a non-negative integer')
];

// Validation for drug interaction check
const validateDrugCheck = [
    body('medication_list')
        .isArray()
        .withMessage('Medication list must be an array'),
    body('medication_list.*')
        .trim()
        .notEmpty()
        .withMessage('Each medication must have a name')
];

// Middleware to handle validation errors
const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            error: 'Validation failed',
            details: errors.array()
        });
    }
    next();
};

module.exports = {
    validateSignup,
    validateLogin,
    validateReportUpload,
    validateAddPatientDetails,
    validateEmergencySOS,
    validateMedicationReminder,
    validateMentalHealthAssessment,
    validateDrugCheck,
    handleValidationErrors
};
