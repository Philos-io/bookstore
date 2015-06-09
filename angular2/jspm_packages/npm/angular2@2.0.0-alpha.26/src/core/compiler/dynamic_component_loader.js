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
var di_1 = require("../../../di");
var compiler_1 = require("./compiler");
var lang_1 = require("../../facade/lang");
var view_manager_1 = require("./view_manager");
var element_ref_1 = require("./element_ref");
var ComponentRef = (function() {
  function ComponentRef(location, instance, dispose) {
    this.location = location;
    this.instance = instance;
    this.dispose = dispose;
  }
  Object.defineProperty(ComponentRef.prototype, "hostView", {
    get: function() {
      return this.location.parentView;
    },
    enumerable: true,
    configurable: true
  });
  return ComponentRef;
})();
exports.ComponentRef = ComponentRef;
var DynamicComponentLoader = (function() {
  function DynamicComponentLoader(compiler, viewManager) {
    this._compiler = compiler;
    this._viewManager = viewManager;
  }
  DynamicComponentLoader.prototype.loadIntoExistingLocation = function(typeOrBinding, location, injector) {
    var _this = this;
    if (injector === void 0) {
      injector = null;
    }
    var binding = this._getBinding(typeOrBinding);
    return this._compiler.compile(binding.token).then(function(componentProtoViewRef) {
      _this._viewManager.createDynamicComponentView(location, componentProtoViewRef, binding, injector);
      var component = _this._viewManager.getComponent(location);
      var dispose = function() {
        throw new lang_1.BaseException("Not implemented");
      };
      return new ComponentRef(location, component, dispose);
    });
  };
  DynamicComponentLoader.prototype.loadAsRoot = function(typeOrBinding, overrideSelector, injector) {
    var _this = this;
    if (overrideSelector === void 0) {
      overrideSelector = null;
    }
    if (injector === void 0) {
      injector = null;
    }
    return this._compiler.compileInHost(this._getBinding(typeOrBinding)).then(function(hostProtoViewRef) {
      var hostViewRef = _this._viewManager.createRootHostView(hostProtoViewRef, overrideSelector, injector);
      var newLocation = new element_ref_1.ElementRef(hostViewRef, 0);
      var component = _this._viewManager.getComponent(newLocation);
      var dispose = function() {
        _this._viewManager.destroyRootHostView(hostViewRef);
      };
      return new ComponentRef(newLocation, component, dispose);
    });
  };
  DynamicComponentLoader.prototype.loadIntoNewLocation = function(typeOrBinding, parentComponentLocation, injector) {
    var _this = this;
    if (injector === void 0) {
      injector = null;
    }
    return this._compiler.compileInHost(this._getBinding(typeOrBinding)).then(function(hostProtoViewRef) {
      var hostViewRef = _this._viewManager.createFreeHostView(parentComponentLocation, hostProtoViewRef, injector);
      var newLocation = new element_ref_1.ElementRef(hostViewRef, 0);
      var component = _this._viewManager.getComponent(newLocation);
      var dispose = function() {
        _this._viewManager.destroyFreeHostView(parentComponentLocation, hostViewRef);
      };
      return new ComponentRef(newLocation, component, dispose);
    });
  };
  DynamicComponentLoader.prototype.loadNextToExistingLocation = function(typeOrBinding, location, injector) {
    var _this = this;
    if (injector === void 0) {
      injector = null;
    }
    var binding = this._getBinding(typeOrBinding);
    return this._compiler.compileInHost(binding).then(function(hostProtoViewRef) {
      var viewContainer = _this._viewManager.getViewContainer(location);
      var hostViewRef = viewContainer.create(hostProtoViewRef, viewContainer.length, null, injector);
      var newLocation = new element_ref_1.ElementRef(hostViewRef, 0);
      var component = _this._viewManager.getComponent(newLocation);
      var dispose = function() {
        var index = viewContainer.indexOf(hostViewRef);
        viewContainer.remove(index);
      };
      return new ComponentRef(newLocation, component, dispose);
    });
  };
  DynamicComponentLoader.prototype._getBinding = function(typeOrBinding) {
    var binding;
    if (typeOrBinding instanceof di_1.Binding) {
      binding = typeOrBinding;
    } else {
      binding = di_1.bind(typeOrBinding).toClass(typeOrBinding);
    }
    return binding;
  };
  DynamicComponentLoader = __decorate([di_1.Injectable(), __metadata('design:paramtypes', [compiler_1.Compiler, view_manager_1.AppViewManager])], DynamicComponentLoader);
  return DynamicComponentLoader;
})();
exports.DynamicComponentLoader = DynamicComponentLoader;
exports.__esModule = true;
