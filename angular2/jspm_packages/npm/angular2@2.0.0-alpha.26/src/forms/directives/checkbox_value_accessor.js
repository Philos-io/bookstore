/* */ 
var __decorate = (this && this.__decorate) || function(decorators, target, key, desc) {
  if (typeof Reflect === "object" && typeof Reflect.decorate === "function")
    return Reflect.decorate(decorators, target, key, desc);
  switch (arguments.length) {
    case 2:
      return decorators.reduceRight(function(o, d) {
        return (d && d(o)) || o;
      }, target);
    case 3:
      return decorators.reduceRight(function(o, d) {
        return (d && d(target, key)), void 0;
      }, void 0);
    case 4:
      return decorators.reduceRight(function(o, d) {
        return (d && d(target, key, o)) || o;
      }, desc);
  }
};
var __metadata = (this && this.__metadata) || function(k, v) {
  if (typeof Reflect === "object" && typeof Reflect.metadata === "function")
    return Reflect.metadata(k, v);
};
var angular2_1 = require("../../../angular2");
var control_directive_1 = require("./control_directive");
var CheckboxControlValueAccessor = (function() {
  function CheckboxControlValueAccessor(cd) {
    this.cd = cd;
    this.onChange = function(_) {};
    this.onTouched = function(_) {};
    cd.valueAccessor = this;
  }
  CheckboxControlValueAccessor.prototype.writeValue = function(value) {
    this.checked = value;
  };
  CheckboxControlValueAccessor.prototype.registerOnChange = function(fn) {
    this.onChange = fn;
  };
  CheckboxControlValueAccessor.prototype.registerOnTouched = function(fn) {
    this.onTouched = fn;
  };
  CheckboxControlValueAccessor = __decorate([angular2_1.Directive({
    selector: 'input[type=checkbox][ng-control],input[type=checkbox][ng-form-control],input[type=checkbox][ng-model]',
    hostListeners: {
      'change': 'onChange($event.target.checked)',
      'blur': 'onTouched()'
    },
    hostProperties: {
      'checked': 'checked',
      'cd.control?.untouched == true': 'class.ng-untouched',
      'cd.control?.touched == true': 'class.ng-touched',
      'cd.control?.pristine == true': 'class.ng-pristine',
      'cd.control?.dirty == true': 'class.ng-dirty',
      'cd.control?.valid == true': 'class.ng-valid',
      'cd.control?.valid == false': 'class.ng-invalid'
    }
  }), __metadata('design:paramtypes', [control_directive_1.ControlDirective])], CheckboxControlValueAccessor);
  return CheckboxControlValueAccessor;
})();
exports.CheckboxControlValueAccessor = CheckboxControlValueAccessor;
exports.__esModule = true;
