import {createStatementWebSocketServer} from './server/statement-web-socket';
import {createExpressServer} from './server/express-server';

const patternsFilePath = process.argv[2];

const expressServer = createExpressServer(9000, patternsFilePath);

const webSocketServer = createStatementWebSocketServer(expressServer);
