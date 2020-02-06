import {createWebSocketServer} from './server/web-socket';
import {createExpressServer} from './server/express';
import {getStatementData} from './server/statements';
import {setupWatcher} from './server/batch-watcher';

// const expressServer = createExpressServer(9000);
// const webSocketServer = createWebSocketServer(expressServer);

async function run() {
    const thing = await getStatementData(changes => console.log(changes));
    console.log('VERY FIRST DATA');
    console.log(thing);
    console.log('===============================');
}

run();
