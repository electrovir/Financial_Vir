import * as express from 'express';

export function createExpressServer(port: number) {
    const routing = express();

    const expressServer = routing.listen(port, () => {
        console.log(`http://localhost:${port}`);
    });

    return expressServer;
}
