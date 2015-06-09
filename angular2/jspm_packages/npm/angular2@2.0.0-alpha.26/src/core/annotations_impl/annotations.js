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
var annotations_impl_1 = require("../../di/annotations_impl");
var change_detection_1 = require("../../../change_detection");
var Directive = (function(_super) {
  __extends(Directive, _super);
  function Directive(_a) {
    var _b = _a === void 0 ? {} : _a,
        selector = _b.selector,
        properties = _b.properties,
        events = _b.events,
        hostListeners = _b.hostListeners,
        hostProperties = _b.hostProperties,
        hostAttributes = _b.hostAttributes,
        hostActions = _b.hostActions,
        lifecycle = _b.lifecycle,
        hostInjector = _b.hostInjector,
        _c = _b.compileChildren,
        compileChildren = _c === void 0 ? true : _c;
    _super.call(this);
    this.selector = selector;
    this.properties = properties;
    this.events = events;
    this.hostListeners = hostListeners;
    this.hostProperties = hostProperties;
    this.hostAttributes = hostAttributes;
    this.hostActions = hostActions;
    this.lifecycle = lifecycle;
    this.compileChildren = compileChildren;
    this.hostInjector = hostInjector;
  }
  Directive = __decorate([lang_1.CONST(), __metadata('design:paramtypes', [Object])], Directive);
  return Directive;
})(annotations_impl_1.Injectable);
exports.Directive = Directive;
var Component = (function(_super) {
  __extends(Component, _super);
  function Component(_a) {
    var _b = _a === void 0 ? {} : _a,
        selector = _b.selector,
        properties = _b.properties,
        events = _b.events,
        hostListeners = _b.hostListeners,
        hostProperties = _b.hostProperties,
        hostAttributes = _b.hostAttributes,
        hostActions = _b.hostActions,
        appInjector = _b.appInjector,
        lifecycle = _b.lifecycle,
        hostInjector = _b.hostInjector,
        viewInjector = _b.viewInjector,
        _c = _b.changeDetection,
        changeDetection = _c === void 0 ? change_detection_1.DEFAULT : _c,
        _d = _b.compileChildren,
        compileChildren = _d === void 0 ? true : _d;
    _super.call(this, {
      selector: selector,
      properties: properties,
      events: events,
      hostListeners: hostListeners,
      hostProperties: hostProperties,
      hostAttributes: hostAttributes,
      hostActions: hostActions,
      hostInjector: hostInjector,
      lifecycle: lifecycle,
      compileChildren: compileChildren
    });
    this.changeDetection = changeDetection;
    this.appInjector = appInjector;
    this.viewInjector = viewInjector;
  }
  Component = __decorate([lang_1.CONST(), __metadata('design:paramtypes', [Object])], Component);
  return Component;
})(Directive);
exports.Component = Component;
var LifecycleEvent = (function() {
  function LifecycleEvent(name) {
    this.name = name;
  }
  LifecycleEvent = __decorate([lang_1.CONST(), __metadata('design:paramtypes', [String])], LifecycleEvent);
  return LifecycleEvent;
})();
exports.LifecycleEvent = LifecycleEvent;
exports.onDestroy = lang_1.CONST_EXPR(new LifecycleEvent("onDestroy"));
exports.onChange = lang_1.CONST_EXPR(new LifecycleEvent("onChange"));
exports.onCheck = lang_1.CONST_EXPR(new LifecycleEvent("onCheck"));
exports.onInit = lang_1.CONST_EXPR(new LifecycleEvent("onInit"));
exports.onAllChangesDone = lang_1.CONST_EXPR(new LifecycleEvent("onAllChangesDone"));
exports.__esModule = true;
