-- Medication Reminders
CREATE TABLE medication_reminders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  medication_name VARCHAR(255) NOT NULL,
  dosage VARCHAR(100),
  frequency reminder_frequency NOT NULL,
  time_of_day TIME,
  start_date DATE NOT NULL,
  end_date DATE,
  is_active BOOLEAN DEFAULT TRUE,
  reminder_method VARCHAR(50), -- 'sms', 'email', 'push', 'in_app'
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_medication_reminders_patient ON medication_reminders(patient_id);
CREATE INDEX idx_medication_reminders_active ON medication_reminders(is_active);

-- Medication Reminder Logs
CREATE TABLE medication_reminder_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reminder_id UUID NOT NULL REFERENCES medication_reminders(id) ON DELETE CASCADE,
  patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  reminder_sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  reminder_acknowledged BOOLEAN DEFAULT FALSE,
  acknowledged_at TIMESTAMP,
  medication_taken BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_reminder_logs_reminder ON medication_reminder_logs(reminder_id);
CREATE INDEX idx_reminder_logs_patient ON medication_reminder_logs(patient_id);
