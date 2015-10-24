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
import { Directive } from 'angular2/angular2';
import { ControlDirective } from './control_directive';
/**
 * The accessor for writing a value and listening to changes that is used by a
 * {@link Control} directive.
 *
 * This is the default strategy that Angular uses when no other accessor is applied.
 *
 *  # Example
 *  ```
 *  <input type="text" [ng-control]="loginControl">
 *  ```
 *
 * @exportedAs angular2/forms
 */
export let SelectControlValueAccessor = class {
    constructor(cd) {
        this.cd = cd;
        this.value = null;
        this.onChange = (_) => { };
        this.onTouched = (_) => { };
        this.value = '';
        cd.valueAccessor = this;
    }
    writeValue(value) { this.value = value; }
    registerOnChange(fn) { this.onChange = fn; }
    registerOnTouched(fn) { this.onTouched = fn; }
};
SelectControlValueAccessor = __decorate([
    Directive({
        selector: 'select[ng-control],select[ng-form-control],select[ng-model]',
        hostListeners: {
            'change': 'onChange($event.target.value)',
            'input': 'onChange($event.target.value)',
            'blur': 'onTouched()'
        },
        hostProperties: {
            'value': 'value',
            'cd.control?.untouched == true': 'class.ng-untouched',
            'cd.control?.touched == true': 'class.ng-touched',
            'cd.control?.pristine == true': 'class.ng-pristine',
            'cd.control?.dirty == true': 'class.ng-dirty',
            'cd.control?.valid == true': 'class.ng-valid',
            'cd.control?.valid == false': 'class.ng-invalid'
        }
    }), 
    __metadata('design:paramtypes', [ControlDirective])
], SelectControlValueAccessor);
//# sourceMappingURL=select_control_value_accessor.js.map