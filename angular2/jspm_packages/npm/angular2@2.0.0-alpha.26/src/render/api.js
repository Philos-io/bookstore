/* */ 
var lang_1 = require("../facade/lang");
var EventBinding = (function() {
  function EventBinding(fullName, source) {
    this.fullName = fullName;
    this.source = source;
  }
  return EventBinding;
})();
exports.EventBinding = EventBinding;
var ElementBinder = (function() {
  function ElementBinder(_a) {
    var _b = _a === void 0 ? {} : _a,
        index = _b.index,
        parentIndex = _b.parentIndex,
        distanceToParent = _b.distanceToParent,
        directives = _b.directives,
        nestedProtoView = _b.nestedProtoView,
        propertyBindings = _b.propertyBindings,
        variableBindings = _b.variableBindings,
        eventBindings = _b.eventBindings,
        textBindings = _b.textBindings,
        readAttributes = _b.readAttributes;
    this.index = index;
    this.parentIndex = parentIndex;
    this.distanceToParent = distanceToParent;
    this.directives = directives;
    this.nestedProtoView = nestedProtoView;
    this.propertyBindings = propertyBindings;
    this.variableBindings = variableBindings;
    this.eventBindings = eventBindings;
    this.textBindings = textBindings;
    this.readAttributes = readAttributes;
  }
  return ElementBinder;
})();
exports.ElementBinder = ElementBinder;
var DirectiveBinder = (function() {
  function DirectiveBinder(_a) {
    var directiveIndex = _a.directiveIndex,
        propertyBindings = _a.propertyBindings,
        eventBindings = _a.eventBindings,
        hostPropertyBindings = _a.hostPropertyBindings;
    this.directiveIndex = directiveIndex;
    this.propertyBindings = propertyBindings;
    this.eventBindings = eventBindings;
    this.hostPropertyBindings = hostPropertyBindings;
  }
  return DirectiveBinder;
})();
exports.DirectiveBinder = DirectiveBinder;
var ProtoViewDto = (function() {
  function ProtoViewDto(_a) {
    var render = _a.render,
        elementBinders = _a.elementBinders,
        variableBindings = _a.variableBindings,
        type = _a.type;
    this.render = render;
    this.elementBinders = elementBinders;
    this.variableBindings = variableBindings;
    this.type = type;
  }
  Object.defineProperty(ProtoViewDto, "HOST_VIEW_TYPE", {
    get: function() {
      return 0;
    },
    enumerable: true,
    configurable: true
  });
  Object.defineProperty(ProtoViewDto, "COMPONENT_VIEW_TYPE", {
    get: function() {
      return 1;
    },
    enumerable: true,
    configurable: true
  });
  Object.defineProperty(ProtoViewDto, "EMBEDDED_VIEW_TYPE", {
    get: function() {
      return 2;
    },
    enumerable: true,
    configurable: true
  });
  return ProtoViewDto;
})();
exports.ProtoViewDto = ProtoViewDto;
var DirectiveMetadata = (function() {
  function DirectiveMetadata(_a) {
    var id = _a.id,
        selector = _a.selector,
        compileChildren = _a.compileChildren,
        events = _a.events,
        hostListeners = _a.hostListeners,
        hostProperties = _a.hostProperties,
        hostAttributes = _a.hostAttributes,
        hostActions = _a.hostActions,
        properties = _a.properties,
        readAttributes = _a.readAttributes,
        type = _a.type,
        callOnDestroy = _a.callOnDestroy,
        callOnChange = _a.callOnChange,
        callOnCheck = _a.callOnCheck,
        callOnInit = _a.callOnInit,
        callOnAllChangesDone = _a.callOnAllChangesDone,
        changeDetection = _a.changeDetection;
    this.id = id;
    this.selector = selector;
    this.compileChildren = lang_1.isPresent(compileChildren) ? compileChildren : true;
    this.events = events;
    this.hostListeners = hostListeners;
    this.hostProperties = hostProperties;
    this.hostAttributes = hostAttributes;
    this.hostActions = hostActions;
    this.properties = properties;
    this.readAttributes = readAttributes;
    this.type = type;
    this.callOnDestroy = callOnDestroy;
    this.callOnChange = callOnChange;
    this.callOnCheck = callOnCheck;
    this.callOnInit = callOnInit;
    this.callOnAllChangesDone = callOnAllChangesDone;
    this.changeDetection = changeDetection;
  }
  Object.defineProperty(DirectiveMetadata, "DIRECTIVE_TYPE", {
    get: function() {
      return 0;
    },
    enumerable: true,
    configurable: true
  });
  Object.defineProperty(DirectiveMetadata, "COMPONENT_TYPE", {
    get: function() {
      return 1;
    },
    enumerable: true,
    configurable: true
  });
  return DirectiveMetadata;
})();
exports.DirectiveMetadata = DirectiveMetadata;
var RenderProtoViewRef = (function() {
  function RenderProtoViewRef() {}
  return RenderProtoViewRef;
})();
exports.RenderProtoViewRef = RenderProtoViewRef;
var RenderViewRef = (function() {
  function RenderViewRef() {}
  return RenderViewRef;
})();
exports.RenderViewRef = RenderViewRef;
var ViewDefinition = (function() {
  function ViewDefinition(_a) {
    var componentId = _a.componentId,
        absUrl = _a.absUrl,
        template = _a.template,
        directives = _a.directives;
    this.componentId = componentId;
    this.absUrl = absUrl;
    this.template = template;
    this.directives = directives;
  }
  return ViewDefinition;
})();
exports.ViewDefinition = ViewDefinition;
var RenderCompiler = (function() {
  function RenderCompiler() {}
  RenderCompiler.prototype.compileHost = function(directiveMetadata) {
    return null;
  };
  RenderCompiler.prototype.compile = function(template) {
    return null;
  };
  return RenderCompiler;
})();
exports.RenderCompiler = RenderCompiler;
var Renderer = (function() {
  function Renderer() {}
  Renderer.prototype.createRootHostView = function(hostProtoViewRef, hostElementSelector) {
    return null;
  };
  Renderer.prototype.detachFreeView = function(view) {};
  Renderer.prototype.createView = function(protoViewRef) {
    return null;
  };
  Renderer.prototype.destroyView = function(viewRef) {};
  Renderer.prototype.attachComponentView = function(hostViewRef, elementIndex, componentViewRef) {};
  Renderer.prototype.detachComponentView = function(hostViewRef, boundElementIndex, componentViewRef) {};
  Renderer.prototype.attachViewInContainer = function(parentViewRef, boundElementIndex, atIndex, viewRef) {};
  Renderer.prototype.detachViewInContainer = function(parentViewRef, boundElementIndex, atIndex, viewRef) {};
  Renderer.prototype.hydrateView = function(viewRef) {};
  Renderer.prototype.dehydrateView = function(viewRef) {};
  Renderer.prototype.setElementProperty = function(viewRef, elementIndex, propertyName, propertyValue) {};
  Renderer.prototype.callAction = function(viewRef, elementIndex, actionExpression, actionArgs) {};
  Renderer.prototype.setText = function(viewRef, textNodeIndex, text) {};
  Renderer.prototype.setEventDispatcher = function(viewRef, dispatcher) {};
  return Renderer;
})();
exports.Renderer = Renderer;
exports.__esModule = true;
