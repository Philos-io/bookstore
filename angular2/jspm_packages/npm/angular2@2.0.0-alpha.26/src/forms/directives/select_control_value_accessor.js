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
var SelectControlValueAccessor = (function() {
  function SelectControlValueAccessor(cd) {
    this.cd = cd;
    this.value = null;
    this.onChange = function(_) {};
    this.onTouched = function(_) {};
    this.value = '';
    cd.valueAccessor = this;
  }
  SelectControlValueAccessor.prototype.writeValue = function(value) {
    this.value = value;
  };
  SelectControlValueAccessor.prototype.registerOnChange = function(fn) {
    this.onChange = fn;
  };
  SelectControlValueAccessor.prototype.registerOnTouched = function(fn) {
    this.onTouched = fn;
  };
  SelectControlValueAccessor = __decorate([angular2_1.Directive({
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
  }), __metadata('design:paramtypes', [control_directive_1.ControlDirective])], SelectControlValueAccessor);
  return SelectControlValueAccessor;
})();
exports.SelectControlValueAccessor = SelectControlValueAccessor;
exports.__esModule = true;
