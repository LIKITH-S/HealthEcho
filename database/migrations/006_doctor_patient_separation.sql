-- Table for doctor-patient relationships (many-to-many)
CREATE TABLE doctor_patient_relationships (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  doctor_id UUID NOT NULL REFERENCES doctors(id) ON DELETE CASCADE,
  patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  relationship_type VARCHAR(50), -- 'primary', 'secondary', 'consultant'
  assigned_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  end_date TIMESTAMP,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(doctor_id, patient_id)
);

CREATE INDEX idx_doctor_patient_doctor ON doctor_patient_relationships(doctor_id);
CREATE INDEX idx_doctor_patient_patient ON doctor_patient_relationships(patient_id);
