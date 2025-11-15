const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const dotenv = require('dotenv');
const errorHandler = require('./middleware/errorHandler');
const { generalLimiter } = require('./middleware/rateLimiter');
const logger = require('./utils/logger');

dotenv.config();

const app = express();

// Security middleware
app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(generalLimiter);

// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'HealthEcho Backend running', timestamp: new Date() });
});

// Import all routes
const authRoutes = require('./routes/auth');
const doctorRoutes = require('./routes/doctor');
const patientRoutes = require('./routes/patients');
const reportRoutes = require('./routes/reports');
const recommendationRoutes = require('./routes/recommendations');
const chatbotRoutes = require('./routes/chatbot');
const mentalHealthRoutes = require('./routes/mentalHealth');
const drugInteractionRoutes = require('./routes/drugInteraction');
const medicationReminderRoutes = require('./routes/medicationReminder');
const emergencyContactRoutes = require('./routes/emergencyContact');
const healthInsightsRoutes = require('./routes/healthInsights');

// Register all routes
app.use('/api/auth', authRoutes);
app.use('/api/doctor', doctorRoutes);
app.use('/api/patient', patientRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/recommendations', recommendationRoutes);
app.use('/api/chatbot', chatbotRoutes);
app.use('/api/mental-health', mentalHealthRoutes);
app.use('/api/drug-interaction', drugInteractionRoutes);
app.use('/api/medication-reminders', medicationReminderRoutes);
app.use('/api/emergency-contacts', emergencyContactRoutes);
app.use('/api/health-insights', healthInsightsRoutes);

// 404 handler
app.use((req, res) => {
    res.status(404).json({ error: 'Route not found' });
});

// Error handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    logger.info(`✅ HealthEcho Backend running on port ${PORT}`);
    console.log(`\n🚀 Backend: http://localhost:${PORT}`);
    console.log(`📚 API Docs: http://localhost:${PORT}/api/health\n`);
});

module.exports = app;
