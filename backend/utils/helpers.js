const jwt = require('jsonwebtoken');

// Generate unique transaction ID
const generateTransactionId = () => {
    return `TXN-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

// Format date
const formatDate = (date) => {
    return new Date(date).toISOString().split('T')[0];
};

// Calculate age
const calculateAge = (dateOfBirth) => {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }

    return age;
};

// Calculate BMI
const calculateBMI = (weightKg, heightCm) => {
    const heightM = heightCm / 100;
    return (weightKg / (heightM * heightM)).toFixed(2);
};

// Paginate array/data
const paginate = (data, page, limit) => {
    const totalPages = Math.ceil(data.length / limit);
    const startIndex = (page - 1) * limit;
    const paginatedData = data.slice(startIndex, startIndex + limit);

    return {
        data: paginatedData,
        pagination: {
            page,
            limit,
            totalPages,
            totalItems: data.length,
            hasNextPage: page < totalPages,
            hasPrevPage: page > 1
        }
    };
};

// Generate OTP
const generateOTP = (length = 6) => {
    return Math.floor(Math.pow(10, length - 1) + Math.random() * 9 * Math.pow(10, length - 1));
};

// Format phone number
const formatPhoneNumber = (phone) => {
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.length === 10) return `+91${cleaned}`;
    if (cleaned.length === 12) return `+91${cleaned.slice(-10)}`;
    return `+${cleaned}`;
};

// Parse JWT without verification (for debugging)
const parseToken = (token) => {
    try {
        return jwt.decode(token);
    } catch (error) {
        return null;
    }
};

// Convert array to CSV
const arrayToCSV = (data) => {
    if (!data || data.length === 0) return '';

    const headers = Object.keys(data[0]);
    const rows = data.map(row =>
        headers.map(header => {
            const value = row[header];
            if (typeof value === 'string' && value.includes(',')) {
                return `"${value}"`;
            }
            return value;
        }).join(',')
    );

    return [headers.join(','), ...rows].join('\n');
};

// Sleep utility (for testing/delays)
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Build query filter from request parameters
const buildQueryFilter = (params) => {
    const filter = {};

    if (params.status) filter.status = params.status;
    if (params.role) filter.role = params.role;
    if (params.startDate) filter.created_at = { $gte: new Date(params.startDate) };
    if (params.endDate) {
        filter.created_at = {
            ...filter.created_at,
            $lte: new Date(params.endDate)
        };
    }

    return filter;
};

module.exports = {
    generateTransactionId,
    formatDate,
    calculateAge,
    calculateBMI,
    paginate,
    generateOTP,
    formatPhoneNumber,
    parseToken,
    arrayToCSV,
    sleep,
    buildQueryFilter
};
