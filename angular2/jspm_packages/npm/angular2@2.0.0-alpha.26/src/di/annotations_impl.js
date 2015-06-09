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
var Inject = (function() {
  function Inject(token) {
    this.token = token;
  }
  Inject = __decorate([lang_1.CONST(), __metadata('design:paramtypes', [Object])], Inject);
  return Inject;
})();
exports.Inject = Inject;
var InjectPromise = (function() {
  function InjectPromise(token) {
    this.token = token;
  }
  InjectPromise = __decorate([lang_1.CONST(), __metadata('design:paramtypes', [Object])], InjectPromise);
  return InjectPromise;
})();
exports.InjectPromise = InjectPromise;
var InjectLazy = (function() {
  function InjectLazy(token) {
    this.token = token;
  }
  InjectLazy = __decorate([lang_1.CONST(), __metadata('design:paramtypes', [Object])], InjectLazy);
  return InjectLazy;
})();
exports.InjectLazy = InjectLazy;
var Optional = (function() {
  function Optional() {}
  Optional = __decorate([lang_1.CONST(), __metadata('design:paramtypes', [])], Optional);
  return Optional;
})();
exports.Optional = Optional;
var DependencyAnnotation = (function() {
  function DependencyAnnotation() {}
  Object.defineProperty(DependencyAnnotation.prototype, "token", {
    get: function() {
      return null;
    },
    enumerable: true,
    configurable: true
  });
  DependencyAnnotation = __decorate([lang_1.CONST(), __metadata('design:paramtypes', [])], DependencyAnnotation);
  return DependencyAnnotation;
})();
exports.DependencyAnnotation = DependencyAnnotation;
var Injectable = (function() {
  function Injectable() {}
  Injectable = __decorate([lang_1.CONST(), __metadata('design:paramtypes', [])], Injectable);
  return Injectable;
})();
exports.Injectable = Injectable;
exports.__esModule = true;
