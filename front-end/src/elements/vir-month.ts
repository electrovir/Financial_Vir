import {html} from 'lit-html';
import {CategorizedData} from '../modules/data/statement-data-transformer';
import {monthKeyToDate, getFullMonthName} from '../../../common/src/util/date';
import './vir-category';
import {BaseElement} from './base-element';

type State = {
    monthData: CategorizedData | undefined;
    monthKey: string | undefined;
};

class FinanceVirMonth extends BaseElement<State> {
    constructor() {
        super({
            monthData: undefined,
            monthKey: undefined,
        });
    }

    protected render(state: State) {
        const date = state.monthKey ? monthKeyToDate(state.monthKey) : undefined;
        return html`
            <style>
                .data {
                    display: flex;
                }

                vir-category {
                    flex-grow: 1;
                }
            </style>
            <h1>
                ${date ? `${getFullMonthName(date)} ${date.getFullYear()}` : ''}
            </h1>
            <div class="data">
                <vir-category .category=${state.monthData}></vir-category>
            </div>
        `;
    }
}

window.customElements.define('vir-month', FinanceVirMonth);
