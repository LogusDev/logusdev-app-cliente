import axios from 'axios';

const api = axios.create({
    baseURL: 'http://192.168.15.11:3000',
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

export default api;