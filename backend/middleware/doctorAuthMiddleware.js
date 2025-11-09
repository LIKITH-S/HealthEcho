const { authorize } = require('./rbacMiddleware');

const verifyDoctorRole = authorize('manage_patients');

module.exports = {
    verifyDoctorRole
};
