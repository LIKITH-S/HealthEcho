-- Add additional indexes for better query performance
CREATE INDEX idx_users_created_at ON users(created_at);
CREATE INDEX idx_users_is_active ON users(is_active);
CREATE INDEX idx_medical_reports_created_at ON medical_reports(created_at);
CREATE INDEX idx_extracted_data_created_at ON extracted_data(created_at);
CREATE INDEX idx_recommendations_created_at ON recommendations(created_at);
CREATE INDEX idx_audit_logs_resource ON audit_logs(resource_type, resource_id);

-- Composite indexes for common queries
CREATE INDEX idx_patient_doctor ON patients(user_id, assigned_doctor_id);
CREATE INDEX idx_report_patient_status ON medical_reports(patient_id, status);
CREATE INDEX idx_recommendation_patient_type ON recommendations(patient_id, recommendation_type);
