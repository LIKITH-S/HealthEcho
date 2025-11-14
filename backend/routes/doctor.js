const express = require('express');
const router = express.Router();

const doctorController = require('../controllers/doctorController');
const { authenticate } = require('../middleware/auth');
const doctorAuth = require("../middleware/doctorAuthMiddleware");
const { authorize } = require('../middleware/rbacMiddleware');
const { upload } = require('../utils/fileHandler');
const {
    validateAddPatientDetails,
    validateEmergencySOS,
    handleValidationErrors
} = require('../middleware/validation');
const { sosLimiter } = require('../middleware/rateLimiter');

// All doctor routes require authentication + role
router.use(authenticate);
router.use(authorize('manage_patients'));

// Profile
router.get('/profile', doctorController.getDoctorProfile);
router.put('/profile', doctorController.updateDoctorProfile);

// Patient management
router.get('/patients', doctorController.getAssignedPatients);
router.post('/create-patient', doctorAuth, doctorController.createPatient);
router.post('/add-existing-patient', doctorAuth, doctorController.addExistingPatient);
router.post('/patient-details',
    validateAddPatientDetails,
    handleValidationErrors,
    doctorController.addPatientDetails
);

router.post(
    '/upload-report',
    upload.single('report'),
    doctorController.uploadReportForPatient
);

// Emergency
router.post(
    '/emergency-sos',
    sosLimiter,
    validateEmergencySOS,
    handleValidationErrors,
    doctorController.triggerEmergencySOS
);

router.get('/sos-history', doctorController.getSOSHistory);

module.exports = router;
