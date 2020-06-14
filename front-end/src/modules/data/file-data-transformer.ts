import {StatementData} from '../../../../common/src/data/statement-data';
import {getMonthKey} from '../../../../common/src/util/date';
import {getObjectTypedKeys} from '../../../../common/src/util/object';

export type StatementFileData = {
    id: number;
    accountSuffix: string;
    startDate: Date | undefined;
    endDate: Date;
    type: string;
};

export type StatementAccountFileData = {
    [accountSuffix: string]: StatementFileData[];
};

export type BucketedStatementAccountFileData = {
    [monthKey: string]: StatementAccountFileData;
};

export function createFileData(statementData: StatementData[]): BucketedStatementAccountFileData {
    const allAccountSuffixKeys = new Set<string>();
    const bucketedData = statementData.reduce((accum: BucketedStatementAccountFileData, current) => {
        const monthKey = getMonthKey(current.data.endDate);

        if (!accum.hasOwnProperty(monthKey)) {
            accum[monthKey] = {};
        }

        if (!accum[monthKey].hasOwnProperty(current.data.accountSuffix)) {
            accum[monthKey][current.data.accountSuffix] = [];
            allAccountSuffixKeys.add(current.data.accountSuffix);
        }

        accum[monthKey][current.data.accountSuffix].push({
            id: current.id,
            accountSuffix: current.data.accountSuffix,
            startDate: current.data.startDate,
            endDate: current.data.endDate,
            type: current.type,
        });

        return accum;
    }, {});

    getObjectTypedKeys(bucketedData).forEach(monthKey => {
        const monthData = bucketedData[monthKey];
        const monthDataKeys = getObjectTypedKeys(monthData);
        allAccountSuffixKeys.forEach(masterKey => {
            if (!monthDataKeys.includes(masterKey)) {
                monthData[masterKey] = [];
            }
        });
    });

    return bucketedData;
}
