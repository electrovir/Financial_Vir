/**
 * returns 2020-12 for December 2020
 **/
export function getMonthKey(input: Date) {
    let monthString = `${input.getMonth() + 1}`;

    if (monthString.length === 1) {
        monthString = '0' + monthString;
    }
    return `${input.getFullYear()}${MONTH_KEY_SEPARATOR}${monthString}`;
}

const MONTH_KEY_SEPARATOR = '-';

export function monthKeyToDate(input: string) {
    const [year, monthNumber] = input.split(MONTH_KEY_SEPARATOR);

    return new Date(`${year}-${monthNumber}-05`);
}

export function getMonthNumber1Indexed(input: Date): number {
    return Number(getMonthKey(input).split(MONTH_KEY_SEPARATOR)[1]);
}

export function dateDisplayFormat(input: Date, includeYear = false, includeMonth = true) {
    const year = includeYear ? `, ${input.getFullYear()}` : '';
    const month = includeMonth ? `${getShortMonthName(input)} ` : '';
    return `${month}${input.getDate()}${year}`;
}

export function getShortMonthName(input: Date) {
    return getFullMonthName(input).substring(0, 3);
}

export function getFullMonthName(input: Date) {
    return monthNames[input.getMonth()];
}

const monthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
];
