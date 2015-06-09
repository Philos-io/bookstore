/* */ 
var __extends = (this && this.__extends) || function(d, b) {
  for (var p in b)
    if (b.hasOwnProperty(p))
      d[p] = b[p];
  function __() {
    this.constructor = d;
  }
  __.prototype = b.prototype;
  d.prototype = new __();
};
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
var lang_1 = require("../../facade/lang");
var collection_1 = require("../../facade/collection");
var async_1 = require("../../facade/async");
var angular2_1 = require("../../../angular2");
var di_1 = require("../../../di");
var control_directive_1 = require("./control_directive");
var shared_1 = require("./shared");
var formControlBinding = lang_1.CONST_EXPR(new di_1.Binding(control_directive_1.ControlDirective, {toAlias: di_1.FORWARD_REF(function() {
    return FormControlDirective;
  })}));
var FormControlDirective = (function(_super) {
  __extends(FormControlDirective, _super);
  function FormControlDirective() {
    _super.call(this);
    this.ngModel = new async_1.EventEmitter();
    this._added = false;
  }
  FormControlDirective.prototype.onChange = function(c) {
    if (!this._added) {
      shared_1.setUpControl(this.form, this);
      this.form.updateValidity();
      this._added = true;
    }
    if (collection_1.StringMapWrapper.contains(c, "model")) {
      this.form.updateValue(this.model);
    }
  };
  Object.defineProperty(FormControlDirective.prototype, "control", {
    get: function() {
      return this.form;
    },
    enumerable: true,
    configurable: true
  });
  Object.defineProperty(FormControlDirective.prototype, "path", {
    get: function() {
      return [];
    },
    enumerable: true,
    configurable: true
  });
  FormControlDirective.prototype.viewToModelUpdate = function(newValue) {
    async_1.ObservableWrapper.callNext(this.ngModel, newValue);
  };
  FormControlDirective = __decorate([angular2_1.Directive({
    selector: '[ng-form-control]',
    hostInjector: [formControlBinding],
    properties: ['form: ng-form-control', 'model: ng-model'],
    events: ['ngModel'],
    lifecycle: [angular2_1.onChange]
  }), __metadata('design:paramtypes', [])], FormControlDirective);
  return FormControlDirective;
})(control_directive_1.ControlDirective);
exports.FormControlDirective = FormControlDirective;
exports.__esModule = true;
