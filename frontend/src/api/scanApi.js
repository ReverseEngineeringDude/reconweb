import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

export const startScan = async (domain) => {
    const response = await axios.post(`${API_URL}/scan`, { domain });
    return response.data;
};

export const getScan = async (id) => {
    const response = await axios.get(`${API_URL}/scan/${id}`);
    return response.data;
};

export const getScanStatus = async (id) => {
    const response = await axios.get(`${API_URL}/scan/${id}/status`);
    return response.data;
};

export const getAllScans = async () => {
    const response = await axios.get(`${API_URL}/scans`);
    return response.data;
};
