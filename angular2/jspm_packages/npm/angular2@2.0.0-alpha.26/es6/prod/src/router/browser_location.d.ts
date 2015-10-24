export declare class BrowserLocation {
    private _location;
    private _history;
    private _baseHref;
    constructor();
    onPopState(fn: EventListener): void;
    getBaseHref(): string;
    path(): string;
    pushState(state: any, title: string, url: string): void;
    forward(): void;
    back(): void;
}
