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
var lang_1 = require("../facade/lang");
var collection_1 = require("../facade/collection");
var reflection_1 = require("../reflection/reflection");
var key_1 = require("./key");
var annotations_impl_1 = require("./annotations_impl");
var exceptions_1 = require("./exceptions");
var forward_ref_1 = require("./forward_ref");
var Dependency = (function() {
  function Dependency(key, asPromise, lazy, optional, properties) {
    this.key = key;
    this.asPromise = asPromise;
    this.lazy = lazy;
    this.optional = optional;
    this.properties = properties;
  }
  Dependency.fromKey = function(key) {
    return new Dependency(key, false, false, false, []);
  };
  return Dependency;
})();
exports.Dependency = Dependency;
var _EMPTY_LIST = [];
var Binding = (function() {
  function Binding(token, _a) {
    var toClass = _a.toClass,
        toValue = _a.toValue,
        toAlias = _a.toAlias,
        toFactory = _a.toFactory,
        toAsyncFactory = _a.toAsyncFactory,
        deps = _a.deps;
    this.token = token;
    this.toClass = toClass;
    this.toValue = toValue;
    this.toAlias = toAlias;
    this.toFactory = toFactory;
    this.toAsyncFactory = toAsyncFactory;
    this.dependencies = deps;
  }
  Binding.prototype.resolve = function() {
    var _this = this;
    var factoryFn;
    var resolvedDeps;
    var isAsync = false;
    if (lang_1.isPresent(this.toClass)) {
      var toClass = forward_ref_1.resolveForwardRef(this.toClass);
      factoryFn = reflection_1.reflector.factory(toClass);
      resolvedDeps = _dependenciesFor(toClass);
    } else if (lang_1.isPresent(this.toAlias)) {
      factoryFn = function(aliasInstance) {
        return aliasInstance;
      };
      resolvedDeps = [Dependency.fromKey(key_1.Key.get(this.toAlias))];
    } else if (lang_1.isPresent(this.toFactory)) {
      factoryFn = this.toFactory;
      resolvedDeps = _constructDependencies(this.toFactory, this.dependencies);
    } else if (lang_1.isPresent(this.toAsyncFactory)) {
      factoryFn = this.toAsyncFactory;
      resolvedDeps = _constructDependencies(this.toAsyncFactory, this.dependencies);
      isAsync = true;
    } else {
      factoryFn = function() {
        return _this.toValue;
      };
      resolvedDeps = _EMPTY_LIST;
    }
    return new ResolvedBinding(key_1.Key.get(this.token), factoryFn, resolvedDeps, isAsync);
  };
  Binding = __decorate([lang_1.CONST(), __metadata('design:paramtypes', [Object, Object])], Binding);
  return Binding;
})();
exports.Binding = Binding;
var ResolvedBinding = (function() {
  function ResolvedBinding(key, factory, dependencies, providedAsPromise) {
    this.key = key;
    this.factory = factory;
    this.dependencies = dependencies;
    this.providedAsPromise = providedAsPromise;
  }
  return ResolvedBinding;
})();
exports.ResolvedBinding = ResolvedBinding;
function bind(token) {
  return new BindingBuilder(token);
}
exports.bind = bind;
var BindingBuilder = (function() {
  function BindingBuilder(token) {
    this.token = token;
  }
  BindingBuilder.prototype.toClass = function(type) {
    return new Binding(this.token, {toClass: type});
  };
  BindingBuilder.prototype.toValue = function(value) {
    return new Binding(this.token, {toValue: value});
  };
  BindingBuilder.prototype.toAlias = function(aliasToken) {
    if (lang_1.isBlank(aliasToken)) {
      throw new lang_1.BaseException("Can not alias " + lang_1.stringify(this.token) + " to a blank value!");
    }
    return new Binding(this.token, {toAlias: aliasToken});
  };
  BindingBuilder.prototype.toFactory = function(factoryFunction, dependencies) {
    return new Binding(this.token, {
      toFactory: factoryFunction,
      deps: dependencies
    });
  };
  BindingBuilder.prototype.toAsyncFactory = function(factoryFunction, dependencies) {
    return new Binding(this.token, {
      toAsyncFactory: factoryFunction,
      deps: dependencies
    });
  };
  return BindingBuilder;
})();
exports.BindingBuilder = BindingBuilder;
function _constructDependencies(factoryFunction, dependencies) {
  return lang_1.isBlank(dependencies) ? _dependenciesFor(factoryFunction) : collection_1.ListWrapper.map(dependencies, function(t) {
    return _extractToken(factoryFunction, t);
  });
}
function _dependenciesFor(typeOrFunc) {
  var params = reflection_1.reflector.parameters(typeOrFunc);
  if (lang_1.isBlank(params))
    return [];
  if (collection_1.ListWrapper.any(params, function(p) {
    return lang_1.isBlank(p);
  })) {
    throw new exceptions_1.NoAnnotationError(typeOrFunc);
  }
  return collection_1.ListWrapper.map(params, function(p) {
    return _extractToken(typeOrFunc, p);
  });
}
function _extractToken(typeOrFunc, annotations) {
  var depProps = [];
  var token = null;
  var optional = false;
  var lazy = false;
  var asPromise = false;
  if (!collection_1.ListWrapper.isList(annotations)) {
    return _createDependency(annotations, asPromise, lazy, optional, depProps);
  }
  for (var i = 0; i < annotations.length; ++i) {
    var paramAnnotation = annotations[i];
    if (paramAnnotation instanceof lang_1.Type) {
      token = paramAnnotation;
    } else if (paramAnnotation instanceof annotations_impl_1.Inject) {
      token = paramAnnotation.token;
    } else if (paramAnnotation instanceof annotations_impl_1.InjectPromise) {
      token = paramAnnotation.token;
      asPromise = true;
    } else if (paramAnnotation instanceof annotations_impl_1.InjectLazy) {
      token = paramAnnotation.token;
      lazy = true;
    } else if (paramAnnotation instanceof annotations_impl_1.Optional) {
      optional = true;
    } else if (paramAnnotation instanceof annotations_impl_1.DependencyAnnotation) {
      if (lang_1.isPresent(paramAnnotation.token)) {
        token = paramAnnotation.token;
      }
      collection_1.ListWrapper.push(depProps, paramAnnotation);
    }
  }
  token = forward_ref_1.resolveForwardRef(token);
  if (lang_1.isPresent(token)) {
    return _createDependency(token, asPromise, lazy, optional, depProps);
  } else {
    throw new exceptions_1.NoAnnotationError(typeOrFunc);
  }
}
function _createDependency(token, asPromise, lazy, optional, depProps) {
  return new Dependency(key_1.Key.get(token), asPromise, lazy, optional, depProps);
}
exports.__esModule = true;
