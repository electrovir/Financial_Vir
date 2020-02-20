import {StatementData, ParsedTransaction, ParserType} from '../../../../common/src/data/statement-data';
import {getMonthKey} from '../../../../common/src/util/date';
import {collapseSpaces} from '../../../../common/src/util/string';
import {deepCopy} from '../../../../common/src/util/object';
import {Patterns} from '../network/patterns';

export type TransformedData = {};

export type Transaction = ParsedTransaction & {
    parseType: string;
    accountSuffix: string;
};

export type BucketData = {
    incomes: Transaction[];
    expenses: Transaction[];
};
export type BucketedData = {[monthKey: string]: BucketData};
export type BucketedCategorizedData = {[monthKey: string]: CategorizedData};
export type CategoryLeaf = {
    name: string;
    transactionType?: AllTransactionTypes;
    parseType?: string;
    pattern?: string;
    accountSuffix?: string;
    isDefault?: boolean;
    subtract?: boolean;
};
export type CategoryParent = {
    name: string;
    children: CategoryNode[];
    transactionType?: AllTransactionTypes;
    parseType?: string;
    accountSuffix?: string;
    subtract?: boolean;
};
export type CategoryNode = CategoryParent | CategoryLeaf;

type StrictTransactionType = 'incomes' | 'expenses';
type AllTransactionTypes = StrictTransactionType | 'all';

type CategorizedNode = {
    value: number;
    subtract: boolean;
    isDefault: boolean;
    transactions?: Transaction[];
    children?: CategorizedData;
    pattern?: RegExp;
    transactionType?: AllTransactionTypes;
    accountSuffix?: string;
};

export type CategorizedData = {
    [name: string]: CategorizedNode;
};

function bucketDataByMonth(statementData: StatementData[]): BucketedData {
    function insertTransaction(
        transactionType: StrictTransactionType,
        transaction: ParsedTransaction,
        statement: StatementData,
        bucketed: BucketedData,
    ) {
        const monthKey = getMonthKey(transaction.date);
        if (!bucketed[monthKey]) {
            bucketed[monthKey] = {
                incomes: [],
                expenses: [],
            };
        }

        bucketed[monthKey][transactionType].push({
            ...transaction,
            parseType: statement.type,
            accountSuffix: statement.data!.accountSuffix,
        });
    }

    return statementData.reduce((accum: BucketedData, statement) => {
        if (statement.data) {
            statement.data.incomes.forEach(transaction => {
                insertTransaction('incomes', transaction, statement, accum);
            });
            statement.data.expenses.forEach(transaction => {
                insertTransaction('expenses', transaction, statement, accum);
            });
        }

        return accum;
    }, {});
}

export function categorizeData(
    statementData: StatementData[],
    config: Patterns,
    obfuscateDate = false,
): BucketedCategorizedData {
    const categorizedSkeleton: CategorizedData = readConfig(config.patterns);
    const categorizedBlacklist: CategorizedData = readConfig(config.blacklist);
    const bucketedData = bucketDataByMonth(statementData);
    const fullyCategorizedData = insertTransactionsAndValues(
        categorizedSkeleton,
        bucketedData,
        obfuscateDate,
        categorizedBlacklist,
    );
    return fullyCategorizedData;
}

function isParent(node: CategoryNode): node is CategoryParent {
    return node.hasOwnProperty('children');
}

function insertValues(skeleton: CategorizedData, obfuscateDate: boolean) {
    let value = 0;
    Object.keys(skeleton).forEach(key => {
        const node = skeleton[key];
        let childValue = 0;
        if (node.transactions) {
            childValue += node.transactions.reduce(
                (accum, transaction) => (node.subtract ? -1 : 1) * transaction.amount + accum,
                0,
            );
        }
        if (node.children) {
            childValue += insertValues(node.children, obfuscateDate);
        }
        node.value = obfuscateDate ? -1 : Number(childValue.toFixed(2));
        value += childValue;
    });
    return value;
}

function findMatchingNode(
    type: AllTransactionTypes,
    transaction: Transaction,
    skeleton: CategorizedData,
    useDefault = false,
): CategorizedNode | undefined {
    return Object.keys(skeleton)
        .map(key => skeleton[key])
        .reduce((returnValue: undefined | CategorizedNode, node) => {
            if (returnValue !== undefined) {
                return returnValue;
            }

            if ((node.transactionType === type || node.transactionType === 'all') && node.transactions) {
                if (node.accountSuffix && node.accountSuffix !== transaction.accountSuffix) {
                    return undefined;
                }
                if (
                    !useDefault &&
                    (!node.pattern || (node.pattern && !node.pattern.exec(collapseSpaces(transaction.description))))
                ) {
                    return undefined;
                }
                if (useDefault && !node.isDefault) {
                    return undefined;
                }

                return node;
            }

            const matchedChildNode =
                node.children && Object.keys(node.children).length > 0
                    ? findMatchingNode(type, transaction, node.children, useDefault)
                    : undefined;

            return matchedChildNode;
        }, undefined);
}

function insertSingleTransaction(
    transactionType: AllTransactionTypes,
    transaction: Transaction,
    categorized: CategorizedData,
    blacklist: CategorizedData,
) {
    const blacklisted = findMatchingNode(transactionType, transaction, blacklist);
    if (!blacklisted) {
        let node = findMatchingNode(transactionType, transaction, categorized);
        if (!node) {
            node = findMatchingNode(transactionType, transaction, categorized, true);
        }
        if (node) {
            if (!node.transactions) {
                node.transactions = [];
            }
            node.transactions.push(transaction);
        }
    }
}

function sortTransactionsByDate(node: CategorizedNode) {
    if (node.transactions) {
        node.transactions.sort((a, b) => Number(a.date) - Number(b.date));
    }
    if (node.children) {
        const children = node.children;
        Object.keys(children)
            .map(key => children[key])
            .forEach(node => sortTransactionsByDate(node));
    }
}

function insertTransactionsAndValues(
    categorizedSkeleton: CategorizedData,
    bucketedData: BucketedData,
    obfuscateDate: boolean,
    blacklist: CategorizedData,
): BucketedCategorizedData {
    const bucketedCategorizedData: BucketedCategorizedData = {};

    Object.keys(bucketedData).forEach(monthKey => {
        const categorized = deepCopy(categorizedSkeleton);
        const incomeTransactions = bucketedData[monthKey].incomes;
        const expenseTransactions = bucketedData[monthKey].expenses;

        incomeTransactions.forEach(transaction => {
            insertSingleTransaction('incomes', transaction, categorized, blacklist);
        });
        expenseTransactions.forEach(transaction => {
            insertSingleTransaction('expenses', transaction, categorized, blacklist);
        });

        insertValues(categorized, obfuscateDate);

        bucketedCategorizedData[monthKey] = categorized;
    });
    Object.keys(bucketedCategorizedData)
        .map(key => bucketedCategorizedData[key])
        .forEach(categorized =>
            Object.keys(categorized)
                .map(key => categorized[key])
                .forEach(node => sortTransactionsByDate(node)),
        );

    return bucketedCategorizedData;
}

function readConfig(
    config: CategoryNode[],
    transactionType?: AllTransactionTypes,
    accountSuffix?: string,
): CategorizedData {
    return config.reduce((accum: CategorizedData, categoryNode) => {
        const name = categoryNode.name;
        if (accum.hasOwnProperty(name)) {
            throw new Error(`Property name already present: "${name}"`);
        } else {
            accum[name] = {
                value: 0,
                subtract: false,
                isDefault: false,
            };

            if (isParent(categoryNode)) {
                const children = readConfig(
                    categoryNode.children,
                    categoryNode.transactionType || transactionType,
                    categoryNode.accountSuffix || accountSuffix,
                );
                if (Object.keys(children).length) {
                    accum[name].children = children;
                }
            } else {
                accum[name].pattern = (categoryNode.pattern && new RegExp(categoryNode.pattern, 'i')) || undefined;
                accum[name].transactionType = categoryNode.transactionType || transactionType;
                accum[name].transactions = [];
                accum[name].accountSuffix = categoryNode.accountSuffix || accountSuffix;
                accum[name].isDefault = categoryNode.isDefault || false;
                accum[name].subtract = categoryNode.subtract || false;
                if (!accum[name].transactionType) {
                    console.error(name);
                    throw new Error(`Invalid transaction type on name "${name}": "${accum[name].transactionType}"`);
                }
            }
        }
        return accum;
    }, {});
}
