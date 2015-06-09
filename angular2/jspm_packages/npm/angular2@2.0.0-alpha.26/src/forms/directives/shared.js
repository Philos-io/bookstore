/* */ 
var collection_1 = require("../../facade/collection");
var lang_1 = require("../../facade/lang");
var validators_1 = require("../validators");
function controlPath(name, parent) {
  var p = collection_1.ListWrapper.clone(parent.path);
  collection_1.ListWrapper.push(p, name);
  return p;
}
exports.controlPath = controlPath;
function setUpControl(c, dir) {
  if (lang_1.isBlank(c))
    _throwError(dir, "Cannot find control");
  if (lang_1.isBlank(dir.valueAccessor))
    _throwError(dir, "No value accessor for");
  c.validator = validators_1.Validators.compose([c.validator, dir.validator]);
  dir.valueAccessor.writeValue(c.value);
  dir.valueAccessor.registerOnChange(function(newValue) {
    dir.viewToModelUpdate(newValue);
    c.updateValue(newValue);
    c.markAsDirty();
  });
  c.registerOnChange(function(newValue) {
    return dir.valueAccessor.writeValue(newValue);
  });
  dir.valueAccessor.registerOnTouched(function() {
    return c.markAsTouched();
  });
}
exports.setUpControl = setUpControl;
function _throwError(dir, message) {
  var path = collection_1.ListWrapper.join(dir.path, " -> ");
  throw new lang_1.BaseException(message + " '" + path + "'");
}
exports.__esModule = true;
