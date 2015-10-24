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
var async_1 = require("../../facade/async");
var collection_1 = require("../../facade/collection");
var angular2_1 = require("../../../angular2");
var di_1 = require("../../../di");
var control_directive_1 = require("./control_directive");
var model_1 = require("../model");
var shared_1 = require("./shared");
var formControlBinding = lang_1.CONST_EXPR(new di_1.Binding(control_directive_1.ControlDirective, {toAlias: di_1.FORWARD_REF(function() {
    return NgModelDirective;
  })}));
var NgModelDirective = (function(_super) {
  __extends(NgModelDirective, _super);
  function NgModelDirective() {
    _super.call(this);
    this.control = new model_1.Control("");
    this.ngModel = new async_1.EventEmitter();
    this._added = false;
  }
  NgModelDirective.prototype.onChange = function(c) {
    if (!this._added) {
      shared_1.setUpControl(this.control, this);
      this.control.updateValidity();
      this._added = true;
    }
    ;
    if (collection_1.StringMapWrapper.contains(c, "model")) {
      this.control.updateValue(this.model);
    }
  };
  Object.defineProperty(NgModelDirective.prototype, "path", {
    get: function() {
      return [];
    },
    enumerable: true,
    configurable: true
  });
  NgModelDirective.prototype.viewToModelUpdate = function(newValue) {
    async_1.ObservableWrapper.callNext(this.ngModel, newValue);
  };
  NgModelDirective = __decorate([angular2_1.Directive({
    selector: '[ng-model]:not([ng-control]):not([ng-form-control])',
    hostInjector: [formControlBinding],
    properties: ['model: ng-model'],
    events: ['ngModel'],
    lifecycle: [angular2_1.onChange]
  }), __metadata('design:paramtypes', [])], NgModelDirective);
  return NgModelDirective;
})(control_directive_1.ControlDirective);
exports.NgModelDirective = NgModelDirective;
exports.__esModule = true;
