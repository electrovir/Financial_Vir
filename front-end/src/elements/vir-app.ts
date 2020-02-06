import {html, render} from 'lit-html';

class FinanceVirApp extends HTMLElement {
    public connectedCallback() {
        this.render();
    }

    private render() {
        render(
            html`
                hello this is app
            `,
            this,
        );
    }
}

window.customElements.define('vir-app', FinanceVirApp);
