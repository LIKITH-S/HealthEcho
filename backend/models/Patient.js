// Reference file for Patient data structure

const PatientSchema = {
    id: 'UUID',
    user_id: 'UUID (Foreign Key)',
    date_of_birth: 'Date',
    gender: 'String',
    blood_type: 'String',
    emergency_contact_name: 'String',
    emergency_contact_phone: 'String',
    assigned_doctor_id: 'UUID (Foreign Key)',
    medical_history: 'Text',
    allergies: 'Text',
    chronic_conditions: 'Text',
    created_at: 'Timestamp',
    updated_at: 'Timestamp'
};

module.exports = PatientSchema;
