import {render, TemplateResult} from 'lit-html';
import {ReduxularElement} from 'reduxular';

export abstract class BaseElement<State> extends ReduxularElement<State> {
    constructor(initialState: State, attachShadow = false) {
        super(initialState, state => {
            if (attachShadow && this.shadowRoot) {
                render(this.render(state), this.shadowRoot);
            } else if (!attachShadow) {
                render(this.render(state), this);
            }
        });

        if (attachShadow) {
            this.attachShadow({mode: 'open'});
        }
    }

    protected abstract render(state: State): TemplateResult;
}
