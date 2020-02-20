import * as WebSocket from 'ws';
import {Server} from 'http';
import {getStatementData, getStatementDataChangeEmitter} from './statements';
import {StatementSocketData} from '../../../common/src/data/statement-data';

export function createStatementWebSocketServer(httpServer: Server): WebSocket.Server {
    const webSocketServer = new WebSocket.Server({server: httpServer});
    webSocketServer.on('connection', webSocketConnection);

    return webSocketServer;
}

async function webSocketConnection(socket: WebSocket) {
    console.log('Web socket connecting');
    sendSocketData(socket, {
        type: 'statement-data',
        data: {
            update: [],
            add: await getStatementData(),
            remove: [],
        },
    });

    getStatementDataChangeEmitter().on('update', updates => {
        console.log('Sending updates to web socket');
        sendSocketData(socket, {
            type: 'statement-data',
            data: updates,
        });
    });
}

function sendSocketData(socket: WebSocket, data: StatementSocketData) {
    socket.send(JSON.stringify(data));
}
