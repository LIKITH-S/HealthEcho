import axios from 'axios';

const API = axios.create({
    baseURL: 'http://localhost:5000/api'
});

const API_URL = '/doctor';

export const createPatient = async (data) => {
    const response = await API.post(`${API_URL}/create-patient`, data);
    return response.data;
};

// Attach token to every request
API.interceptors.request.use((config) => {
    const token = localStorage.getItem('accessToken');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

// GET doctor’s assigned patients
export const getDoctorPatients = async () => {
    const res = await API.get(`${API_URL}/patients`);
    return res.data;
};

// Add clinical details
export const addPatientDetails = async (data) => {
    const res = await API.post('/doctor/patient-details', data);
    return res.data;
};

// Trigger SOS
export const triggerSOS = async (data) => {
    const res = await API.post('/doctor/emergency-sos', data);
    return res.data;
};

// Upload Report
export const uploadPatientReport = async (formData) => {
    const res = await API.post('/doctor/upload-report', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    });
    return res.data;
};

// Manage contacts
export const saveContact = async (data) => {
    const res = await API.post('/doctor/contacts', data);
    return res.data;
};

// Share hospital location
export const shareHospitalLocation = async (data) => {
    const res = await API.post('/doctor/share-location', data);
    return res.data;
};
