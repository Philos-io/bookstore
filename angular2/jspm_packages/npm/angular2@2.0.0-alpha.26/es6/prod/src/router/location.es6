var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") return Reflect.decorate(decorators, target, key, desc);
    switch (arguments.length) {
        case 2: return decorators.reduceRight(function(o, d) { return (d && d(o)) || o; }, target);
        case 3: return decorators.reduceRight(function(o, d) { return (d && d(target, key)), void 0; }, void 0);
        case 4: return decorators.reduceRight(function(o, d) { return (d && d(target, key, o)) || o; }, desc);
    }
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { BrowserLocation } from './browser_location';
import { StringWrapper } from 'angular2/src/facade/lang';
import { EventEmitter, ObservableWrapper } from 'angular2/src/facade/async';
import { Injectable } from 'angular2/di';
export let Location = class {
    constructor(_browserLocation) {
        this._browserLocation = _browserLocation;
        this._subject = new EventEmitter();
        this._baseHref = stripIndexHtml(this._browserLocation.getBaseHref());
        this._browserLocation.onPopState((_) => this._onPopState(_));
    }
    _onPopState(_) { ObservableWrapper.callNext(this._subject, { 'url': this.path() }); }
    path() { return this.normalize(this._browserLocation.path()); }
    normalize(url) { return this._stripBaseHref(stripIndexHtml(url)); }
    normalizeAbsolutely(url) {
        if (url[0] != '/') {
            url = '/' + url;
        }
        return this._addBaseHref(url);
    }
    _stripBaseHref(url) {
        if (this._baseHref.length > 0 && StringWrapper.startsWith(url, this._baseHref)) {
            return StringWrapper.substring(url, this._baseHref.length);
        }
        return url;
    }
    _addBaseHref(url) {
        if (!StringWrapper.startsWith(url, this._baseHref)) {
            return this._baseHref + url;
        }
        return url;
    }
    go(url) {
        var finalUrl = this.normalizeAbsolutely(url);
        this._browserLocation.pushState(null, '', finalUrl);
    }
    forward() { this._browserLocation.forward(); }
    back() { this._browserLocation.back(); }
    subscribe(onNext, onThrow = null, onReturn = null) {
        ObservableWrapper.subscribe(this._subject, onNext, onThrow, onReturn);
    }
};
Location = __decorate([
    Injectable(), 
    __metadata('design:paramtypes', [BrowserLocation])
], Location);
function stripIndexHtml(url) {
    // '/index.html'.length == 11
    if (url.length > 10 && StringWrapper.substring(url, url.length - 11) == '/index.html') {
        return StringWrapper.substring(url, 0, url.length - 11);
    }
    return url;
}
//# sourceMappingURL=location.js.map