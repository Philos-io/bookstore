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
import { Directive } from 'angular2/annotations';
import { ElementRef } from 'angular2/core';
import { isPresent } from 'angular2/src/facade/lang';
import { DOM } from 'angular2/src/dom/dom_adapter';
export let CSSClass = class {
    constructor(ngEl) {
        this._domEl = ngEl.domElement;
    }
    _toggleClass(className, enabled) {
        if (enabled) {
            DOM.addClass(this._domEl, className);
        }
        else {
            DOM.removeClass(this._domEl, className);
        }
    }
    set iterableChanges(changes) {
        if (isPresent(changes)) {
            changes.forEachAddedItem((record) => { this._toggleClass(record.key, record.currentValue); });
            changes.forEachChangedItem((record) => { this._toggleClass(record.key, record.currentValue); });
            changes.forEachRemovedItem((record) => {
                if (record.previousValue) {
                    DOM.removeClass(this._domEl, record.key);
                }
            });
        }
    }
};
CSSClass = __decorate([
    Directive({ selector: '[class]', properties: ['iterableChanges: class | keyValDiff'] }), 
    __metadata('design:paramtypes', [ElementRef])
], CSSClass);
//# sourceMappingURL=class.js.map