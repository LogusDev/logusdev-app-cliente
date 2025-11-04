import axios from 'axios';

const api = axios.create({
    baseURL: 'http://192.168.15.7:3333',
    timeout: 40000,
    headers: {
        'Content-Type': 'application/json',
    },
});

export default api;