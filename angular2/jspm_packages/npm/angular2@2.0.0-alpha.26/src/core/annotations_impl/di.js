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
var annotations_impl_1 = require("../../di/annotations_impl");
var Attribute = (function(_super) {
  __extends(Attribute, _super);
  function Attribute(attributeName) {
    _super.call(this);
    this.attributeName = attributeName;
  }
  Object.defineProperty(Attribute.prototype, "token", {
    get: function() {
      return this;
    },
    enumerable: true,
    configurable: true
  });
  Attribute = __decorate([lang_1.CONST(), __metadata('design:paramtypes', [String])], Attribute);
  return Attribute;
})(annotations_impl_1.DependencyAnnotation);
exports.Attribute = Attribute;
var Query = (function(_super) {
  __extends(Query, _super);
  function Query(directive) {
    _super.call(this);
    this.directive = directive;
  }
  Query = __decorate([lang_1.CONST(), __metadata('design:paramtypes', [Object])], Query);
  return Query;
})(annotations_impl_1.DependencyAnnotation);
exports.Query = Query;
exports.__esModule = true;
