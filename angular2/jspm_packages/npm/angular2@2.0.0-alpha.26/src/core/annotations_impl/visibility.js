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
var Visibility = (function(_super) {
  __extends(Visibility, _super);
  function Visibility(depth, crossComponentBoundaries, _includeSelf) {
    _super.call(this);
    this.depth = depth;
    this.crossComponentBoundaries = crossComponentBoundaries;
    this._includeSelf = _includeSelf;
  }
  Object.defineProperty(Visibility.prototype, "includeSelf", {
    get: function() {
      return lang_1.isBlank(this._includeSelf) ? false : this._includeSelf;
    },
    enumerable: true,
    configurable: true
  });
  Visibility = __decorate([lang_1.CONST(), __metadata('design:paramtypes', [Number, Boolean, Boolean])], Visibility);
  return Visibility;
})(annotations_impl_1.DependencyAnnotation);
exports.Visibility = Visibility;
var Self = (function(_super) {
  __extends(Self, _super);
  function Self() {
    _super.call(this, 0, false, true);
  }
  Self = __decorate([lang_1.CONST(), __metadata('design:paramtypes', [])], Self);
  return Self;
})(Visibility);
exports.Self = Self;
exports.self = new Self();
var Parent = (function(_super) {
  __extends(Parent, _super);
  function Parent(_a) {
    var self = (_a === void 0 ? {} : _a).self;
    _super.call(this, 1, false, self);
  }
  Parent = __decorate([lang_1.CONST(), __metadata('design:paramtypes', [Object])], Parent);
  return Parent;
})(Visibility);
exports.Parent = Parent;
var Ancestor = (function(_super) {
  __extends(Ancestor, _super);
  function Ancestor(_a) {
    var self = (_a === void 0 ? {} : _a).self;
    _super.call(this, 999999, false, self);
  }
  Ancestor = __decorate([lang_1.CONST(), __metadata('design:paramtypes', [Object])], Ancestor);
  return Ancestor;
})(Visibility);
exports.Ancestor = Ancestor;
var Unbounded = (function(_super) {
  __extends(Unbounded, _super);
  function Unbounded(_a) {
    var self = (_a === void 0 ? {} : _a).self;
    _super.call(this, 999999, true, self);
  }
  Unbounded = __decorate([lang_1.CONST(), __metadata('design:paramtypes', [Object])], Unbounded);
  return Unbounded;
})(Visibility);
exports.Unbounded = Unbounded;
exports.__esModule = true;
