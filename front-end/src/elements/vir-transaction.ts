import {html, render} from 'lit-html';
import {ReduxularElement} from 'reduxular';
import {Transaction} from '../modules/data/statement-data-transformer';
import {monthKeyToDate, getFullMonthName, dateDisplayFormat} from '../../../common/src/util/date';
import './vir-category';

type State = {
    transaction: Transaction | undefined;
};

const initialState: State = {
    transaction: undefined,
};

class FinanceVirTransaction extends ReduxularElement<State> {
    constructor() {
        super(initialState, state => {
            if (this.shadowRoot) {
                render(this.render(state), this.shadowRoot);
            }
        });
        this.attachShadow({mode: 'open'});
    }

    private defaultTemplate = html`
        <style>
            :host {
                display: flex;
            }

            .date {
                width: 56px;
            }

            .account {
                width: 48px;
                overflow: hidden;
            }

            .amount {
                min-width: 64px;
                text-align: right;
            }

            div {
                padding: 0 4px;
                flex-shrink: 0;
                flex-grow: 0;
            }

            .description {
                flex-grow: 1;
                flex-shrink: 1;
            }
        </style>
    `;

    private render(state: State) {
        if (state.transaction) {
            const transaction = state.transaction;
            return html`
                ${this.defaultTemplate}
                <div class="date">${dateDisplayFormat(transaction.date)}</div>
                <div class="account" title="${transaction.accountSuffix}">${transaction.accountSuffix}</div>
                <div class="amount">${transaction.amount.toFixed(2)}</div>
                <div class="description">${transaction.description}</div>
            `;
        } else {
            return this.defaultTemplate;
        }
    }
}

window.customElements.define('vir-transaction', FinanceVirTransaction);
