/* */ 
var dom_adapter_1 = require("../../dom/dom_adapter");
var lang_1 = require("../../facade/lang");
var view_1 = require("../../render/dom/view/view");
var ElementRef = (function() {
  function ElementRef(parentView, boundElementIndex) {
    this.parentView = parentView;
    this.boundElementIndex = boundElementIndex;
  }
  Object.defineProperty(ElementRef.prototype, "domElement", {
    get: function() {
      return view_1.resolveInternalDomView(this.parentView.render).boundElements[this.boundElementIndex];
    },
    enumerable: true,
    configurable: true
  });
  ElementRef.prototype.getAttribute = function(name) {
    return lang_1.normalizeBlank(dom_adapter_1.DOM.getAttribute(this.domElement, name));
  };
  return ElementRef;
})();
exports.ElementRef = ElementRef;
exports.__esModule = true;
