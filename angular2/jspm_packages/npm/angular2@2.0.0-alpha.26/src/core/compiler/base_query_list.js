/* */ 
var collection_1 = require("../../facade/collection");
var BaseQueryList = (function() {
  function BaseQueryList() {
    this._results = [];
    this._callbacks = [];
    this._dirty = false;
  }
  BaseQueryList.prototype[Symbol.iterator] = function() {
    return this._results[Symbol.iterator]();
  };
  BaseQueryList.prototype.reset = function(newList) {
    this._results = newList;
    this._dirty = true;
  };
  BaseQueryList.prototype.add = function(obj) {
    collection_1.ListWrapper.push(this._results, obj);
    this._dirty = true;
  };
  BaseQueryList.prototype.fireCallbacks = function() {
    if (this._dirty) {
      collection_1.ListWrapper.forEach(this._callbacks, function(c) {
        return c();
      });
      this._dirty = false;
    }
  };
  BaseQueryList.prototype.onChange = function(callback) {
    collection_1.ListWrapper.push(this._callbacks, callback);
  };
  BaseQueryList.prototype.removeCallback = function(callback) {
    collection_1.ListWrapper.remove(this._callbacks, callback);
  };
  return BaseQueryList;
})();
exports.BaseQueryList = BaseQueryList;
exports.__esModule = true;
