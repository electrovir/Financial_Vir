import {ParsedTransaction} from 'statement-parser';

export {ParserType} from 'statement-parser';
export {ParsedTransaction} from 'statement-parser';

export type StatementSocketData = {type: 'statement-data'; data: StatementUpdates};

export type StatementData = {
    type: string;
    id: number;
    data: {
        incomes: ParsedTransaction[];
        expenses: ParsedTransaction[];
        startDate: Date | undefined;
        endDate: Date;
        accountSuffix: string;
    };
};

export type StatementUpdates = {
    update: StatementData[];
    add: StatementData[];
    remove: number[];
};
