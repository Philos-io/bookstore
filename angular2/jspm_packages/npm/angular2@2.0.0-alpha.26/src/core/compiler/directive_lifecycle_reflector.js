/* */ 
var lang_1 = require("../../facade/lang");
function hasLifecycleHook(e, type, annotation) {
  if (lang_1.isPresent(annotation.lifecycle)) {
    return annotation.lifecycle.indexOf(e) !== -1;
  } else {
    if (!(type instanceof lang_1.Type))
      return false;
    return e.name in type.prototype;
  }
}
exports.hasLifecycleHook = hasLifecycleHook;
exports.__esModule = true;
