/* */ 
(function(process) {
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
  var di_1 = require("../../../di");
  var change_detection_1 = require("../../../change_detection");
  var exception_handler_1 = require("../exception_handler");
  var lang_1 = require("../../facade/lang");
  var LifeCycle = (function() {
    function LifeCycle(exceptionHandler, changeDetector, enforceNoNewChanges) {
      if (changeDetector === void 0) {
        changeDetector = null;
      }
      if (enforceNoNewChanges === void 0) {
        enforceNoNewChanges = false;
      }
      this._errorHandler = function(exception, stackTrace) {
        exceptionHandler.call(exception, stackTrace);
        throw exception;
      };
      this._changeDetector = changeDetector;
      this._enforceNoNewChanges = enforceNoNewChanges;
    }
    LifeCycle.prototype.registerWith = function(zone, changeDetector) {
      var _this = this;
      if (changeDetector === void 0) {
        changeDetector = null;
      }
      if (lang_1.isPresent(changeDetector)) {
        this._changeDetector = changeDetector;
      }
      zone.initCallbacks({
        onErrorHandler: this._errorHandler,
        onTurnDone: function() {
          return _this.tick();
        }
      });
    };
    LifeCycle.prototype.tick = function() {
      this._changeDetector.detectChanges();
      if (this._enforceNoNewChanges) {
        this._changeDetector.checkNoChanges();
      }
    };
    LifeCycle = __decorate([di_1.Injectable(), __metadata('design:paramtypes', [exception_handler_1.ExceptionHandler, change_detection_1.ChangeDetector, Boolean])], LifeCycle);
    return LifeCycle;
  })();
  exports.LifeCycle = LifeCycle;
  exports.__esModule = true;
})(require("process"));
