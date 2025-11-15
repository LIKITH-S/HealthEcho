-- Emergency Contacts
CREATE TABLE emergency_contacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  contact_name VARCHAR(100) NOT NULL,
  contact_phone VARCHAR(20) NOT NULL,
  contact_email VARCHAR(255),
  relationship VARCHAR(50),
  priority INT, -- 1 = highest priority
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_emergency_contacts_patient ON emergency_contacts(patient_id);
CREATE INDEX idx_emergency_contacts_priority ON emergency_contacts(priority);

-- Emergency SOS Logs (NEW - for doctor-triggered SOS)
CREATE TABLE emergency_sos_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  triggered_by_id UUID NOT NULL REFERENCES users(id),
  trigger_reason TEXT,
  emergency_status emergency_status DEFAULT 'triggered',
  hospital_location TEXT,
  hospital_coordinates POINT, -- PostgreSQL point type for GPS coordinates
  alert_message TEXT,
  contacts_notified INT DEFAULT 0,
  triggered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  acknowledged_at TIMESTAMP,
  resolved_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_emergency_sos_patient ON emergency_sos_logs(patient_id);
CREATE INDEX idx_emergency_sos_triggered_by ON emergency_sos_logs(triggered_by_id);
CREATE INDEX idx_emergency_sos_status ON emergency_sos_logs(emergency_status);
CREATE INDEX idx_emergency_sos_timestamp ON emergency_sos_logs(triggered_at);
