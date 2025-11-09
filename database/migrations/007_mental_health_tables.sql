-- Mental Health Assessments
CREATE TABLE mental_health_assessments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  assessment_type VARCHAR(50), -- 'PHQ9', 'GAD7', 'DASS21'
  scores JSONB, -- Store individual question scores
  total_score INT,
  severity_level VARCHAR(50), -- 'minimal', 'mild', 'moderate', 'moderately_severe', 'severe'
  is_crisis BOOLEAN DEFAULT FALSE,
  crisis_reason TEXT,
  assessment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  next_assessment_date DATE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_mental_health_patient ON mental_health_assessments(patient_id);
CREATE INDEX idx_mental_health_severity ON mental_health_assessments(severity_level);
CREATE INDEX idx_mental_health_crisis ON mental_health_assessments(is_crisis);

-- Mental Health Support Logs
CREATE TABLE mental_health_support_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  support_type VARCHAR(100), -- 'chat', 'resources', 'crisis_line', 'professional_referral'
  content TEXT,
  support_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_mental_health_support_patient ON mental_health_support_logs(patient_id);
