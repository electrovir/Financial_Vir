import {watch} from 'chokidar';
import {randomString} from '../../../common/src/util/string';

export type WatcherChangeCallback = (changes: WatcherChange[]) => void | Promise<void>;
export type WatcherChange = {type: string; path: string};

const batchedEvents: {[key: string]: WatcherChange[]} = {};
const timerIds: {[key: string]: NodeJS.Timeout} = {};

const CHANGE_DEBOUNCE = 1000;

async function debounceCallback(batchId: string, type: string, path: string, callback: WatcherChangeCallback) {
    if (!timerIds.hasOwnProperty(batchId)) {
        timerIds[batchId] = setTimeout(async () => {
            delete timerIds[batchId];
            await callback(batchedEvents[batchId]);
            batchedEvents[batchId] = [];
        }, CHANGE_DEBOUNCE);
    }
    if (!batchedEvents.hasOwnProperty(batchId)) {
        batchedEvents[batchId] = [];
    }

    batchedEvents[batchId].push({type, path});
}

/**
 * When setting up the watcher for the first time, it'll fire for every file it finds
 **/
export function setupWatcher(
    path: string,
    callback: WatcherChangeCallback,
    errorCallback?: (error: Error) => void | Promise<void>,
) {
    const id = randomString(20);
    const watcher = watch(path, {awaitWriteFinish: true, atomic: true});

    watcher.on('all', (eventType, path) => debounceCallback(id, eventType, path, callback));

    watcher.on('error', async error => {
        if (errorCallback) {
            await errorCallback(error);
        } else {
            throw error;
        }
    });

    return id;
}
