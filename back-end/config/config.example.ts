import {ParserType} from 'statement-parser';

export const downloadsConfig: {[key in ParserType]?: string[]} = {
    [ParserType.CHASE_CREDIT]: ['downloads/chase-credit-statements'],
    [ParserType.PAYPAL]: ['downloads/paypal-statements'],
};
