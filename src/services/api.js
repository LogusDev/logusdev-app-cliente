import axios from 'axios';

const api = axios.create({
    baseURL: 'http://192.168.15.8:3333',
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

export default api;