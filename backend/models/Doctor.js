// This is a reference file for understanding Doctor data structure
// Actual database operations use queries in controllers

const DoctorSchema = {
    id: 'UUID',
    user_id: 'UUID (Foreign Key)',
    license_number: 'String (Unique)',
    specialization: 'String',
    hospital_name: 'String',
    hospital_location: 'String',
    hospital_phone: 'String',
    hospital_address: 'String',
    years_of_experience: 'Integer',
    bio: 'Text',
    availability_status: 'String',
    is_verified_doctor: 'Boolean',
    verification_date: 'Timestamp',
    created_at: 'Timestamp',
    updated_at: 'Timestamp'
};

module.exports = DoctorSchema;
