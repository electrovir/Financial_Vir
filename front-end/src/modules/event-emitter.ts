export class EventEmitter {
    private target = document.createTextNode('');

    public addEventListener = this.target.addEventListener.bind(this.target);
    public removeEventListener = this.target.removeEventListener.bind(this.target);
    public dispatchEvent = this.target.dispatchEvent.bind(this.target);
}
