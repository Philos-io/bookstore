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
import { CONST_EXPR } from 'angular2/src/facade/lang';
import { EventEmitter, ObservableWrapper } from 'angular2/src/facade/async';
import { StringMapWrapper } from 'angular2/src/facade/collection';
import { Directive, onChange } from 'angular2/angular2';
import { FORWARD_REF, Binding } from 'angular2/di';
import { ControlDirective } from './control_directive';
import { Control } from '../model';
import { setUpControl } from './shared';
const formControlBinding = CONST_EXPR(new Binding(ControlDirective, { toAlias: FORWARD_REF(() => NgModelDirective) }));
export let NgModelDirective = class extends ControlDirective {
    constructor() {
        super();
        this.control = new Control("");
        this.ngModel = new EventEmitter();
        this._added = false;
    }
    onChange(c) {
        if (!this._added) {
            setUpControl(this.control, this);
            this.control.updateValidity();
            this._added = true;
        }
        ;
        if (StringMapWrapper.contains(c, "model")) {
            this.control.updateValue(this.model);
        }
    }
    get path() { return []; }
    viewToModelUpdate(newValue) { ObservableWrapper.callNext(this.ngModel, newValue); }
};
NgModelDirective = __decorate([
    Directive({
        selector: '[ng-model]:not([ng-control]):not([ng-form-control])',
        hostInjector: [formControlBinding],
        properties: ['model: ng-model'],
        events: ['ngModel'],
        lifecycle: [onChange]
    }), 
    __metadata('design:paramtypes', [])
], NgModelDirective);
//# sourceMappingURL=ng_model_directive.js.map