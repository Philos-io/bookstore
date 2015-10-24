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
var __param = (this && this.__param) || function(paramIndex, decorator) {
  return function(target, key) {
    decorator(target, key, paramIndex);
  };
};
var async_1 = require("../facade/async");
var lang_1 = require("../facade/lang");
var decorators_1 = require("../core/annotations/decorators");
var core_1 = require("../../core");
var di_1 = require("../../di");
var routerMod = require("./router");
var instruction_1 = require("./instruction");
var RouterOutlet = (function() {
  function RouterOutlet(elementRef, _loader, _parentRouter, _injector, nameAttr) {
    this._loader = _loader;
    this._parentRouter = _parentRouter;
    this._injector = _injector;
    if (lang_1.isBlank(nameAttr)) {
      nameAttr = 'default';
    }
    this._elementRef = elementRef;
    this._childRouter = null;
    this._componentRef = null;
    this._currentInstruction = null;
    this._parentRouter.registerOutlet(this, nameAttr);
  }
  RouterOutlet.prototype.activate = function(instruction) {
    var _this = this;
    if ((instruction == this._currentInstruction) || instruction.reuse && lang_1.isPresent(this._childRouter)) {
      return this._childRouter.commit(instruction);
    }
    this._currentInstruction = instruction;
    this._childRouter = this._parentRouter.childRouter(instruction.component);
    var outletInjector = this._injector.resolveAndCreateChild([di_1.bind(instruction_1.RouteParams).toValue(new instruction_1.RouteParams(instruction.params)), di_1.bind(routerMod.Router).toValue(this._childRouter)]);
    if (lang_1.isPresent(this._componentRef)) {
      this._componentRef.dispose();
    }
    return this._loader.loadNextToExistingLocation(instruction.component, this._elementRef, outletInjector).then(function(componentRef) {
      _this._componentRef = componentRef;
      return _this._childRouter.commit(instruction);
    });
  };
  RouterOutlet.prototype.deactivate = function() {
    var _this = this;
    return (lang_1.isPresent(this._childRouter) ? this._childRouter.deactivate() : async_1.PromiseWrapper.resolve(true)).then(function(_) {
      return _this._componentRef.dispose();
    });
  };
  RouterOutlet.prototype.canDeactivate = function(instruction) {
    return async_1.PromiseWrapper.resolve(true);
  };
  RouterOutlet = __decorate([decorators_1.Directive({selector: 'router-outlet'}), __param(4, decorators_1.Attribute('name')), __metadata('design:paramtypes', [core_1.ElementRef, core_1.DynamicComponentLoader, routerMod.Router, di_1.Injector, String])], RouterOutlet);
  return RouterOutlet;
})();
exports.RouterOutlet = RouterOutlet;
exports.__esModule = true;
