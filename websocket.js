const socketio = require('socket.io');
const parseStringAsArray = require('./src/utils/parseStringAsArray')
const calculateDistance = require('./src/utils/calculateDistance')
const connectios = [];

let io;
exports.setupWebSocket = (server) => {
 io = socketio(server);
    io.on('connection', socket => {

        const { latitude, longitude, techs } = socket.handshake.query;

        connectios.push({
            id: socket.id,
            coordinates: {
                latitude: Number(latitude),
                longitude: Number(longitude),
            },
            techs: parseStringAsArray(techs)
        })
    })
};

exports.findConnections = (coordinates, techs) =>{
    return connectios.filter(connection => {
        return calculateDistance(coordinates, connection.coordinates) < 10 && connection.techs.some(item => techs.includes(item))
    })
}


exports.sendMessage =(to, message, data) => {
    to.forEach(connectio => {
        io.to(connectio.id).emit(message,data);
    });
}