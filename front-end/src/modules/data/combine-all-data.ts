import {createStatementSocket} from '../network/statement-socket';
import {getPatterns} from '../network/patterns';
import {
    StatementUpdates,
    StatementData,
    StatementSocketData,
} from '../../../../common/src/data/statement-data';
import {removeFromIndex} from '../../../../common/src/util/array';
import {categorizeData, BucketedCategorizedData} from './statement-data-transformer';
import {EventEmitter} from '../event-emitter';
import {BucketedMonthlyAccountFileData, createFileData} from './file-data-transformer';

export type AllData = {
    statementData: BucketedCategorizedData;
    fileData: BucketedMonthlyAccountFileData;
};

export interface AllDataEvent extends CustomEvent {
    detail: AllData;
}

export async function setupDataConnection(): Promise<EventEmitter<AllDataEvent>> {
    const patternConfig = await getPatterns();
    const rawStatementData: StatementData[] = [];

    const emitter = new EventEmitter<AllDataEvent>();

    createStatementSocket().addEventListener(
        'data',
        (event: CustomEventInit<StatementSocketData>) => {
            if (event.detail) {
                insertUpdates(rawStatementData, event.detail.data);
                emitter.dispatchEvent(
                    new CustomEvent('categorized-data', {
                        detail: {
                            statementData: categorizeData(rawStatementData, patternConfig),
                            fileData: createFileData(rawStatementData),
                        },
                    }),
                );
            }
        },
    );

    return emitter;
}

function insertUpdates(rawStatementData: StatementData[], updates: StatementUpdates) {
    updates.update.forEach(data => {
        const found = rawStatementData.find(row => row.id === data.id);
        if (found) {
            found.data = data.data;
            found.type = data.type;
        } else {
            console.error(`Failed to find transaction already inserted with id "${data.id}"`);
        }
    });

    updates.add.forEach(addition => {
        rawStatementData.push(addition);
    });

    updates.remove.forEach(id => {
        const index = rawStatementData.findIndex(row => row.id === id);
        if (index > -1) {
            removeFromIndex(rawStatementData, index);
        } else {
            console.error(`Failed to find transaction already inserted with id "${id}"`);
        }
    });
}
