import {StatementData} from '../../../../common/src/data/statement-data';
import {getMonthKey, monthKeyToDate} from '../../../../common/src/util/date';

type AccountData = {
    type: Set<string>;
    openDate?: Date;
    closeDate?: Date;
};

type AccountDataGroup = {[accountSuffix: string]: AccountData};

type MonthAccountData = {
    containedAccounts: Set<string>;
};

type MonthAccountDataGroup = {[monthKey: string]: MonthAccountData};

export type BucketedStatementAccountFileData = {
    accounts: AccountDataGroup;
    months: MonthAccountDataGroup;
};

export function createFileData(statementData: StatementData[]): BucketedStatementAccountFileData {
    const allAccounts: AccountDataGroup = {};

    const accountsInEachMonth = statementData.reduce((accum: MonthAccountDataGroup, current) => {
        const monthKey = getMonthKey(current.data.endDate);
        const accountSuffix = current.data.accountSuffix;

        // keep track of this particular month containing a statement from this account
        if (!accum.hasOwnProperty(monthKey)) {
            accum[monthKey] = {
                containedAccounts: new Set<string>(),
            };
        }
        accum[monthKey].containedAccounts.add(accountSuffix);

        // keep track of all the current account existing at all
        if (!allAccounts.hasOwnProperty(accountSuffix)) {
            allAccounts[accountSuffix] = {
                type: new Set<string>(),
            };
        }
        allAccounts[accountSuffix].type.add(current.type);

        return accum;
    }, {});

    return {
        accounts: allAccounts,
        months: insertMissingMonths(accountsInEachMonth),
    };
}

function insertMissingMonths(input: MonthAccountDataGroup): MonthAccountDataGroup {
    const earliestMonthKey = getEarliestMonthKey(input);
    const latestMonthKey = getMonthKey(new Date());

    let iterationDate = monthKeyToDate(earliestMonthKey);
    const missingMonthKeys = new Set<string>();

    while (getMonthKey(iterationDate) <= latestMonthKey) {
        const iterationMonthKey = getMonthKey(iterationDate);
        if (!input.hasOwnProperty(iterationMonthKey)) {
            missingMonthKeys.add(iterationMonthKey);
        }

        iterationDate.setMonth(iterationDate.getMonth() + 1);
    }

    const missingMonthData = Array.from(missingMonthKeys).reduce(
        (accum: MonthAccountDataGroup, monthKey) => {
            return {
                ...accum,
                [monthKey]: {
                    containedAccounts: new Set<string>(),
                },
            };
        },
        {},
    );

    const output = {
        ...input,
        ...missingMonthData,
    };

    return output;
}

function getEarliestMonthKey(input: MonthAccountDataGroup): string {
    return Object.keys(input).sort()[0];
}
