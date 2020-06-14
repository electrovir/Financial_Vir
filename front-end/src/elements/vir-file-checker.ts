import {html} from 'lit-html';
import {BaseElement} from './base-element';
import {BucketedMonthlyAccountFileData} from '../modules/data/file-data-transformer';
import {monthKeyToDate, getMonthNumber1Indexed} from '../../../common/src/util/date';

type State = {
    fileData: BucketedMonthlyAccountFileData | undefined;
};
class FinanceVirFileChecker extends BaseElement<State> {
    constructor() {
        super({
            fileData: undefined,
        });
    }

    private getSortedAccountKeys(fileData: BucketedMonthlyAccountFileData): string[] {
        const sortedMonths = Object.keys(fileData.months).sort();
        const recentMonths = sortedMonths.slice(sortedMonths.length - 13, sortedMonths.length - 1);
        const recentMonthAccountInclusions = recentMonths.reduce(
            (accum: {[accountKey: string]: number}, monthKey) => {
                fileData.months[monthKey] &&
                    fileData.months[monthKey].containedAccounts.forEach(accountKey => {
                        if (!accum.hasOwnProperty(accountKey)) {
                            accum[accountKey] = 0;
                        }
                        accum[accountKey]++;
                    });
                return accum;
            },
            {},
        );

        return Object.keys(fileData.accounts).sort((accountA, accountB) => {
            const a = recentMonthAccountInclusions[accountA] || 0;
            const b = recentMonthAccountInclusions[accountB] || 0;

            if (a === b) {
                return accountA.localeCompare(accountB);
            } else {
                return b - a;
            }
        });
    }

    protected render(state: State) {
        if (state.fileData) {
            const fileData = state.fileData;
            const sortedAccountKeys = this.getSortedAccountKeys(fileData);
            const sortedMonthKeys = Object.keys(fileData.months)
                .sort()
                .reverse();
            const monthsPerYearIncluded = sortedMonthKeys.reduce(
                (accum: {[year: number]: number}, monthKey) => {
                    const date = monthKeyToDate(monthKey);
                    const year = date.getFullYear();
                    const month = getMonthNumber1Indexed(date);

                    if ((accum[year] || 0) < month) {
                        accum[year] = month;
                    }
                    return accum;
                },
                {},
            );

            return html`
                <style>
                    :host {
                        display: block;
                    }

                    table {
                        border-collapse: collapse;
                    }

                    .included-data,
                    .month,
                    .year {
                        text-align: center;
                        padding: 0 4px;
                    }

                    td.yes {
                        font-weight: bold;
                        color: green;
                    }

                    td.no {
                        font-weight: bold;
                        color: red;
                    }

                    .first-month {
                        border: solid black 0;
                        border-right-width: 2px;
                    }

                    .year + .year {
                        border: solid black 0;
                        border-left-width: 2px;
                    }
                </style>
                <table>
                    <tr class="years">
                        <td colspan="2"></td>
                        ${Object.keys(monthsPerYearIncluded)
                            .sort()
                            .reverse()
                            .map(year => {
                                return html`
                                    <td
                                        class="year"
                                        colspan="${monthsPerYearIncluded[Number(year)]}"
                                    >
                                        ${year}
                                    </td>
                                `;
                            })}
                    </tr>
                    <tr class="months">
                        <td colspan="2"></td>
                        ${sortedMonthKeys.map(monthKey => {
                            const monthNumber = getMonthNumber1Indexed(monthKeyToDate(monthKey));
                            const monthString =
                                monthNumber < 10 ? `0${monthNumber}` : `${monthNumber}`;
                            return html`
                                <td class="month ${monthNumber === 1 ? 'first-month' : ''}">
                                    ${monthString}
                                </td>
                            `;
                        })}
                    </tr>
                    ${sortedAccountKeys.map(accountKey => {
                        return html`
                            <tr>
                                <td>${accountKey}</td>
                                <td>${fileData.accounts[accountKey].type}</td>
                                ${sortedMonthKeys.map(monthKey => {
                                    const contains = fileData.months[
                                        monthKey
                                    ].containedAccounts.has(accountKey);
                                    const monthNumber = getMonthNumber1Indexed(
                                        monthKeyToDate(monthKey),
                                    );
                                    return html`
                                        <td
                                            class="included-data ${contains
                                                ? 'yes'
                                                : 'no'} ${monthNumber === 1 ? 'first-month' : ''}"
                                        >
                                            ${contains
                                                ? html`
                                                      &#10003;
                                                  `
                                                : 'X'}
                                        </td>
                                    `;
                                })}
                            </tr>
                        `;
                    })}
                </table>
            `;
        }
        return html``;
    }
}

window.customElements.define('vir-file-checker', FinanceVirFileChecker);
