-- Health Metrics
CREATE TABLE health_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  blood_pressure_systolic INT,
  blood_pressure_diastolic INT,
  blood_sugar_fasting INT,
  blood_sugar_random INT,
  weight_kg FLOAT,
  height_cm FLOAT,
  bmi FLOAT,
  heart_rate INT,
  temperature_celsius FLOAT,
  oxygen_saturation INT,
  cholesterol_total INT,
  cholesterol_ldl INT,
  cholesterol_hdl INT,
  metric_date DATE NOT NULL,
  measurement_time TIME,
  measurement_source VARCHAR(50), -- 'manual', 'wearable', 'clinical'
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_health_metrics_patient ON health_metrics(patient_id);
CREATE INDEX idx_health_metrics_date ON health_metrics(metric_date);

-- Health Insights (computed analytics)
CREATE TABLE health_insights (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  insight_type VARCHAR(100), -- 'trend', 'alert', 'achievement'
  insight_text TEXT,
  data_range_start DATE,
  data_range_end DATE,
  trend_direction VARCHAR(20), -- 'improving', 'declining', 'stable'
  confidence_score FLOAT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_health_insights_patient ON health_insights(patient_id);
CREATE INDEX idx_health_insights_type ON health_insights(insight_type);
