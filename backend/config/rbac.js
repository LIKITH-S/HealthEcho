const ROLES = {
    ADMIN: 'admin',
    DOCTOR: 'doctor',
    PATIENT: 'patient',
    NLP_SERVICE: 'nlp_service'
};

const PERMISSIONS = {
    admin: [
        'view_all_users',
        'manage_users',
        'view_all_reports',
        'delete_reports',
        'manage_roles',
        'access_audit_logs'
    ],
    doctor: [
        'view_own_profile',
        'view_patient_reports',
        'create_recommendations'
    ],
    patient: [
        'view_own_profile',
        'upload_reports',
        'view_own_reports',
        'chat_with_bot',
        'view_own_recommendations'
    ],
    nlp_service: [
        'process_reports',
        'extract_entities',
        'store_extracted_data'
    ]
};

const checkPermission = (role, permission) => {
    if (!PERMISSIONS[role]) return false;
    return PERMISSIONS[role].includes(permission);
};

module.exports = {
    ROLES,
    PERMISSIONS,
    checkPermission
};
