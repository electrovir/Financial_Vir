import {createStatementWebSocketServer} from './server/statement-web-socket';
import {createExpressServer} from './server/express-server';

const defaultPatternsPath = 'patterns/patterns.default.json';

const patternsFilePath = process.argv[2] || defaultPatternsPath;

const expressServer = createExpressServer(9000, patternsFilePath);

const webSocketServer = createStatementWebSocketServer(expressServer);
