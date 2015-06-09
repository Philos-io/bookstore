/* */ 
(function(process) {
  var di_1 = require("../../di");
  var lang_1 = require("../facade/lang");
  var browser_adapter_1 = require("../dom/browser_adapter");
  var dom_adapter_1 = require("../dom/dom_adapter");
  var compiler_1 = require("./compiler/compiler");
  var reflection_1 = require("../reflection/reflection");
  var change_detection_1 = require("../../change_detection");
  var exception_handler_1 = require("./exception_handler");
  var template_loader_1 = require("../render/dom/compiler/template_loader");
  var template_resolver_1 = require("./compiler/template_resolver");
  var directive_resolver_1 = require("./compiler/directive_resolver");
  var collection_1 = require("../facade/collection");
  var async_1 = require("../facade/async");
  var ng_zone_1 = require("./zone/ng_zone");
  var life_cycle_1 = require("./life_cycle/life_cycle");
  var shadow_dom_strategy_1 = require("../render/dom/shadow_dom/shadow_dom_strategy");
  var emulated_unscoped_shadow_dom_strategy_1 = require("../render/dom/shadow_dom/emulated_unscoped_shadow_dom_strategy");
  var xhr_1 = require("../services/xhr");
  var xhr_impl_1 = require("../services/xhr_impl");
  var event_manager_1 = require("../render/dom/events/event_manager");
  var key_events_1 = require("../render/dom/events/key_events");
  var hammer_gestures_1 = require("../render/dom/events/hammer_gestures");
  var component_url_mapper_1 = require("./compiler/component_url_mapper");
  var url_resolver_1 = require("../services/url_resolver");
  var style_url_resolver_1 = require("../render/dom/shadow_dom/style_url_resolver");
  var style_inliner_1 = require("../render/dom/shadow_dom/style_inliner");
  var dynamic_component_loader_1 = require("./compiler/dynamic_component_loader");
  var testability_1 = require("./testability/testability");
  var view_pool_1 = require("./compiler/view_pool");
  var view_manager_1 = require("./compiler/view_manager");
  var view_manager_utils_1 = require("./compiler/view_manager_utils");
  var view_listener_1 = require("./compiler/view_listener");
  var proto_view_factory_1 = require("./compiler/proto_view_factory");
  var api_1 = require("../render/api");
  var dom_renderer_1 = require("../render/dom/dom_renderer");
  var view_1 = require("../render/dom/view/view");
  var compiler_2 = require("../render/dom/compiler/compiler");
  var view_ref_1 = require("./compiler/view_ref");
  var application_tokens_1 = require("./application_tokens");
  var _rootInjector;
  var _rootBindings = [di_1.bind(reflection_1.Reflector).toValue(reflection_1.reflector), testability_1.TestabilityRegistry];
  function _injectorBindings(appComponentType) {
    return [di_1.bind(dom_renderer_1.DOCUMENT_TOKEN).toValue(dom_adapter_1.DOM.defaultDoc()), di_1.bind(application_tokens_1.appComponentTypeToken).toValue(appComponentType), di_1.bind(application_tokens_1.appComponentRefToken).toAsyncFactory(function(dynamicComponentLoader, injector, testability, registry) {
      return dynamicComponentLoader.loadAsRoot(appComponentType, null, injector).then(function(componentRef) {
        var domView = view_1.resolveInternalDomView(componentRef.hostView.render);
        registry.registerApplication(domView.boundElements[0], testability);
        return componentRef;
      });
    }, [dynamic_component_loader_1.DynamicComponentLoader, di_1.Injector, testability_1.Testability, testability_1.TestabilityRegistry]), di_1.bind(appComponentType).toFactory(function(ref) {
      return ref.instance;
    }, [application_tokens_1.appComponentRefToken]), di_1.bind(life_cycle_1.LifeCycle).toFactory(function(exceptionHandler) {
      return new life_cycle_1.LifeCycle(exceptionHandler, null, lang_1.assertionsEnabled());
    }, [exception_handler_1.ExceptionHandler]), di_1.bind(event_manager_1.EventManager).toFactory(function(ngZone) {
      var plugins = [new hammer_gestures_1.HammerGesturesPlugin(), new key_events_1.KeyEventsPlugin(), new event_manager_1.DomEventsPlugin()];
      return new event_manager_1.EventManager(plugins, ngZone);
    }, [ng_zone_1.NgZone]), di_1.bind(shadow_dom_strategy_1.ShadowDomStrategy).toFactory(function(styleUrlResolver, doc) {
      return new emulated_unscoped_shadow_dom_strategy_1.EmulatedUnscopedShadowDomStrategy(styleUrlResolver, doc.head);
    }, [style_url_resolver_1.StyleUrlResolver, dom_renderer_1.DOCUMENT_TOKEN]), dom_renderer_1.DomRenderer, compiler_2.DefaultDomCompiler, di_1.bind(api_1.Renderer).toAlias(dom_renderer_1.DomRenderer), di_1.bind(api_1.RenderCompiler).toAlias(compiler_2.DefaultDomCompiler), proto_view_factory_1.ProtoViewFactory, view_pool_1.AppViewPool, di_1.bind(view_pool_1.APP_VIEW_POOL_CAPACITY).toValue(10000), view_manager_1.AppViewManager, view_manager_utils_1.AppViewManagerUtils, view_listener_1.AppViewListener, compiler_1.Compiler, compiler_1.CompilerCache, template_resolver_1.TemplateResolver, di_1.bind(change_detection_1.PipeRegistry).toValue(change_detection_1.defaultPipeRegistry), di_1.bind(change_detection_1.ChangeDetection).toClass(change_detection_1.DynamicChangeDetection), template_loader_1.TemplateLoader, directive_resolver_1.DirectiveResolver, change_detection_1.Parser, change_detection_1.Lexer, exception_handler_1.ExceptionHandler, di_1.bind(xhr_1.XHR).toValue(new xhr_impl_1.XHRImpl()), component_url_mapper_1.ComponentUrlMapper, url_resolver_1.UrlResolver, style_url_resolver_1.StyleUrlResolver, style_inliner_1.StyleInliner, dynamic_component_loader_1.DynamicComponentLoader, testability_1.Testability];
  }
  function _createNgZone(givenReporter) {
    var defaultErrorReporter = function(exception, stackTrace) {
      var longStackTrace = collection_1.ListWrapper.join(stackTrace, "\n\n-----async gap-----\n");
      dom_adapter_1.DOM.logError(exception + "\n\n" + longStackTrace);
      throw exception;
    };
    var reporter = lang_1.isPresent(givenReporter) ? givenReporter : defaultErrorReporter;
    var zone = new ng_zone_1.NgZone({enableLongStackTrace: lang_1.assertionsEnabled()});
    zone.initCallbacks({onErrorHandler: reporter});
    return zone;
  }
  function bootstrap(appComponentType, componentInjectableBindings, errorReporter) {
    if (componentInjectableBindings === void 0) {
      componentInjectableBindings = null;
    }
    if (errorReporter === void 0) {
      errorReporter = null;
    }
    browser_adapter_1.BrowserDomAdapter.makeCurrent();
    var bootstrapProcess = async_1.PromiseWrapper.completer();
    var zone = _createNgZone(errorReporter);
    zone.run(function() {
      var appInjector = _createAppInjector(appComponentType, componentInjectableBindings, zone);
      async_1.PromiseWrapper.then(appInjector.asyncGet(application_tokens_1.appComponentRefToken), function(componentRef) {
        var appChangeDetector = view_ref_1.internalView(componentRef.hostView).changeDetector;
        var lc = appInjector.get(life_cycle_1.LifeCycle);
        lc.registerWith(zone, appChangeDetector);
        lc.tick();
        bootstrapProcess.resolve(new ApplicationRef(componentRef, appComponentType, appInjector));
      }, function(err, stackTrace) {
        bootstrapProcess.reject(err, stackTrace);
      });
    });
    return bootstrapProcess.promise;
  }
  exports.bootstrap = bootstrap;
  var ApplicationRef = (function() {
    function ApplicationRef(hostComponent, hostComponentType, injector) {
      this._hostComponent = hostComponent;
      this._injector = injector;
      this._hostComponentType = hostComponentType;
    }
    Object.defineProperty(ApplicationRef.prototype, "hostComponentType", {
      get: function() {
        return this._hostComponentType;
      },
      enumerable: true,
      configurable: true
    });
    Object.defineProperty(ApplicationRef.prototype, "hostComponent", {
      get: function() {
        return this._hostComponent.instance;
      },
      enumerable: true,
      configurable: true
    });
    ApplicationRef.prototype.dispose = function() {
      return this._hostComponent.dispose();
    };
    Object.defineProperty(ApplicationRef.prototype, "injector", {
      get: function() {
        return this._injector;
      },
      enumerable: true,
      configurable: true
    });
    return ApplicationRef;
  })();
  exports.ApplicationRef = ApplicationRef;
  function _createAppInjector(appComponentType, bindings, zone) {
    if (lang_1.isBlank(_rootInjector))
      _rootInjector = di_1.Injector.resolveAndCreate(_rootBindings);
    var mergedBindings = lang_1.isPresent(bindings) ? collection_1.ListWrapper.concat(_injectorBindings(appComponentType), bindings) : _injectorBindings(appComponentType);
    collection_1.ListWrapper.push(mergedBindings, di_1.bind(ng_zone_1.NgZone).toValue(zone));
    return _rootInjector.resolveAndCreateChild(mergedBindings);
  }
  exports.__esModule = true;
})(require("process"));
