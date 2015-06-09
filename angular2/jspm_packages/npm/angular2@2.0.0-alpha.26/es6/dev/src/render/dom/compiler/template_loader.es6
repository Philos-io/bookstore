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
import { Injectable } from 'angular2/di';
import { isBlank, isPresent, BaseException } from 'angular2/src/facade/lang';
import { StringMapWrapper } from 'angular2/src/facade/collection';
import { PromiseWrapper } from 'angular2/src/facade/async';
import { DOM } from 'angular2/src/dom/dom_adapter';
import { XHR } from 'angular2/src/services/xhr';
import { UrlResolver } from 'angular2/src/services/url_resolver';
/**
 * Strategy to load component templates.
 * TODO: Make public API once we are more confident in this approach.
 */
export let TemplateLoader = class {
    constructor(xhr, urlResolver) {
        this._xhr = xhr;
        this._htmlCache = StringMapWrapper.create();
    }
    load(template) {
        if (isPresent(template.template)) {
            return PromiseWrapper.resolve(DOM.createTemplate(template.template));
        }
        var url = template.absUrl;
        if (isPresent(url)) {
            var promise = StringMapWrapper.get(this._htmlCache, url);
            if (isBlank(promise)) {
                // TODO(vicb): change error when TS gets fixed
                // https://github.com/angular/angular/issues/2280
                // throw new BaseException(`Failed to fetch url "${url}"`);
                promise = PromiseWrapper.then(this._xhr.get(url), html => {
                    var template = DOM.createTemplate(html);
                    return template;
                }, _ => PromiseWrapper.reject(new BaseException(`Failed to fetch url "${url}"`), null));
                StringMapWrapper.set(this._htmlCache, url, promise);
            }
            // We need to clone the result as others might change it
            // (e.g. the compiler).
            return promise.then((tplElement) => DOM.clone(tplElement));
        }
        throw new BaseException('View should have either the url or template property set');
    }
};
TemplateLoader = __decorate([
    Injectable(), 
    __metadata('design:paramtypes', [XHR, UrlResolver])
], TemplateLoader);
//# sourceMappingURL=template_loader.js.map