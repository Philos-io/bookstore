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
 * The accessor for writing a value and listening to changes on a checkbox input element.
 *
 *
 *  # Example
 *  ```
 *  <input type="checkbox" [ng-control]="rememberLogin">
 *  ```
 *
 * @exportedAs angular2/forms
 */
export let CheckboxControlValueAccessor = class {
    constructor(cd) {
        this.cd = cd;
        this.onChange = (_) => { };
        this.onTouched = (_) => { };
        cd.valueAccessor = this;
    }
    writeValue(value) { this.checked = value; }
    registerOnChange(fn) { this.onChange = fn; }
    registerOnTouched(fn) { this.onTouched = fn; }
};
CheckboxControlValueAccessor = __decorate([
    Directive({
        selector: 'input[type=checkbox][ng-control],input[type=checkbox][ng-form-control],input[type=checkbox][ng-model]',
        hostListeners: { 'change': 'onChange($event.target.checked)', 'blur': 'onTouched()' },
        hostProperties: {
            'checked': 'checked',
            'cd.control?.untouched == true': 'class.ng-untouched',
            'cd.control?.touched == true': 'class.ng-touched',
            'cd.control?.pristine == true': 'class.ng-pristine',
            'cd.control?.dirty == true': 'class.ng-dirty',
            'cd.control?.valid == true': 'class.ng-valid',
            'cd.control?.valid == false': 'class.ng-invalid'
        }
    }), 
    __metadata('design:paramtypes', [ControlDirective])
], CheckboxControlValueAccessor);
//# sourceMappingURL=checkbox_value_accessor.js.map