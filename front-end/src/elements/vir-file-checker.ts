import {html} from 'lit-html';
import {BaseElement} from './base-element';
import {BucketedStatementAccountFileData} from '../modules/data/file-data-transformer';

type State = {
    fileData: BucketedStatementAccountFileData | undefined;
};
class FinanceVirFileChecker extends BaseElement<State> {
    constructor() {
        super({
            fileData: undefined,
        });
    }

    protected render(state: State) {
        const data = state.fileData;
        if (data) {
        }
        return html``;
    }
}

window.customElements.define('vir-file-checker', FinanceVirFileChecker);
