import { io } from 'socket.io-client';

const socket = io("http://192.168.15.188:3333", {
    transports: ["websocket"],
    autoConnect: true
});

export default socket;