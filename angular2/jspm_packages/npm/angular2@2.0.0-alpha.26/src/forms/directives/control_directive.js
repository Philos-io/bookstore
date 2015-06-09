/* */ 
var validators_1 = require("../validators");
var ControlDirective = (function() {
  function ControlDirective() {
    this.name = null;
    this.valueAccessor = null;
    this.validator = validators_1.Validators.nullValidator;
  }
  Object.defineProperty(ControlDirective.prototype, "path", {
    get: function() {
      return null;
    },
    enumerable: true,
    configurable: true
  });
  Object.defineProperty(ControlDirective.prototype, "control", {
    get: function() {
      return null;
    },
    enumerable: true,
    configurable: true
  });
  ControlDirective.prototype.viewToModelUpdate = function(newValue) {};
  return ControlDirective;
})();
exports.ControlDirective = ControlDirective;
exports.__esModule = true;
