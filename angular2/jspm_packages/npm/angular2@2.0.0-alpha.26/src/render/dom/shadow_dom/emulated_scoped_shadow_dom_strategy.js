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
var lang_1 = require("../../../facade/lang");
var async_1 = require("../../../facade/async");
var dom_adapter_1 = require("../../../dom/dom_adapter");
var emulated_unscoped_shadow_dom_strategy_1 = require("./emulated_unscoped_shadow_dom_strategy");
var util_1 = require("./util");
var EmulatedScopedShadowDomStrategy = (function(_super) {
  __extends(EmulatedScopedShadowDomStrategy, _super);
  function EmulatedScopedShadowDomStrategy(styleInliner, styleUrlResolver, styleHost) {
    _super.call(this, styleUrlResolver, styleHost);
    this.styleInliner = styleInliner;
  }
  EmulatedScopedShadowDomStrategy.prototype.processStyleElement = function(hostComponentId, templateUrl, styleEl) {
    var cssText = dom_adapter_1.DOM.getText(styleEl);
    cssText = this.styleUrlResolver.resolveUrls(cssText, templateUrl);
    var inlinedCss = this.styleInliner.inlineImports(cssText, templateUrl);
    if (async_1.PromiseWrapper.isPromise(inlinedCss)) {
      dom_adapter_1.DOM.setText(styleEl, '');
      return inlinedCss.then(function(css) {
        css = util_1.shimCssForComponent(css, hostComponentId);
        dom_adapter_1.DOM.setText(styleEl, css);
      });
    } else {
      var css = util_1.shimCssForComponent(inlinedCss, hostComponentId);
      dom_adapter_1.DOM.setText(styleEl, css);
      dom_adapter_1.DOM.remove(styleEl);
      util_1.insertStyleElement(this.styleHost, styleEl);
      return null;
    }
  };
  EmulatedScopedShadowDomStrategy.prototype.processElement = function(hostComponentId, elementComponentId, element) {
    if (lang_1.isPresent(hostComponentId)) {
      var contentAttribute = util_1.getContentAttribute(util_1.getComponentId(hostComponentId));
      dom_adapter_1.DOM.setAttribute(element, contentAttribute, '');
    }
    if (lang_1.isPresent(elementComponentId)) {
      var hostAttribute = util_1.getHostAttribute(util_1.getComponentId(elementComponentId));
      dom_adapter_1.DOM.setAttribute(element, hostAttribute, '');
    }
  };
  return EmulatedScopedShadowDomStrategy;
})(emulated_unscoped_shadow_dom_strategy_1.EmulatedUnscopedShadowDomStrategy);
exports.EmulatedScopedShadowDomStrategy = EmulatedScopedShadowDomStrategy;
exports.__esModule = true;
