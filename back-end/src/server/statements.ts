import {parsePdfs, ParserType, ParsedPdf} from 'statement-parser';
import {lstatSync, existsSync, writeFileSync} from 'fs';
import {downloadsConfig} from '../../downloads/config';
import {getEnumTypedKeys} from '../../../common/src/util/object';
import {StatementData, StatementUpdates} from '../../../common/src/data/statement-data';
import {extname, basename, resolve, relative, isAbsolute} from 'path';
import {setupWatcher, WatcherChange} from './batch-watcher';
import {EventEmitter} from 'events';

type AllStatementData = {[path: string]: StatementData};

let cachedData: AllStatementData = {};
let currentId = 0;

function filterPath(path: string) {
    return (
        existsSync(path) &&
        lstatSync(path).isFile() &&
        extname(path).toLowerCase() === '.pdf' &&
        !!pathToType(path) &&
        basename(path)[0] !== '.'
    );
}

function pathToType(path: string): ParserType | undefined {
    const type = getEnumTypedKeys(downloadsConfig).find(key =>
        downloadsConfig[key].find(validPath => {
            const relativePath = relative(resolve(validPath), resolve(path));
            return relative && !relativePath.startsWith('..') && !isAbsolute(relativePath);
        }),
    );

    return type;
}

async function updateCacheData(changes: WatcherChange[]): Promise<StatementUpdates> {
    const newData = await parsePdfs(
        changes
            .filter(change => !!filterPath(change.path))
            .map(change => {
                const type = pathToType(change.path)!;
                return {
                    type,
                    path: change.path,
                };
            }),
    );

    const updatedStatements = newData
        .filter(parsedPdf => cachedData.hasOwnProperty(parsedPdf.path))
        .map(parsedPdf => {
            const id = cachedData[parsedPdf.path].id;
            cachedData[parsedPdf.path] = createStatementData(parsedPdf);
            cachedData[parsedPdf.path].id = id;
            return cachedData[parsedPdf.path];
        });

    const addedStatements = newData
        .filter(parsedPdf => !cachedData.hasOwnProperty(parsedPdf.path))
        .map(parsedPdf => {
            cachedData[parsedPdf.path] = createStatementData(parsedPdf);
            return cachedData[parsedPdf.path];
        });

    const deleteData = changes
        .filter(change => change.type.includes('unlink') && cachedData.hasOwnProperty(change.path))
        .map(change => {
            const id = cachedData[change.path].id;
            delete cachedData[change.path];
            return id;
        });

    const returnValue = {
        update: updatedStatements,
        add: addedStatements,
        remove: deleteData,
    };

    return returnValue;
}

function createStatementData(input: ParsedPdf): StatementData {
    const data = {
        incomes: input.data.incomes,
        expenses: input.data.expenses,
        accountSuffix: input.data.accountSuffix,
        startDate: input.data.startDate,
        endDate: input.data.endDate,
    };

    return {
        data,
        id: ++currentId,
        type: input.type,
    };
}

function transformData(input: AllStatementData): StatementData[] {
    return Object.keys(input)
        .filter(key => input[key].data !== undefined)
        .map(key => input[key]);
}

export interface DataEmitter {
    emit(type: 'error', error: Error): boolean;
    emit(type: 'update', changes: StatementUpdates): boolean;
    emit(type: 'first-data', data: AllStatementData): boolean;
    on(type: 'error', listener: (error: Error) => void): this;
    on(type: 'update', listener: (changes: StatementUpdates) => void): this;
    on(type: 'first-data', listener: (data: AllStatementData) => void): this;
    once(type: 'error', listener: (error: Error) => void): this;
    once(type: 'update', listener: (changes: StatementUpdates) => void): this;
    once(type: 'first-data', listener: (data: AllStatementData) => void): this;
}

const statementDataEmitter: DataEmitter = new EventEmitter();

let firstDataFinished = false;
// file watcher
setupWatcher('downloads').emitter.on('changes', async changes => {
    const updates = await updateCacheData(changes);

    if (!firstDataFinished) {
        statementDataEmitter.emit('first-data', cachedData);
        firstDataFinished = true;
    }

    if (updates.add.length || updates.remove.length || updates.update.length) {
        statementDataEmitter.emit('update', updates);
    }
});

export function getStatementDataChangeEmitter() {
    return statementDataEmitter;
}

export async function getStatementData(): Promise<StatementData[]> {
    const awaitedCachedData = await new Promise<AllStatementData>(resolve => {
        if (firstDataFinished) {
            resolve(cachedData);
        } else {
            statementDataEmitter.once('first-data', data => {
                resolve(data);
            });
        }
    });

    return transformData(awaitedCachedData);
}
