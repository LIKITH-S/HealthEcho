import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

export async function login(email, password, role) {
  const response = await axios.post(`${API_BASE_URL}/auth/login`, {
    email,
    password,
    role
  });
  return response.data;
}

export async function register({ name, email, password, role }) {
  const [first_name, ...lastParts] = name.trim().split(" ");
  const last_name = lastParts.join(" ") || "";

  const payload = {
    first_name,
    last_name,
    email,
    password,
    role: role.toLowerCase()   // must be "patient" or "doctor"
  };

  const response = await axios.post(`${API_BASE_URL}/auth/register`, payload);
  return response.data;
}

