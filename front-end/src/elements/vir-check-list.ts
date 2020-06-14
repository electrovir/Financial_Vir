import {html, TemplateResult} from 'lit-html';
import {BaseElement} from './base-element';
import {getObjectTypedKeys} from '../../../common/src/util/object';
import {StatementAccountFileData} from '../modules/data/file-data-transformer';

type State = {
    data: StatementAccountFileData | undefined;
};

const initialState: State = {
    data: undefined,
};

class FinanceVirCheckList extends BaseElement<State> {
    constructor() {
        super(initialState, true);
    }

    private defaultTemplate: TemplateResult = html`
        <style>
            :host {
                display: flex;
                flex-direction: row;
                padding: 16px;
                border-radius: 4px;
                background-color: rgba(0, 0, 0, 0.05);
            }

            div {
                display: flex;
                flex-direction: column;
                justify-content: space-between;
            }

            div + div {
                padding-left: 16px;
            }

            div:not(.checks) {
                flex-grow: 1;
            }

            span.value {
                text-align: right;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
            }

            span + span {
                padding-top: 8px;
            }
        </style>
    `;

    protected render(state: State) {
        const data = state.data;
        if (data) {
            return html`
                ${this.defaultTemplate}
                <div class="keys">
                    ${getObjectTypedKeys(data).map(
                        key =>
                            html`
                                <span title=${key} class="value">
                                    ${key}
                                </span>
                            `,
                    )}
                </div>
                <div class="types">
                    ${getObjectTypedKeys(data).map(
                        key =>
                            html`
                                <span title=${(data[key][0] && data[key][0].type) || ''} class="value">
                                    ${(data[key][0] && data[key][0].type) || ''}
                                </span>
                            `,
                    )}
                </div>
                <div class="checks">
                    ${getObjectTypedKeys(data).map(
                        key =>
                            html`
                                <span class="check">
                                    ${data[key].length ? 'Y' : 'N'}
                                </span>
                            `,
                    )}
                </div>
            `;
        } else {
            return this.defaultTemplate;
        }
    }
}

window.customElements.define('vir-check-list', FinanceVirCheckList);
