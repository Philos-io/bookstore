/* */ 
var collection_1 = require("../facade/collection");
var lang_1 = require("../facade/lang");
var modelModule = require("./model");
var FormBuilder = (function() {
  function FormBuilder() {}
  FormBuilder.prototype.group = function(controlsConfig, extra) {
    if (extra === void 0) {
      extra = null;
    }
    var controls = this._reduceControls(controlsConfig);
    var optionals = lang_1.isPresent(extra) ? collection_1.StringMapWrapper.get(extra, "optionals") : null;
    var validator = lang_1.isPresent(extra) ? collection_1.StringMapWrapper.get(extra, "validator") : null;
    if (lang_1.isPresent(validator)) {
      return new modelModule.ControlGroup(controls, optionals, validator);
    } else {
      return new modelModule.ControlGroup(controls, optionals);
    }
  };
  FormBuilder.prototype.control = function(value, validator) {
    if (validator === void 0) {
      validator = null;
    }
    if (lang_1.isPresent(validator)) {
      return new modelModule.Control(value, validator);
    } else {
      return new modelModule.Control(value);
    }
  };
  FormBuilder.prototype.array = function(controlsConfig, validator) {
    var _this = this;
    if (validator === void 0) {
      validator = null;
    }
    var controls = collection_1.ListWrapper.map(controlsConfig, function(c) {
      return _this._createControl(c);
    });
    if (lang_1.isPresent(validator)) {
      return new modelModule.ControlArray(controls, validator);
    } else {
      return new modelModule.ControlArray(controls);
    }
  };
  FormBuilder.prototype._reduceControls = function(controlsConfig) {
    var _this = this;
    var controls = {};
    collection_1.StringMapWrapper.forEach(controlsConfig, function(controlConfig, controlName) {
      controls[controlName] = _this._createControl(controlConfig);
    });
    return controls;
  };
  FormBuilder.prototype._createControl = function(controlConfig) {
    if (controlConfig instanceof modelModule.Control || controlConfig instanceof modelModule.ControlGroup || controlConfig instanceof modelModule.ControlArray) {
      return controlConfig;
    } else if (collection_1.ListWrapper.isList(controlConfig)) {
      var value = collection_1.ListWrapper.get(controlConfig, 0);
      var validator = controlConfig.length > 1 ? controlConfig[1] : null;
      return this.control(value, validator);
    } else {
      return this.control(controlConfig);
    }
  };
  return FormBuilder;
})();
exports.FormBuilder = FormBuilder;
exports.__esModule = true;
