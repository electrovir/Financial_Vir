import {StatementSocketData, StatementData} from '../../../../common/src/data/statement-data';
import {EventEmitter} from '../event-emitter';
import {webSocketHost} from './host';

export interface StatementSocketDataEvent extends CustomEvent {
    detail: StatementSocketData;
}

export function createStatementSocket(): EventEmitter<StatementSocketDataEvent> {
    const socket = new WebSocket(webSocketHost);

    const emitter = new EventEmitter<StatementSocketDataEvent>();

    socket.onmessage = event => {
        emitter.dispatchEvent(new CustomEvent('data', {detail: parseSocketData(event.data)}));
    };

    return emitter;
}

function parseData(input: StatementData[]) {
    input.forEach(item => {
        if (item.data) {
            if (item.data.endDate) {
                item.data.endDate = new Date(item.data.endDate);
            }
            if (item.data.startDate) {
                item.data.startDate = new Date(item.data.startDate);
            }
            item.data.incomes
                .concat(item.data.expenses)
                .forEach(transaction => (transaction.date = new Date(transaction.date)));
        }
    });
}

function parseSocketData(input: string): StatementSocketData {
    const parsed = JSON.parse(input) as StatementSocketData;

    parseData(parsed.data.add);
    parseData(parsed.data.update);

    console.log(parsed.data);
    return parsed;
}
