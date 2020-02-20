import {html} from 'lit-html';
import {CategorizedData} from '../modules/data/statement-data-transformer';
import './vir-transaction';
import {BaseElement} from './base-element';

type State = {
    category: CategorizedData | undefined;
    expanded: {[key: string]: boolean};
};

const initialState: State = {
    category: undefined,
    expanded: {},
};

class FinancialVirCategory extends BaseElement<State> {
    constructor() {
        super(initialState, true);
    }

    private defaultTemplate = html`
        <style>
            :host {
                padding: 16px;
                border-radius: 4px;
                background-color: rgba(0, 0, 0, 0.05);
                display: flex;
                flex-direction: column;
                position: relative;
            }

            *:not(style) + header {
                padding-top: inherit;
            }
            strong {
                font-weight: normal;
            }

            header.expandable {
                cursor: pointer;
            }

            header.expandable strong {
                font-weight: bold;
            }

            vir-transaction {
                padding-left: inherit;
            }
        </style>
    `;

    private clickCategory(key: string, state: State) {
        if (state.expanded[key]) {
            this.store.expanded = {
                ...state.expanded,
                [key]: false,
            };
        } else {
            this.store.expanded = {
                ...state.expanded,
                [key]: true,
            };
        }
    }

    protected render(state: State) {
        if (state.category) {
            return html`
                ${this.defaultTemplate}
                ${Object.keys(state.category).map(key => {
                    const category = state.category![key];
                    const expandable = (category.transactions && category.transactions.length) || category.children;

                    return html`
                        <header
                            class="${expandable ? 'expandable' : ''}"
                            @click=${() => expandable && this.clickCategory(key, state)}
                        >
                            <strong>${key}:</strong>
                            ${category.value.toFixed(2)}
                        </header>
                        ${state.expanded[key] && category.transactions
                            ? html`
                                  ${category.transactions.map(
                                      transaction =>
                                          html`
                                              <vir-transaction .transaction=${transaction}></vir-transaction>
                                          `,
                                  )}
                              `
                            : ''}
                        ${state.expanded[key] && category.children
                            ? html`
                                  <vir-category .category=${category.children}></vir-category>
                              `
                            : ''}
                    `;
                })}
            `;
        } else {
            return this.defaultTemplate;
        }
    }
}

window.customElements.define('vir-category', FinancialVirCategory);
