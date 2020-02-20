import {html} from 'lit-html';
import {Transaction} from '../modules/data/statement-data-transformer';
import {dateDisplayFormat} from '../../../common/src/util/date';
import './vir-category';
import {BaseElement} from './base-element';

type State = {
    transaction: Transaction | undefined;
};

const initialState: State = {
    transaction: undefined,
};

class FinanceVirTransaction extends BaseElement<State> {
    constructor() {
        super(initialState, true);
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

    protected render(state: State) {
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
