-- SOS Notification Delivery Log
CREATE TABLE sos_notification_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sos_log_id UUID NOT NULL REFERENCES emergency_sos_logs(id) ON DELETE CASCADE,
  emergency_contact_id UUID NOT NULL REFERENCES emergency_contacts(id) ON DELETE CASCADE,
  notification_method VARCHAR(50), -- 'sms', 'call', 'email'
  notification_status VARCHAR(50), -- 'sent', 'delivered', 'failed'
  external_message_id VARCHAR(255),
  delivery_timestamp TIMESTAMP,
  response_timestamp TIMESTAMP,
  response_text TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_sos_notification_sos ON sos_notification_logs(sos_log_id);
CREATE INDEX idx_sos_notification_contact ON sos_notification_logs(emergency_contact_id);
