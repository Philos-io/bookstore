import { BrowserLocation } from './browser_location';
export declare class Location {
    _browserLocation: BrowserLocation;
    private _subject;
    private _baseHref;
    constructor(_browserLocation: BrowserLocation);
    _onPopState(_: any): void;
    path(): string;
    normalize(url: string): string;
    normalizeAbsolutely(url: string): string;
    _stripBaseHref(url: string): string;
    _addBaseHref(url: string): string;
    go(url: string): void;
    forward(): void;
    back(): void;
    subscribe(onNext: any, onThrow?: any, onReturn?: any): void;
}
