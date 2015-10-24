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
var di_1 = require("../../../../di");
var lang_1 = require("../../../facade/lang");
var collection_1 = require("../../../facade/collection");
var async_1 = require("../../../facade/async");
var dom_adapter_1 = require("../../../dom/dom_adapter");
var xhr_1 = require("../../../services/xhr");
var url_resolver_1 = require("../../../services/url_resolver");
var TemplateLoader = (function() {
  function TemplateLoader(xhr, urlResolver) {
    this._xhr = xhr;
    this._htmlCache = collection_1.StringMapWrapper.create();
  }
  TemplateLoader.prototype.load = function(template) {
    if (lang_1.isPresent(template.template)) {
      return async_1.PromiseWrapper.resolve(dom_adapter_1.DOM.createTemplate(template.template));
    }
    var url = template.absUrl;
    if (lang_1.isPresent(url)) {
      var promise = collection_1.StringMapWrapper.get(this._htmlCache, url);
      if (lang_1.isBlank(promise)) {
        promise = async_1.PromiseWrapper.then(this._xhr.get(url), function(html) {
          var template = dom_adapter_1.DOM.createTemplate(html);
          return template;
        }, function(_) {
          return async_1.PromiseWrapper.reject(new lang_1.BaseException("Failed to fetch url \"" + url + "\""), null);
        });
        collection_1.StringMapWrapper.set(this._htmlCache, url, promise);
      }
      return promise.then(function(tplElement) {
        return dom_adapter_1.DOM.clone(tplElement);
      });
    }
    throw new lang_1.BaseException('View should have either the url or template property set');
  };
  TemplateLoader = __decorate([di_1.Injectable(), __metadata('design:paramtypes', [xhr_1.XHR, url_resolver_1.UrlResolver])], TemplateLoader);
  return TemplateLoader;
})();
exports.TemplateLoader = TemplateLoader;
exports.__esModule = true;
