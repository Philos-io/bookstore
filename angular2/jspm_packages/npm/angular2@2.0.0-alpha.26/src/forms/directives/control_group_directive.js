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
var __param = (this && this.__param) || function(paramIndex, decorator) {
  return function(target, key) {
    decorator(target, key, paramIndex);
  };
};
var angular2_1 = require("../../../angular2");
var di_1 = require("../../../di");
var lang_1 = require("../../facade/lang");
var control_container_directive_1 = require("./control_container_directive");
var shared_1 = require("./shared");
var controlGroupBinding = lang_1.CONST_EXPR(new di_1.Binding(control_container_directive_1.ControlContainerDirective, {toAlias: di_1.FORWARD_REF(function() {
    return ControlGroupDirective;
  })}));
var ControlGroupDirective = (function(_super) {
  __extends(ControlGroupDirective, _super);
  function ControlGroupDirective(_parent) {
    _super.call(this);
    this._parent = _parent;
  }
  ControlGroupDirective.prototype.onInit = function() {
    this.formDirective.addControlGroup(this);
  };
  ControlGroupDirective.prototype.onDestroy = function() {
    this.formDirective.removeControlGroup(this);
  };
  Object.defineProperty(ControlGroupDirective.prototype, "path", {
    get: function() {
      return shared_1.controlPath(this.name, this._parent);
    },
    enumerable: true,
    configurable: true
  });
  Object.defineProperty(ControlGroupDirective.prototype, "formDirective", {
    get: function() {
      return this._parent.formDirective;
    },
    enumerable: true,
    configurable: true
  });
  ControlGroupDirective = __decorate([angular2_1.Directive({
    selector: '[ng-control-group]',
    hostInjector: [controlGroupBinding],
    properties: ['name: ng-control-group'],
    lifecycle: [angular2_1.onInit, angular2_1.onDestroy]
  }), __param(0, angular2_1.Ancestor()), __metadata('design:paramtypes', [control_container_directive_1.ControlContainerDirective])], ControlGroupDirective);
  return ControlGroupDirective;
})(control_container_directive_1.ControlContainerDirective);
exports.ControlGroupDirective = ControlGroupDirective;
exports.__esModule = true;
