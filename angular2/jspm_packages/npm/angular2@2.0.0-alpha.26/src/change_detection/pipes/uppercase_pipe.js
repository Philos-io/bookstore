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
var lang_1 = require("../../facade/lang");
var pipe_1 = require("./pipe");
var UpperCasePipe = (function(_super) {
  __extends(UpperCasePipe, _super);
  function UpperCasePipe() {
    _super.call(this);
    this._latestValue = null;
  }
  UpperCasePipe.prototype.supports = function(str) {
    return lang_1.isString(str);
  };
  UpperCasePipe.prototype.onDestroy = function() {
    this._latestValue = null;
  };
  UpperCasePipe.prototype.transform = function(value) {
    if (this._latestValue !== value) {
      this._latestValue = value;
      return lang_1.StringWrapper.toUpperCase(value);
    } else {
      return this._latestValue;
    }
  };
  return UpperCasePipe;
})(pipe_1.Pipe);
exports.UpperCasePipe = UpperCasePipe;
var UpperCaseFactory = (function() {
  function UpperCaseFactory() {}
  UpperCaseFactory.prototype.supports = function(str) {
    return lang_1.isString(str);
  };
  UpperCaseFactory.prototype.create = function() {
    return new UpperCasePipe();
  };
  return UpperCaseFactory;
})();
exports.UpperCaseFactory = UpperCaseFactory;
exports.__esModule = true;