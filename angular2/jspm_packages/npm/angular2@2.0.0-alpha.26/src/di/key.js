/* */ 
var collection_1 = require("../facade/collection");
var lang_1 = require("../facade/lang");
var type_literal_1 = require("./type_literal");
var forward_ref_1 = require("./forward_ref");
var type_literal_2 = require("./type_literal");
exports.TypeLiteral = type_literal_2.TypeLiteral;
var Key = (function() {
  function Key(token, id) {
    if (lang_1.isBlank(token)) {
      throw new lang_1.BaseException('Token must be defined!');
    }
    this.token = token;
    this.id = id;
  }
  Object.defineProperty(Key.prototype, "displayName", {
    get: function() {
      return lang_1.stringify(this.token);
    },
    enumerable: true,
    configurable: true
  });
  Key.get = function(token) {
    return _globalKeyRegistry.get(forward_ref_1.resolveForwardRef(token));
  };
  Object.defineProperty(Key, "numberOfKeys", {
    get: function() {
      return _globalKeyRegistry.numberOfKeys;
    },
    enumerable: true,
    configurable: true
  });
  return Key;
})();
exports.Key = Key;
var KeyRegistry = (function() {
  function KeyRegistry() {
    this._allKeys = collection_1.MapWrapper.create();
  }
  KeyRegistry.prototype.get = function(token) {
    if (token instanceof Key)
      return token;
    var theToken = token;
    if (token instanceof type_literal_1.TypeLiteral) {
      theToken = token.type;
    }
    token = theToken;
    if (collection_1.MapWrapper.contains(this._allKeys, token)) {
      return collection_1.MapWrapper.get(this._allKeys, token);
    }
    var newKey = new Key(token, Key.numberOfKeys);
    collection_1.MapWrapper.set(this._allKeys, token, newKey);
    return newKey;
  };
  Object.defineProperty(KeyRegistry.prototype, "numberOfKeys", {
    get: function() {
      return collection_1.MapWrapper.size(this._allKeys);
    },
    enumerable: true,
    configurable: true
  });
  return KeyRegistry;
})();
exports.KeyRegistry = KeyRegistry;
var _globalKeyRegistry = new KeyRegistry();
exports.__esModule = true;
