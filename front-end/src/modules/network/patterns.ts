import {httpHost} from './host';
import {CategoryNode} from '../data/statement-data-transformer';

export type Patterns = {
    blacklist: CategoryNode[];
    patterns: CategoryNode[];
};

export async function getPatterns(): Promise<Patterns> {
    const response = await fetch(httpHost + '/patterns');
    return await response.json();
}
