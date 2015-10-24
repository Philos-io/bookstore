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
var collection_1 = require("../facade/collection");
var lang_1 = require("../facade/lang");
var view_1 = require("../core/annotations_impl/view");
var template_resolver_1 = require("../core/compiler/template_resolver");
var MockTemplateResolver = (function(_super) {
  __extends(MockTemplateResolver, _super);
  function MockTemplateResolver() {
    _super.call(this);
    this._views = collection_1.MapWrapper.create();
    this._inlineTemplates = collection_1.MapWrapper.create();
    this._viewCache = collection_1.MapWrapper.create();
    this._directiveOverrides = collection_1.MapWrapper.create();
  }
  MockTemplateResolver.prototype.setView = function(component, view) {
    this._checkOverrideable(component);
    collection_1.MapWrapper.set(this._views, component, view);
  };
  MockTemplateResolver.prototype.setInlineTemplate = function(component, template) {
    this._checkOverrideable(component);
    collection_1.MapWrapper.set(this._inlineTemplates, component, template);
  };
  MockTemplateResolver.prototype.overrideViewDirective = function(component, from, to) {
    this._checkOverrideable(component);
    var overrides = collection_1.MapWrapper.get(this._directiveOverrides, component);
    if (lang_1.isBlank(overrides)) {
      overrides = collection_1.MapWrapper.create();
      collection_1.MapWrapper.set(this._directiveOverrides, component, overrides);
    }
    collection_1.MapWrapper.set(overrides, from, to);
  };
  MockTemplateResolver.prototype.resolve = function(component) {
    var view = collection_1.MapWrapper.get(this._viewCache, component);
    if (lang_1.isPresent(view))
      return view;
    view = collection_1.MapWrapper.get(this._views, component);
    if (lang_1.isBlank(view)) {
      view = _super.prototype.resolve.call(this, component);
    }
    if (lang_1.isBlank(view)) {
      return null;
    }
    var directives = view.directives;
    var overrides = collection_1.MapWrapper.get(this._directiveOverrides, component);
    if (lang_1.isPresent(overrides) && lang_1.isPresent(directives)) {
      directives = collection_1.ListWrapper.clone(view.directives);
      collection_1.MapWrapper.forEach(overrides, function(to, from) {
        var srcIndex = directives.indexOf(from);
        if (srcIndex == -1) {
          throw new lang_1.BaseException("Overriden directive " + lang_1.stringify(from) + " not found in the template of " + lang_1.stringify(component));
        }
        directives[srcIndex] = to;
      });
      view = new view_1.View({
        template: view.template,
        templateUrl: view.templateUrl,
        directives: directives
      });
    }
    var inlineTemplate = collection_1.MapWrapper.get(this._inlineTemplates, component);
    if (lang_1.isPresent(inlineTemplate)) {
      view = new view_1.View({
        template: inlineTemplate,
        templateUrl: null,
        directives: view.directives
      });
    }
    collection_1.MapWrapper.set(this._viewCache, component, view);
    return view;
  };
  MockTemplateResolver.prototype._checkOverrideable = function(component) {
    var cached = collection_1.MapWrapper.get(this._viewCache, component);
    if (lang_1.isPresent(cached)) {
      throw new lang_1.BaseException("The component " + lang_1.stringify(component) + " has already been compiled, its configuration can not be changed");
    }
  };
  return MockTemplateResolver;
})(template_resolver_1.TemplateResolver);
exports.MockTemplateResolver = MockTemplateResolver;
exports.__esModule = true;
