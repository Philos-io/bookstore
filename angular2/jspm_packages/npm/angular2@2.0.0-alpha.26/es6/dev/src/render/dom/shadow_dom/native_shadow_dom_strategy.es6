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
import { DOM } from 'angular2/src/dom/dom_adapter';
import { StyleUrlResolver } from './style_url_resolver';
import { ShadowDomStrategy } from './shadow_dom_strategy';
/**
 * This strategies uses the native Shadow DOM support.
 *
 * The templates for the component are inserted in a Shadow Root created on the component element.
 * Hence they are strictly isolated.
 */
export let NativeShadowDomStrategy = class extends ShadowDomStrategy {
    constructor(styleUrlResolver) {
        super();
        this.styleUrlResolver = styleUrlResolver;
    }
    prepareShadowRoot(el) { return DOM.createShadowRoot(el); }
    processStyleElement(hostComponentId, templateUrl, styleEl) {
        var cssText = DOM.getText(styleEl);
        cssText = this.styleUrlResolver.resolveUrls(cssText, templateUrl);
        DOM.setText(styleEl, cssText);
        return null;
    }
};
NativeShadowDomStrategy = __decorate([
    Injectable(), 
    __metadata('design:paramtypes', [StyleUrlResolver])
], NativeShadowDomStrategy);
//# sourceMappingURL=native_shadow_dom_strategy.js.map