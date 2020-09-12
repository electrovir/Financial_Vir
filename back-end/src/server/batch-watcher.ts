import {watch} from 'chokidar';
import {randomString} from '../../../common/src/util/string';
import {EventEmitter} from 'events';

export type WatcherChange = {type: string; path: string};

const batchedChanges: {[key: string]: WatcherChange[]} = {};
const timerIds: {[key: string]: NodeJS.Timeout} = {};

const CHANGE_DEBOUNCE = 1000;

function debounceCallback(batchId: string, change: WatcherChange, emitter: WatcherEmitter) {
    // setup a new debounce timer if it doesn't exist
    if (!timerIds.hasOwnProperty(batchId)) {
        timerIds[batchId] = setTimeout(() => {
            delete timerIds[batchId];
            emitter.emit('changes', batchedChanges[batchId]);
            batchedChanges[batchId] = [];
        }, CHANGE_DEBOUNCE);
    }

    // Create new batch if it doesn't exist yet
    if (!batchedChanges.hasOwnProperty(batchId)) {
        batchedChanges[batchId] = [];
    }

    batchedChanges[batchId].push(change);
}

export interface WatcherEmitter {
    emit(type: 'error', error: Error): boolean;
    emit(type: 'changes', changes: WatcherChange[]): boolean;
    on(type: 'error', listener: (error: Error) => void): this;
    on(type: 'changes', listener: (changes: WatcherChange[]) => void): this;
    once(type: 'error', listener: (error: Error) => void): this;
    once(type: 'changes', listener: (changes: WatcherChange[]) => void): this;
}

export function setupWatcher(path: string) {
    const watcherId = randomString(20);
    const watcher = watch(path, {awaitWriteFinish: true, atomic: true});
    const eventEmitter = new EventEmitter() as WatcherEmitter;

    watcher.on('all', (eventType, path) => debounceCallback(watcherId, {type: eventType, path}, eventEmitter));

    watcher.on('error', error => {
        eventEmitter.emit('error', error);
        throw error;
    });

    return {id: watcherId, emitter: eventEmitter};
}
