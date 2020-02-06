import {parsePdfs, StatementPdf, ParserType, ParsedPdf, ParsedOutput} from 'statement-parser';
import {readdirSync, lstatSync} from 'fs';
import {downloadsConfig} from '../../downloads/config';
import {getEnumTypedKeys} from '../../../common/src/util/object';
import {join, extname, basename, resolve, relative, isAbsolute} from 'path';
import {watch} from 'chokidar';
import {setupWatcher, WatcherChange, WatcherChangeCallback} from './batch-watcher';

type CachedStatementData = {[path: string]: ParsedPdf};
export type StatementData = {
    type: string;
    data: ParsedOutput;
};

let cachedData: CachedStatementData | undefined;

function filterPath(path: string) {
    return (
        lstatSync(path).isFile() &&
        extname(path).toLowerCase() === '.pdf' &&
        !!pathToType(path) &&
        basename(path)[0] !== '.'
    );
}

// async function parseStatements(paths: string[]): Promise<ParsedPdf[]> {
//     const files = (Object.keys(downloadsConfig) as ParserType[]).reduce((accum: StatementPdf[], parserType) => {
//         const dirs = downloadsConfig[parserType];

//         const paths = dirs.reduce((accum: string[], dir) => {
//             const rawPaths = readdirSync(dir);
//             const removedPaths: string[] = [];
//             const filteredPaths = rawPaths
//                 .map(name => join(dir, name))
//                 .filter(path => {
//                     if (lstatSync(path).isFile() && extname(path).toLowerCase() === '.pdf') {
//                         return true;
//                     }
//                     if (basename(path)[0] !== '.') {
//                         removedPaths.push(path);
//                     }
//                     return false;
//                 });

//             if (removedPaths.length) {
//                 console.warn(`${removedPaths.length} downloaded files were filtered: ${removedPaths}`);
//             }

//             return accum.concat(filteredPaths);
//         }, []);

//         return accum.concat(
//             paths.map(path => ({
//                 path: path,
//                 type: parserType,
//             })),
//         );
//     }, []);

//     const results = await parsePdfs(files);

//     return results;
// }

function pathToType(path: string): ParserType | undefined {
    const type = getEnumTypedKeys(downloadsConfig).find(key =>
        downloadsConfig[key].find(validPath => {
            const relativePath = relative(resolve(validPath), resolve(path));
            return relative && !relativePath.startsWith('..') && !isAbsolute(relativePath);
        }),
    );

    return type;
}

async function updateCacheData(changes: WatcherChange[]): Promise<ParsedPdf[]> {
    const newData = await parsePdfs(
        changes
            .filter(change => !!filterPath(change.path))
            .map(change => {
                const type = pathToType(change.path)!;
                console.log('inner change', {...change, type});
                return {
                    type,
                    path: change.path,
                };
            }),
    );

    if (!cachedData) {
        cachedData = {};
    }
    const forSureCachedData = cachedData;

    newData.forEach(parsedPdf => {
        forSureCachedData[parsedPdf.path] = parsedPdf;
    });

    return newData;
}

function mapParsedPdfToStatementData(input: ParsedPdf[]): StatementData[];
function mapParsedPdfToStatementData(input: ParsedPdf): StatementData;
function mapParsedPdfToStatementData(input: ParsedPdf | ParsedPdf[]): StatementData | StatementData[] {
    function singleMap(input: ParsedPdf): StatementData {
        return {
            data: input.data,
            type: input.type,
        };
    }
    if (Array.isArray(input)) {
        return input.map(parsedPdf => singleMap(parsedPdf));
    } else {
        return singleMap(input);
    }
}

export async function getStatementData(
    callback?: (changes: StatementData[]) => void | Promise<void>,
): Promise<StatementData[]> {
    let resolved = false;
    await new Promise(resolve => {
        if (cachedData === undefined) {
            setupWatcher('downloads', async changes => {
                // console.log(changes);
                const newPdfData = await updateCacheData(changes);

                if (!resolved) {
                    resolve();
                } else if (callback) {
                    await callback(mapParsedPdfToStatementData(newPdfData));
                }
            });
        } else {
            resolve();
        }
    });
    resolved = true;

    if (cachedData) {
        const allData = cachedData;
        return Object.keys(allData).reduce(
            (accum: StatementData[], key) => accum.concat(mapParsedPdfToStatementData(allData[key])),
            [],
        );
    } else {
        throw new Error(`cachedData should've been defined already but wasn't.`);
    }
}

if (!module.parent) {
    // (async () => console.log(await parseAllStatements()))();
}
