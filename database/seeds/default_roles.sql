-- Default system roles

INSERT INTO roles (role_name, description, permissions)
VALUES
('admin', 'Administrator with full access', 'all'),
('doctor', 'Medical professional with patient management access', 'patient_view,patient_edit,appointment_manage,prescription_create'),
('patient', 'Patient with personal health record access', 'personal_record_view,appointment_view,prescription_view'),
('nurse', 'Nursing staff with limited patient management', 'patient_view,vital_signs_record,appointment_assist'),
('pharmacist', 'Pharmacy staff managing prescriptions', 'prescription_view,prescription_fulfill,inventory_manage');