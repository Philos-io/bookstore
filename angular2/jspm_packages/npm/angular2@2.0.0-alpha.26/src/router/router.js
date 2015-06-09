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
var async_1 = require("../facade/async");
var collection_1 = require("../facade/collection");
var lang_1 = require("../facade/lang");
var Router = (function() {
  function Router(_registry, _pipeline, parent, hostComponent) {
    this._registry = _registry;
    this._pipeline = _pipeline;
    this.parent = parent;
    this.hostComponent = hostComponent;
    this.navigating = false;
    this.previousUrl = null;
    this._outlets = collection_1.MapWrapper.create();
    this._subject = new async_1.EventEmitter();
    this._currentInstruction = null;
  }
  Router.prototype.childRouter = function(hostComponent) {
    return new ChildRouter(this, hostComponent);
  };
  Router.prototype.registerOutlet = function(outlet, name) {
    if (name === void 0) {
      name = 'default';
    }
    collection_1.MapWrapper.set(this._outlets, name, outlet);
    if (lang_1.isPresent(this._currentInstruction)) {
      var childInstruction = this._currentInstruction.getChild(name);
      return outlet.activate(childInstruction);
    }
    return async_1.PromiseWrapper.resolve(true);
  };
  Router.prototype.config = function(config) {
    var _this = this;
    if (config instanceof collection_1.List) {
      config.forEach(function(configObject) {
        _this._registry.config(_this.hostComponent, configObject);
      });
    } else {
      this._registry.config(this.hostComponent, config);
    }
    return this.renavigate();
  };
  Router.prototype.navigate = function(url) {
    var _this = this;
    if (this.navigating) {
      return async_1.PromiseWrapper.resolve(true);
    }
    this.lastNavigationAttempt = url;
    var matchedInstruction = this.recognize(url);
    if (lang_1.isBlank(matchedInstruction)) {
      return async_1.PromiseWrapper.resolve(false);
    }
    if (lang_1.isPresent(this._currentInstruction)) {
      matchedInstruction.reuseComponentsFrom(this._currentInstruction);
    }
    this._startNavigating();
    var result = this.commit(matchedInstruction).then(function(_) {
      async_1.ObservableWrapper.callNext(_this._subject, matchedInstruction.accumulatedUrl);
      _this._finishNavigating();
    });
    async_1.PromiseWrapper.catchError(result, function(_) {
      return _this._finishNavigating();
    });
    return result;
  };
  Router.prototype._startNavigating = function() {
    this.navigating = true;
  };
  Router.prototype._finishNavigating = function() {
    this.navigating = false;
  };
  Router.prototype.subscribe = function(onNext) {
    async_1.ObservableWrapper.subscribe(this._subject, onNext);
  };
  Router.prototype.commit = function(instruction) {
    var _this = this;
    this._currentInstruction = instruction;
    var toDeactivate = collection_1.ListWrapper.create();
    collection_1.MapWrapper.forEach(this._outlets, function(outlet, outletName) {
      if (!instruction.hasChild(outletName)) {
        collection_1.MapWrapper.delete(_this._outlets, outletName);
        collection_1.ListWrapper.push(toDeactivate, outlet);
      }
    });
    return async_1.PromiseWrapper.all(collection_1.ListWrapper.map(toDeactivate, function(outlet) {
      return outlet.deactivate();
    })).then(function(_) {
      return _this.activate(instruction);
    });
  };
  Router.prototype.deactivate = function() {
    return this._eachOutletAsync(function(outlet) {
      return outlet.deactivate;
    });
  };
  Router.prototype.activate = function(instruction) {
    return this._eachOutletAsync(function(outlet, name) {
      return outlet.activate(instruction.getChild(name));
    });
  };
  Router.prototype._eachOutletAsync = function(fn) {
    return mapObjAsync(this._outlets, fn);
  };
  Router.prototype.recognize = function(url) {
    return this._registry.recognize(url, this.hostComponent);
  };
  Router.prototype.renavigate = function() {
    var destination = lang_1.isBlank(this.previousUrl) ? this.lastNavigationAttempt : this.previousUrl;
    if (this.navigating || lang_1.isBlank(destination)) {
      return async_1.PromiseWrapper.resolve(false);
    }
    return this.navigate(destination);
  };
  Router.prototype.generate = function(name, params) {
    return this._registry.generate(name, params, this.hostComponent);
  };
  return Router;
})();
exports.Router = Router;
var RootRouter = (function(_super) {
  __extends(RootRouter, _super);
  function RootRouter(registry, pipeline, location, hostComponent) {
    var _this = this;
    _super.call(this, registry, pipeline, null, hostComponent);
    this._location = location;
    this._location.subscribe(function(change) {
      return _this.navigate(change['url']);
    });
    this._registry.configFromComponent(hostComponent);
    this.navigate(location.path());
  }
  RootRouter.prototype.commit = function(instruction) {
    var _this = this;
    return _super.prototype.commit.call(this, instruction).then(function(_) {
      _this._location.go(instruction.accumulatedUrl);
    });
  };
  return RootRouter;
})(Router);
exports.RootRouter = RootRouter;
var ChildRouter = (function(_super) {
  __extends(ChildRouter, _super);
  function ChildRouter(parent, hostComponent) {
    _super.call(this, parent._registry, parent._pipeline, parent, hostComponent);
    this.parent = parent;
  }
  return ChildRouter;
})(Router);
function mapObjAsync(obj, fn) {
  return async_1.PromiseWrapper.all(mapObj(obj, fn));
}
function mapObj(obj, fn) {
  var result = collection_1.ListWrapper.create();
  collection_1.MapWrapper.forEach(obj, function(value, key) {
    return collection_1.ListWrapper.push(result, fn(value, key));
  });
  return result;
}
exports.__esModule = true;
