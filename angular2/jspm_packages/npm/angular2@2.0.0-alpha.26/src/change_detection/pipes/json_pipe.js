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
var lang_1 = require("../../facade/lang");
var pipe_1 = require("./pipe");
var JsonPipe = (function(_super) {
  __extends(JsonPipe, _super);
  function JsonPipe() {
    _super.call(this);
    this._latestRef = null;
    this._latestValue = null;
  }
  JsonPipe.prototype.onDestroy = function() {
    if (lang_1.isPresent(this._latestValue)) {
      this._latestRef = null;
      this._latestValue = null;
    }
  };
  JsonPipe.prototype.supports = function(obj) {
    return true;
  };
  JsonPipe.prototype.transform = function(value) {
    if (value === this._latestRef) {
      return this._latestValue;
    } else {
      return this._prettyPrint(value);
    }
  };
  JsonPipe.prototype._prettyPrint = function(value) {
    this._latestRef = value;
    this._latestValue = lang_1.Json.stringify(value);
    return this._latestValue;
  };
  return JsonPipe;
})(pipe_1.Pipe);
exports.JsonPipe = JsonPipe;
var JsonPipeFactory = (function(_super) {
  __extends(JsonPipeFactory, _super);
  function JsonPipeFactory() {
    _super.call(this);
  }
  JsonPipeFactory.prototype.supports = function(obj) {
    return true;
  };
  JsonPipeFactory.prototype.create = function(cdRef) {
    return new JsonPipe();
  };
  JsonPipeFactory = __decorate([lang_1.CONST(), __metadata('design:paramtypes', [])], JsonPipeFactory);
  return JsonPipeFactory;
})(pipe_1.PipeFactory);
exports.JsonPipeFactory = JsonPipeFactory;
exports.__esModule = true;
