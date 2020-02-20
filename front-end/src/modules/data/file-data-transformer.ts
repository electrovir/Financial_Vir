import {StatementData} from '../../../../common/src/data/statement-data';
import {getMonthKey} from '../../../../common/src/util/date';

export type StatementFileData = {
    id: number;
    accountSuffix: string;
    startDate: Date | undefined;
    endDate: Date;
};

export type StatementAccountFileData = {
    [accountSuffix: string]: StatementFileData[];
};

export type BucketedStatementAccountFileData = {
    [monthKey: string]: StatementAccountFileData;
};

export function createFileData(statementData: StatementData[]): BucketedStatementAccountFileData {
    return statementData.reduce((accum: BucketedStatementAccountFileData, current) => {
        const monthKey = getMonthKey(current.data.endDate);

        if (!accum.hasOwnProperty(monthKey)) {
            accum[monthKey] = {};
        }

        if (!accum[monthKey].hasOwnProperty(current.data.accountSuffix)) {
            accum[monthKey][current.data.accountSuffix] = [];
        }

        accum[monthKey][current.data.accountSuffix].push({
            id: current.id,
            accountSuffix: current.data.accountSuffix,
            startDate: current.data.startDate,
            endDate: current.data.endDate,
        });

        return accum;
    }, {});
}
