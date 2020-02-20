import {CategoryNode} from './statement-data-transformer';

export const blacklist: CategoryNode[] = [
    {
        name: 'usaa credit card payments',
        transactionType: 'expenses',
        accountSuffix: '2402',
        pattern: 'usaa credit card pmt credit card ending in 3804',
    },
    {
        name: 'paypal transfers to bank account',
        transactionType: 'all',
        parseType: 'paypal',
        pattern: 'withdraw funds to bank account',
    },
    {
        name: 'chase credit card payments',
        transactionType: 'expenses',
        accountSuffix: '2402',
        pattern: 'chase credit crd epay',
    },
    {
        name: 'citi credit card payments',
        transactionType: 'expenses',
        accountSuffix: '2402',
        pattern: 'citi card online payment',
    },
    {
        name: 'transfers from paypal',
        transactionType: 'all',
        accountSuffix: '2402',
        pattern: 'paypal transfer',
    },
    {
        name: 'transfers to/from savings inside of checking',
        transactionType: 'all',
        accountSuffix: '2402',
        pattern: 'usaa funds transfer (cr from simeon reynolds savings)|(db to simeon reynolds savings)',
    },
    {
        name: 'transfers into IRA',
        transactionType: 'expenses',
        accountSuffix: '1065',
        pattern: 'usaa funds transfer (db|cr) to simeon reynolds imco',
    },
    {
        name: 'USAA credit card payment',
        transactionType: 'incomes',
        accountSuffix: '3804',
        pattern: 'usaa credit card payment',
    },
    {
        name: 'USAA credit card payment (old card)',
        transactionType: 'incomes',
        accountSuffix: '2045',
        pattern: 'usaa credit card payment',
    },
    {
        name: 'Chase credit card payment',
        transactionType: 'incomes',
        accountSuffix: '1114',
        pattern: '^payment thank you',
    },
    {
        name: 'Citi credit card payment',
        transactionType: 'incomes',
        accountSuffix: '4192',
        pattern: 'payment, thank you$',
    },
];

export const testConfig: CategoryNode[] = [
    {
        name: 'main income',
        transactionType: 'incomes',
        children: [
            {
                name: 'lucid income',
                accountSuffix: '2402',
                pattern: 'lucid software',
            },
            {
                name: 'smartlaw income',
                parseType: 'paypal',
                pattern: 'smartlaw',
            },
        ],
    },
    {
        name: 'other income',
        transactionType: 'incomes',
        isDefault: true,
    },
    {
        name: 'fixed expenses',
        transactionType: 'expenses',
        children: [
            {name: 'natural gas', accountSuffix: '2402', pattern: 'QuestarGas'},
            {name: 'comcast', accountSuffix: '3804', pattern: 'comcast'},
            {name: 'power', accountSuffix: '2402', pattern: 'pacific power bill'},
            {
                name: 'rent',
                children: [
                    {name: 'rent payments', accountSuffix: '2402', pattern: 'four seasons'},
                    {
                        name: 'rent split from Jordan',
                        parseType: 'paypal',
                        transactionType: 'incomes',
                        subtract: true,
                        pattern: 'general payment: jordan last',
                    },
                ],
            },
        ],
    },
    {
        name: 'savings',
        accountSuffix: '2402',
        transactionType: 'expenses',
        children: [
            {
                name: 'savings account',
                children: [
                    {
                        name: 'enter savings account',
                        accountSuffix: '1065',
                        transactionType: 'incomes',
                        pattern: 'usaa funds transfer (db to simeon reynolds savings|cr from simeon reynolds checking)',
                    },
                    {
                        name: 'exit savings account',
                        subtract: true,
                        transactionType: 'expenses',
                        accountSuffix: '1065',
                        pattern: 'usaa funds transfer db to simeon reynolds checking',
                    },
                ],
            },
            {name: 'IRA', pattern: 'usaa funds transfer db to simeon reynolds imco'},
            {name: 'crypto', pattern: 'ach debit \\d+ coinbase.com'},
        ],
    },
    {
        name: 'other expenses',
        transactionType: 'expenses',
        isDefault: true,
    },
    {
        name: 'donation',
        accountSuffix: '2402',
        transactionType: 'expenses',
        children: [{name: 'lds church', pattern: '(lds church donation)|(ch jesuschrist donation)'}],
    },
];

// export const testConfig: CategoryNode[] = [
//     {name: 'incomes', type: 'incomes', accountSuffix: '2402', children: [{name: 'lucid', pattern: 'lucid'}]},
// ];
