-- Create ENUM types
CREATE TYPE user_role AS ENUM ('patient', 'doctor', 'admin', 'nlp_service');
CREATE TYPE report_status AS ENUM ('pending', 'processing', 'completed', 'failed');
CREATE TYPE reminder_frequency AS ENUM ('once', 'daily', 'weekly', 'monthly');
CREATE TYPE emergency_status AS ENUM ('triggered', 'acknowledged', 'resolved', 'escalated');

-- Users table (unified for both doctor & patient)
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role user_role NOT NULL,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  phone_number VARCHAR(20),
  profile_picture_url TEXT,
  is_verified BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_login TIMESTAMP,
  verification_token VARCHAR(255),
  verification_token_expires_at TIMESTAMP
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);

-- Doctor profile extension
CREATE TABLE doctors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  license_number VARCHAR(255) UNIQUE NOT NULL,
  specialization VARCHAR(100),
  hospital_name VARCHAR(255),
  hospital_location TEXT,
  hospital_phone VARCHAR(20),
  hospital_address TEXT,
  years_of_experience INT,
  bio TEXT,
  availability_status VARCHAR(50),
  is_verified_doctor BOOLEAN DEFAULT FALSE,
  verification_date TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_doctors_user_id ON doctors(user_id);
CREATE INDEX idx_doctors_license ON doctors(license_number);

-- Patient profile extension
CREATE TABLE patients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  date_of_birth DATE,
  gender VARCHAR(20),
  blood_type VARCHAR(10),
  emergency_contact_name VARCHAR(100),
  emergency_contact_phone VARCHAR(20),
  assigned_doctor_id UUID REFERENCES doctors(id),
  medical_history TEXT,
  allergies TEXT,
  chronic_conditions TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_patients_user_id ON patients(user_id);
CREATE INDEX idx_patients_assigned_doctor ON patients(assigned_doctor_id);

-- Medical Reports table
CREATE TABLE medical_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  uploaded_by_id UUID NOT NULL REFERENCES users(id),
  file_name VARCHAR(255) NOT NULL,
  file_path TEXT NOT NULL,
  file_size INT,
  mime_type VARCHAR(50),
  status report_status DEFAULT 'pending',
  upload_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  processing_start_time TIMESTAMP,
  processing_end_time TIMESTAMP,
  is_encrypted BOOLEAN DEFAULT TRUE,
  encryption_key_id VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_medical_reports_patient ON medical_reports(patient_id);
CREATE INDEX idx_medical_reports_status ON medical_reports(status);
CREATE INDEX idx_medical_reports_uploaded_by ON medical_reports(uploaded_by_id);

-- Extracted Data from NLP
CREATE TABLE extracted_data (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  report_id UUID NOT NULL REFERENCES medical_reports(id) ON DELETE CASCADE,
  patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  diagnoses TEXT[], -- Array of diagnoses
  medications TEXT[], -- Array of medications
  dosages TEXT[], -- Array of dosages
  frequencies TEXT[], -- Array of frequencies
  test_results JSONB, -- JSON for flexibility
  vital_signs JSONB,
  clinical_notes TEXT,
  extracted_text TEXT,
  confidence_score FLOAT,
  is_verified BOOLEAN DEFAULT FALSE,
  verified_by_id UUID REFERENCES users(id),
  verified_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_extracted_data_report ON extracted_data(report_id);
CREATE INDEX idx_extracted_data_patient ON extracted_data(patient_id);

-- Personalized Recommendations
CREATE TABLE recommendations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  extracted_data_id UUID REFERENCES extracted_data(id),
  recommendation_text TEXT NOT NULL,
  recommendation_type VARCHAR(50), -- 'medication', 'lifestyle', 'followup', 'test'
  priority VARCHAR(20), -- 'low', 'medium', 'high'
  is_actionable BOOLEAN DEFAULT TRUE,
  action_required TEXT,
  follow_up_date DATE,
  is_completed BOOLEAN DEFAULT FALSE,
  completed_date TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_recommendations_patient ON recommendations(patient_id);
CREATE INDEX idx_recommendations_type ON recommendations(recommendation_type);

-- Chat Logs
CREATE TABLE chat_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  user_message TEXT NOT NULL,
  bot_response TEXT NOT NULL,
  conversation_context JSONB,
  intent VARCHAR(100),
  sentiment VARCHAR(20),
  is_sensitive_data BOOLEAN DEFAULT FALSE,
  session_id VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_chat_logs_patient ON chat_logs(patient_id);
CREATE INDEX idx_chat_logs_session ON chat_logs(session_id);

-- Audit Logs
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  action VARCHAR(100) NOT NULL,
  resource_type VARCHAR(100),
  resource_id UUID,
  status VARCHAR(50),
  details JSONB,
  ip_address INET,
  user_agent TEXT,
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_audit_logs_user ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_action ON audit_logs(action);
CREATE INDEX idx_audit_logs_timestamp ON audit_logs(timestamp);

-- Roles table (for RBAC)
CREATE TABLE roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  role_name user_role UNIQUE NOT NULL,
  description TEXT,
  permissions TEXT[],
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO roles (role_name, description, permissions) VALUES
('patient', 'Patient user role', ARRAY['view_own_profile', 'upload_reports', 'view_own_reports', 'chat_with_bot', 'view_own_recommendations']),
('doctor', 'Doctor user role', ARRAY['view_own_profile', 'view_patient_reports', 'create_recommendations', 'manage_patients', 'trigger_emergency']),
('admin', 'Administrator role', ARRAY['view_all_users', 'manage_users', 'view_all_reports', 'delete_reports', 'manage_roles', 'access_audit_logs']),
('nlp_service', 'NLP service role', ARRAY['process_reports', 'extract_entities', 'store_extracted_data']);
