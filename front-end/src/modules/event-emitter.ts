export interface CustomEventListener<EventType extends Event> {
    (event: EventType): void;
}

export interface CustomEventHandler<EventType extends Event> {
    handleEvent(event: EventType): void;
}

export class EventEmitter<EventType extends Event> {
    private target = document.createTextNode('');

    public addEventListener(
        type: string,
        listener: CustomEventListener<EventType> | CustomEventHandler<EventType> | null,
        options?: boolean | AddEventListenerOptions | undefined,
    ) {
        return this.target.addEventListener.call(this.target, type, listener as any, options);
    }
    public removeEventListener = this.target.removeEventListener.bind(this.target);
    public dispatchEvent(event: EventType) {
        return this.target.dispatchEvent.call(this.target, event);
    }
}
