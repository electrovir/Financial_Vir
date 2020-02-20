import {html, render} from 'lit-html';
import {ReduxularElement} from 'reduxular';
import {CategorizedData} from '../modules/data/statement-data-transformer';
import {monthKeyToDate, getFullMonthName} from '../../../common/src/util/date';
import './vir-category';

type State = {
    monthData: CategorizedData | undefined;
    monthKey: string | undefined;
};

const initialState: State = {
    monthData: undefined,
    monthKey: undefined,
};

class FinanceVirMonth extends ReduxularElement<State> {
    constructor() {
        super(initialState, state => {
            render(this.render(state), this);
        });
    }

    private render(state: State) {
        const date = state.monthKey ? monthKeyToDate(state.monthKey) : undefined;
        return html`
            <h1>
                ${date ? `${getFullMonthName(date)} ${date.getFullYear()}` : ''}
            </h1>
            <vir-category .category=${state.monthData}></vir-category>
        `;
    }
}

window.customElements.define('vir-month', FinanceVirMonth);
