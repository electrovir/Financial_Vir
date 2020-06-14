import {html, TemplateResult} from 'lit-html';
import {setupDataConnection, AllData} from '../modules/data/combine-all-data';

import './vir-file-checker';
import './vir-month';
import {BaseElement} from './base-element';

type AppState = {
    appData: AllData | undefined;
};

class FinanceVirApp extends BaseElement<AppState> {
    constructor() {
        super({
            appData: undefined,
        });

        setupDataConnection().then(emitter => {
            emitter.addEventListener('categorized-data', event => {
                console.log('categorized data', event.detail);
                this.store.appData = event.detail;
            });
        });
    }

    protected render(state: AppState): TemplateResult {
        const data = state.appData;
        if (data) {
            return html`
                ${Object.keys(data.statementData)
                    .sort()
                    .reverse()
                    .map(monthKey => {
                        return html`
                            <vir-month
                                .monthData=${data.statementData[monthKey]}
                                .monthKey=${monthKey}
                            ></vir-month>
                        `;
                    })}
                <vir-file-checker .fileData=${data.fileData}></vir-file-checker>
            `;
        } else {
            return html`
                LOADING
            `;
        }
    }
}

window.customElements.define('vir-app', FinanceVirApp);
