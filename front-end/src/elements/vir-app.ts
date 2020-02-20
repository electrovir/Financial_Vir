import {html, render, TemplateResult} from 'lit-html';
import {setupDataConnection, AllData} from '../modules/data/combine-all-data';

import './vir-month';

class FinanceVirApp extends HTMLElement {
    connectedCallback() {
        render(this.render(undefined), this);
        setupDataConnection().then(emitter => {
            emitter.addEventListener('categorized-data', event => {
                console.log(event.detail.fileData);
                render(this.render(event.detail), this);
            });
        });
    }

    private render(data?: AllData): TemplateResult {
        if (data && Object.keys(data).length) {
            return html`
                ${Object.keys(data.statementData)
                    .sort()
                    .reverse()
                    .map(monthKey => {
                        const monthData = data.statementData[monthKey];
                        const fileData = data.fileData[monthKey];
                        return html`
                            <vir-month .monthData=${monthData} .monthKey=${monthKey} .fileData=${fileData}></vir-month>
                        `;
                    })}
            `;
        } else {
            return html`
                LOADING
            `;
        }
    }
}

window.customElements.define('vir-app', FinanceVirApp);
