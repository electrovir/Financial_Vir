import {html, render, TemplateResult} from 'lit-html';
import {BucketedCategorizedData} from '../modules/data/statement-data-transformer';
import {setupDataConnection} from '../modules/data/combine-all-data';

import './vir-month';

class FinanceVirApp extends HTMLElement {
    connectedCallback() {
        render(this.render({}), this);
        setupDataConnection().then(emitter => {
            emitter.addEventListener('categorized-data', (event: CustomEventInit) => {
                render(this.render(event.detail), this);
            });
        });
    }

    private render(categorized: BucketedCategorizedData): TemplateResult {
        if (Object.keys(categorized).length) {
            return html`
                ${Object.keys(categorized)
                    .sort()
                    .reverse()
                    .map(monthKey => {
                        const thing = categorized[monthKey];
                        return html`
                            <vir-month .monthData=${thing} .monthKey=${monthKey}></vir-month>
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
