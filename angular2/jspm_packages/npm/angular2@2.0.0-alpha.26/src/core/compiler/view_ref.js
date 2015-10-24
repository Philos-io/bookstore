/* */ 
var lang_1 = require("../../facade/lang");
function internalView(viewRef) {
  return viewRef._view;
}
exports.internalView = internalView;
function internalProtoView(protoViewRef) {
  return lang_1.isPresent(protoViewRef) ? protoViewRef._protoView : null;
}
exports.internalProtoView = internalProtoView;
var ViewRef = (function() {
  function ViewRef(view) {
    this._view = view;
  }
  Object.defineProperty(ViewRef.prototype, "render", {
    get: function() {
      return this._view.render;
    },
    enumerable: true,
    configurable: true
  });
  ViewRef.prototype.setLocal = function(contextName, value) {
    this._view.setLocal(contextName, value);
  };
  return ViewRef;
})();
exports.ViewRef = ViewRef;
var ProtoViewRef = (function() {
  function ProtoViewRef(protoView) {
    this._protoView = protoView;
  }
  return ProtoViewRef;
})();
exports.ProtoViewRef = ProtoViewRef;
exports.__esModule = true;
