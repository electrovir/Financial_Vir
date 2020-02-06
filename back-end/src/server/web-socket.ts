import * as webSocket from 'ws';
import {Server} from 'http';

function webSocketConnection(socket: webSocket) {
    socket.on('message', (message: string) => {
        console.log(`socket received message: ${message}.`);
        socket.send(`Web socket server received ${message} from you.`);
    });

    socket.send(`Web socket connection started.`);
}

export function createWebSocketServer(httpServer: Server): webSocket.Server {
    const webSocketServer = new webSocket.Server({server: httpServer});
    webSocketServer.on('connection', webSocketConnection);

    return webSocketServer;
}
