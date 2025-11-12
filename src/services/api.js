import axios from 'axios';

const api = axios.create({
<<<<<<< HEAD
    baseURL: 'http://192.168.15.15:3333',
=======
    baseURL: 'http://192.168.15.6:3333',
>>>>>>> 1c202b93e1006fe6387081b9d49c8ebaaf956d7d
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

export default api;