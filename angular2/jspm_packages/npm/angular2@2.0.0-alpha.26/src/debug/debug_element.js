/* */ 
var lang_1 = require("../facade/lang");
var collection_1 = require("../facade/collection");
var dom_adapter_1 = require("../dom/dom_adapter");
var view_ref_1 = require("../core/compiler/view_ref");
var view_1 = require("../render/dom/view/view");
var DebugElement = (function() {
  function DebugElement(_parentView, _boundElementIndex) {
    this._parentView = _parentView;
    this._boundElementIndex = _boundElementIndex;
    this._elementInjector = this._parentView.elementInjectors[this._boundElementIndex];
  }
  DebugElement.create = function(elementRef) {
    return new DebugElement(view_ref_1.internalView(elementRef.parentView), elementRef.boundElementIndex);
  };
  Object.defineProperty(DebugElement.prototype, "componentInstance", {
    get: function() {
      if (!lang_1.isPresent(this._elementInjector)) {
        return null;
      }
      return this._elementInjector.getComponent();
    },
    enumerable: true,
    configurable: true
  });
  Object.defineProperty(DebugElement.prototype, "dynamicallyCreatedComponentInstance", {
    get: function() {
      if (!lang_1.isPresent(this._elementInjector)) {
        return null;
      }
      return this._elementInjector.getDynamicallyLoadedComponent();
    },
    enumerable: true,
    configurable: true
  });
  Object.defineProperty(DebugElement.prototype, "domElement", {
    get: function() {
      return view_1.resolveInternalDomView(this._parentView.render).boundElements[this._boundElementIndex];
    },
    enumerable: true,
    configurable: true
  });
  DebugElement.prototype.getDirectiveInstance = function(directiveIndex) {
    return this._elementInjector.getDirectiveAtIndex(directiveIndex);
  };
  Object.defineProperty(DebugElement.prototype, "children", {
    get: function() {
      var thisElementBinder = this._parentView.proto.elementBinders[this._boundElementIndex];
      return this._getChildElements(this._parentView, thisElementBinder.index);
    },
    enumerable: true,
    configurable: true
  });
  Object.defineProperty(DebugElement.prototype, "componentViewChildren", {
    get: function() {
      var shadowView = this._parentView.componentChildViews[this._boundElementIndex];
      if (!lang_1.isPresent(shadowView)) {
        return collection_1.ListWrapper.create();
      }
      return this._getChildElements(shadowView, null);
    },
    enumerable: true,
    configurable: true
  });
  DebugElement.prototype.triggerEventHandler = function(eventName, eventObj) {
    this._parentView.triggerEventHandlers(eventName, eventObj, this._boundElementIndex);
  };
  DebugElement.prototype.hasDirective = function(type) {
    if (!lang_1.isPresent(this._elementInjector)) {
      return false;
    }
    return this._elementInjector.hasDirective(type);
  };
  DebugElement.prototype.inject = function(type) {
    if (!lang_1.isPresent(this._elementInjector)) {
      return null;
    }
    return this._elementInjector.get(type);
  };
  DebugElement.prototype.query = function(predicate, scope) {
    if (scope === void 0) {
      scope = Scope.all;
    }
    var results = this.queryAll(predicate, scope);
    return results.length > 0 ? results[0] : null;
  };
  DebugElement.prototype.queryAll = function(predicate, scope) {
    if (scope === void 0) {
      scope = Scope.all;
    }
    var elementsInScope = scope(this);
    return collection_1.ListWrapper.filter(elementsInScope, predicate);
  };
  DebugElement.prototype._getChildElements = function(view, parentBoundElementIndex) {
    var _this = this;
    var els = collection_1.ListWrapper.create();
    var parentElementBinder = null;
    if (lang_1.isPresent(parentBoundElementIndex)) {
      parentElementBinder = view.proto.elementBinders[parentBoundElementIndex];
    }
    for (var i = 0; i < view.proto.elementBinders.length; ++i) {
      var binder = view.proto.elementBinders[i];
      if (binder.parent == parentElementBinder) {
        collection_1.ListWrapper.push(els, new DebugElement(view, i));
        var views = view.viewContainers[i];
        if (lang_1.isPresent(views)) {
          collection_1.ListWrapper.forEach(views.views, function(nextView) {
            els = collection_1.ListWrapper.concat(els, _this._getChildElements(nextView, null));
          });
        }
      }
    }
    return els;
  };
  return DebugElement;
})();
exports.DebugElement = DebugElement;
function inspectElement(elementRef) {
  return DebugElement.create(elementRef);
}
exports.inspectElement = inspectElement;
var Scope = (function() {
  function Scope() {}
  Scope.all = function(debugElement) {
    var scope = collection_1.ListWrapper.create();
    collection_1.ListWrapper.push(scope, debugElement);
    collection_1.ListWrapper.forEach(debugElement.children, function(child) {
      scope = collection_1.ListWrapper.concat(scope, Scope.all(child));
    });
    collection_1.ListWrapper.forEach(debugElement.componentViewChildren, function(child) {
      scope = collection_1.ListWrapper.concat(scope, Scope.all(child));
    });
    return scope;
  };
  Scope.light = function(debugElement) {
    var scope = collection_1.ListWrapper.create();
    collection_1.ListWrapper.forEach(debugElement.children, function(child) {
      collection_1.ListWrapper.push(scope, child);
      scope = collection_1.ListWrapper.concat(scope, Scope.light(child));
    });
    return scope;
  };
  Scope.view = function(debugElement) {
    var scope = collection_1.ListWrapper.create();
    collection_1.ListWrapper.forEach(debugElement.componentViewChildren, function(child) {
      collection_1.ListWrapper.push(scope, child);
      scope = collection_1.ListWrapper.concat(scope, Scope.light(child));
    });
    return scope;
  };
  return Scope;
})();
exports.Scope = Scope;
var By = (function() {
  function By() {}
  By.all = function() {
    return function(debugElement) {
      return true;
    };
  };
  By.css = function(selector) {
    return function(debugElement) {
      return dom_adapter_1.DOM.elementMatches(debugElement.domElement, selector);
    };
  };
  By.directive = function(type) {
    return function(debugElement) {
      return debugElement.hasDirective(type);
    };
  };
  return By;
})();
exports.By = By;
exports.__esModule = true;
