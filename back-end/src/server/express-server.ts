import * as express from 'express';
import {Server} from 'http';
import {existsSync} from 'fs';
import * as cors from 'cors';
import {resolve} from 'path';

const defaultPatternsPath = 'patterns/patterns.default.json';

export function createExpressServer(port: number, patternsPath: string): Server {
    const expressApp = express();

    expressApp.use(cors());

    expressApp.get('/patterns', (req, res) => {
        let patternsPathToRead = '';
        if (existsSync(patternsPath)) {
            patternsPathToRead = resolve(patternsPath);
        } else if (existsSync(defaultPatternsPath)) {
            console.error(`Patterns file "${patternsPath}" was not found`);
            patternsPathToRead = resolve(defaultPatternsPath);
        } else {
            throw new Error(`patterns.json file not found`);
        }

        res.sendFile(patternsPathToRead);
    });

    const expressServer = expressApp.listen(port, () => {
        console.log(`http://localhost:${port}`);
    });

    return expressServer;
}
