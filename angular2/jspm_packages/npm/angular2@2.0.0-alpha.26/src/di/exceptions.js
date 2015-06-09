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
var collection_1 = require("../facade/collection");
var lang_1 = require("../facade/lang");
function findFirstClosedCycle(keys) {
  var res = [];
  for (var i = 0; i < keys.length; ++i) {
    if (collection_1.ListWrapper.contains(res, keys[i])) {
      collection_1.ListWrapper.push(res, keys[i]);
      return res;
    } else {
      collection_1.ListWrapper.push(res, keys[i]);
    }
  }
  return res;
}
function constructResolvingPath(keys) {
  if (keys.length > 1) {
    var reversed = findFirstClosedCycle(collection_1.ListWrapper.reversed(keys));
    var tokenStrs = collection_1.ListWrapper.map(reversed, function(k) {
      return lang_1.stringify(k.token);
    });
    return " (" + tokenStrs.join(' -> ') + ")";
  } else {
    return "";
  }
}
var AbstractBindingError = (function(_super) {
  __extends(AbstractBindingError, _super);
  function AbstractBindingError(key, constructResolvingMessage) {
    _super.call(this);
    this.keys = [key];
    this.constructResolvingMessage = constructResolvingMessage;
    this.message = this.constructResolvingMessage(this.keys);
  }
  AbstractBindingError.prototype.addKey = function(key) {
    collection_1.ListWrapper.push(this.keys, key);
    this.message = this.constructResolvingMessage(this.keys);
  };
  AbstractBindingError.prototype.toString = function() {
    return this.message;
  };
  return AbstractBindingError;
})(lang_1.BaseException);
exports.AbstractBindingError = AbstractBindingError;
var NoBindingError = (function(_super) {
  __extends(NoBindingError, _super);
  function NoBindingError(key) {
    _super.call(this, key, function(keys) {
      var first = lang_1.stringify(collection_1.ListWrapper.first(keys).token);
      return "No provider for " + first + "!" + constructResolvingPath(keys);
    });
  }
  return NoBindingError;
})(AbstractBindingError);
exports.NoBindingError = NoBindingError;
var AsyncBindingError = (function(_super) {
  __extends(AsyncBindingError, _super);
  function AsyncBindingError(key) {
    _super.call(this, key, function(keys) {
      var first = lang_1.stringify(collection_1.ListWrapper.first(keys).token);
      return "Cannot instantiate " + first + " synchronously. It is provided as a promise!" + constructResolvingPath(keys);
    });
  }
  return AsyncBindingError;
})(AbstractBindingError);
exports.AsyncBindingError = AsyncBindingError;
var CyclicDependencyError = (function(_super) {
  __extends(CyclicDependencyError, _super);
  function CyclicDependencyError(key) {
    _super.call(this, key, function(keys) {
      return "Cannot instantiate cyclic dependency!" + constructResolvingPath(keys);
    });
  }
  return CyclicDependencyError;
})(AbstractBindingError);
exports.CyclicDependencyError = CyclicDependencyError;
var InstantiationError = (function(_super) {
  __extends(InstantiationError, _super);
  function InstantiationError(cause, key) {
    _super.call(this, key, function(keys) {
      var first = lang_1.stringify(collection_1.ListWrapper.first(keys).token);
      return "Error during instantiation of " + first + "!" + constructResolvingPath(keys) + ". ORIGINAL ERROR: " + cause;
    });
    this.cause = cause;
    this.causeKey = key;
  }
  return InstantiationError;
})(AbstractBindingError);
exports.InstantiationError = InstantiationError;
var InvalidBindingError = (function(_super) {
  __extends(InvalidBindingError, _super);
  function InvalidBindingError(binding) {
    _super.call(this);
    this.message = "Invalid binding - only instances of Binding and Type are allowed, got: " + binding.toString();
  }
  InvalidBindingError.prototype.toString = function() {
    return this.message;
  };
  return InvalidBindingError;
})(lang_1.BaseException);
exports.InvalidBindingError = InvalidBindingError;
var NoAnnotationError = (function(_super) {
  __extends(NoAnnotationError, _super);
  function NoAnnotationError(typeOrFunc) {
    _super.call(this);
    this.message = "Cannot resolve all parameters for " + lang_1.stringify(typeOrFunc) + ". " + 'Make sure they all have valid type or annotations.';
  }
  NoAnnotationError.prototype.toString = function() {
    return this.message;
  };
  return NoAnnotationError;
})(lang_1.BaseException);
exports.NoAnnotationError = NoAnnotationError;
exports.__esModule = true;
