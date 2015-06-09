/* */ 
var collection_1 = require("../../facade/collection");
var change_detection_1 = require("../../../change_detection");
var element_binder_1 = require("./element_binder");
var lang_1 = require("../../facade/lang");
var AppViewContainer = (function() {
  function AppViewContainer() {
    this.views = [];
    this.freeViews = [];
  }
  return AppViewContainer;
})();
exports.AppViewContainer = AppViewContainer;
var AppView = (function() {
  function AppView(renderer, proto, protoLocals) {
    this.renderer = renderer;
    this.proto = proto;
    this.render = null;
    this.changeDetector = null;
    this.elementInjectors = null;
    this.rootElementInjectors = null;
    this.componentChildViews = null;
    this.viewContainers = collection_1.ListWrapper.createFixedSize(this.proto.elementBinders.length);
    this.preBuiltObjects = null;
    this.context = null;
    this.locals = new change_detection_1.Locals(null, collection_1.MapWrapper.clone(protoLocals));
    this.freeHostViews = [];
  }
  AppView.prototype.init = function(changeDetector, elementInjectors, rootElementInjectors, preBuiltObjects, componentChildViews) {
    this.changeDetector = changeDetector;
    this.elementInjectors = elementInjectors;
    this.rootElementInjectors = rootElementInjectors;
    this.preBuiltObjects = preBuiltObjects;
    this.componentChildViews = componentChildViews;
  };
  AppView.prototype.setLocal = function(contextName, value) {
    if (!this.hydrated())
      throw new lang_1.BaseException('Cannot set locals on dehydrated view.');
    if (!collection_1.MapWrapper.contains(this.proto.variableBindings, contextName)) {
      return ;
    }
    var templateName = collection_1.MapWrapper.get(this.proto.variableBindings, contextName);
    this.locals.set(templateName, value);
  };
  AppView.prototype.hydrated = function() {
    return lang_1.isPresent(this.context);
  };
  AppView.prototype.triggerEventHandlers = function(eventName, eventObj, binderIndex) {
    var locals = collection_1.MapWrapper.create();
    collection_1.MapWrapper.set(locals, '$event', eventObj);
    this.dispatchEvent(binderIndex, eventName, locals);
  };
  AppView.prototype.notifyOnBinding = function(b, currentValue) {
    if (b.isElement()) {
      this.renderer.setElementProperty(this.render, b.elementIndex, b.propertyName, currentValue);
    } else {
      this.renderer.setText(this.render, b.elementIndex, currentValue);
    }
  };
  AppView.prototype.getDirectiveFor = function(directive) {
    var elementInjector = this.elementInjectors[directive.elementIndex];
    return elementInjector.getDirectiveAtIndex(directive.directiveIndex);
  };
  AppView.prototype.getDetectorFor = function(directive) {
    var childView = this.componentChildViews[directive.elementIndex];
    return lang_1.isPresent(childView) ? childView.changeDetector : null;
  };
  AppView.prototype.callAction = function(elementIndex, actionExpression, action) {
    this.renderer.callAction(this.render, elementIndex, actionExpression, action);
  };
  AppView.prototype.dispatchEvent = function(elementIndex, eventName, locals) {
    var _this = this;
    var allowDefaultBehavior = true;
    if (this.hydrated()) {
      var elBinder = this.proto.elementBinders[elementIndex];
      if (lang_1.isBlank(elBinder.hostListeners))
        return allowDefaultBehavior;
      var eventMap = elBinder.hostListeners[eventName];
      if (lang_1.isBlank(eventMap))
        return allowDefaultBehavior;
      collection_1.MapWrapper.forEach(eventMap, function(expr, directiveIndex) {
        var context;
        if (directiveIndex === -1) {
          context = _this.context;
        } else {
          context = _this.elementInjectors[elementIndex].getDirectiveAtIndex(directiveIndex);
        }
        var result = expr.eval(context, new change_detection_1.Locals(_this.locals, locals));
        if (lang_1.isPresent(result)) {
          allowDefaultBehavior = allowDefaultBehavior && result == true;
        }
      });
    }
    return allowDefaultBehavior;
  };
  return AppView;
})();
exports.AppView = AppView;
var AppProtoView = (function() {
  function AppProtoView(render, protoChangeDetector, variableBindings) {
    var _this = this;
    this.render = render;
    this.protoChangeDetector = protoChangeDetector;
    this.variableBindings = variableBindings;
    this.elementBinders = [];
    this.protoLocals = collection_1.MapWrapper.create();
    if (lang_1.isPresent(variableBindings)) {
      collection_1.MapWrapper.forEach(variableBindings, function(templateName, _) {
        collection_1.MapWrapper.set(_this.protoLocals, templateName, null);
      });
    }
  }
  AppProtoView.prototype.bindElement = function(parent, distanceToParent, protoElementInjector, componentDirective) {
    if (componentDirective === void 0) {
      componentDirective = null;
    }
    var elBinder = new element_binder_1.ElementBinder(this.elementBinders.length, parent, distanceToParent, protoElementInjector, componentDirective);
    collection_1.ListWrapper.push(this.elementBinders, elBinder);
    return elBinder;
  };
  AppProtoView.prototype.bindEvent = function(eventBindings, boundElementIndex, directiveIndex) {
    if (directiveIndex === void 0) {
      directiveIndex = -1;
    }
    var elBinder = this.elementBinders[boundElementIndex];
    var events = elBinder.hostListeners;
    if (lang_1.isBlank(events)) {
      events = collection_1.StringMapWrapper.create();
      elBinder.hostListeners = events;
    }
    for (var i = 0; i < eventBindings.length; i++) {
      var eventBinding = eventBindings[i];
      var eventName = eventBinding.fullName;
      var event = collection_1.StringMapWrapper.get(events, eventName);
      if (lang_1.isBlank(event)) {
        event = collection_1.MapWrapper.create();
        collection_1.StringMapWrapper.set(events, eventName, event);
      }
      collection_1.MapWrapper.set(event, directiveIndex, eventBinding.source);
    }
  };
  return AppProtoView;
})();
exports.AppProtoView = AppProtoView;
exports.__esModule = true;
