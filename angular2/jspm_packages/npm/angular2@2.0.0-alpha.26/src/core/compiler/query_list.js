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
var base_query_list_1 = require("./base_query_list");
var QueryList = (function(_super) {
  __extends(QueryList, _super);
  function QueryList() {
    _super.apply(this, arguments);
  }
  QueryList.prototype.onChange = function(callback) {
    return _super.prototype.onChange.call(this, callback);
  };
  QueryList.prototype.removeCallback = function(callback) {
    return _super.prototype.removeCallback.call(this, callback);
  };
  return QueryList;
})(base_query_list_1.BaseQueryList);
exports.QueryList = QueryList;
exports.__esModule = true;
