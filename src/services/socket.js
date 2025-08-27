import { io } from 'socket.io-client';

const socket = io("http://192.168.15.188:3333", {
    transports: ["websocket"],
    autoConnect: true
});

export function connectSocket(token) {
    socket.io.opts.query = { token };
    socket.connect();
}

export function onRideStatusUpdate(callback) {
    socket.on("atualizacao_status_da_corrida", callback);
}

export function onMessage(callback) {
    socket.on("message", callback);
}

export function sendMessage(data) {
    socket.emit("message", data)
};

export function requestRideStatus(rideId) {
    socket.emit("request_status_da_corrida", { rideId });
}

export function onEvent(event, callback) {
    socket.on(event, callback);
}

export function offEvent(event, callback) {
    socket.off(event, callback);
}

export function emmitEvent(event, data) {
    socket.emit(event, data)
}

export function disconnectSocket() {
    socket.disconnect();
}

export default socket;