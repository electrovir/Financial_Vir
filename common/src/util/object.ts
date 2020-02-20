export function getEnumTypedKeys<T extends object>(input: T): (keyof T)[] {
    // keys are always strings
    return getObjectTypedKeys(input).filter(key => isNaN(Number(key))) as (keyof T)[];
}

export function getEnumTypedValues<T extends object>(input: T): T[keyof T][] {
    const keys = getEnumTypedKeys(input);
    return keys.map(key => input[key]);
}

export function getObjectTypedKeys<T extends object>(input: T): (keyof T)[] {
    return Object.keys(input) as (keyof T)[];
}

export function deepCopy<T extends Object>(input: T): T {
    return getObjectTypedKeys(input).reduce((accum, currentKey) => {
        const value = input[currentKey];
        let newValue: any;
        if (value instanceof Date) {
            newValue = new Date(Number(value));
        } else if (value instanceof RegExp) {
            newValue = new RegExp(value.source, value.flags);
        } else if (
            value === null ||
            value === undefined ||
            typeof value === 'string' ||
            typeof value === 'number' ||
            typeof value === 'boolean' ||
            typeof value === 'function'
        ) {
            newValue = value;
        } else if (Array.isArray(value)) {
            newValue = value.map(item => deepCopy(item));
        } else if (typeof value === 'object') {
            newValue = deepCopy(value);
        }

        accum[currentKey] = newValue;
        return accum;
    }, {} as any);
}
