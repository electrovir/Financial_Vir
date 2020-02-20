import {html} from 'lit-html';
import {CategorizedData} from '../modules/data/statement-data-transformer';
import {monthKeyToDate, getFullMonthName} from '../../../common/src/util/date';
import './vir-category';
import './vir-check-list';
import {StatementAccountFileData} from '../modules/data/file-data-transformer';
import {BaseElement} from './base-element';

type State = {
    monthData: CategorizedData | undefined;
    monthKey: string | undefined;
    fileData: StatementAccountFileData | undefined;
};

const initialState: State = {
    monthData: undefined,
    monthKey: undefined,
    fileData: undefined,
};

class FinanceVirMonth extends BaseElement<State> {
    constructor() {
        super(initialState);
    }

    protected render(state: State) {
        const date = state.monthKey ? monthKeyToDate(state.monthKey) : undefined;
        return html`
            <style>
                .data {
                    display: flex;
                }

                vir-category {
                    border-top-right-radius: 0;
                    border-bottom-right-radius: 0;
                    flex-grow: 1;
                }
            </style>
            <h1>
                ${date ? `${getFullMonthName(date)} ${date.getFullYear()}` : ''}
            </h1>
            <div class="data">
                <vir-category .category=${state.monthData}></vir-category>
                <vir-check-list .data=${state.fileData}></vir-check-list>
            </div>
        `;
    }
}

window.customElements.define('vir-month', FinanceVirMonth);
