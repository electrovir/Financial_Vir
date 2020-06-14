import {render as litRender, TemplateResult} from 'lit-html';
import {ReduxularElement, ReduxularListener} from 'reduxular';

export abstract class BaseElement<State> extends ReduxularElement<State> {
    protected readonly renderRoot: ShadowRoot;

    constructor(initialState: State, listener?: ReduxularListener<State>) {
        super(initialState, state => {
            listener && listener(state);
            litRender(this.render(state), this.renderRoot);
        });

        this.renderRoot = this.attachShadow({mode: 'closed'});
    }

    protected abstract render(state: Readonly<State>): TemplateResult;
}
