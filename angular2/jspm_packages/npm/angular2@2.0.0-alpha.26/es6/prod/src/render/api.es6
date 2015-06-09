import { isPresent } from 'angular2/src/facade/lang';
/**
 * General notes:
 *
 * The methods for creating / destroying views in this API are used in the AppViewHydrator
 * and RenderViewHydrator as well.
 *
 * We are already parsing expressions on the render side:
 * - this makes the ElementBinders more compact
 *   (e.g. no need to distinguish interpolations from regular expressions from literals)
 * - allows to retrieve which properties should be accessed from the event
 *   by looking at the expression
 * - we need the parse at least for the `template` attribute to match
 *   directives in it
 * - render compiler is not on the critical path as
 *   its output will be stored in precompiled templates.
 */
export class EventBinding {
    constructor(fullName, source) {
        this.fullName = fullName;
        this.source = source;
    }
}
export class ElementBinder {
    constructor({ index, parentIndex, distanceToParent, directives, nestedProtoView, propertyBindings, variableBindings, eventBindings, textBindings, readAttributes } = {}) {
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
}
export class DirectiveBinder {
    constructor({ directiveIndex, propertyBindings, eventBindings, hostPropertyBindings }) {
        this.directiveIndex = directiveIndex;
        this.propertyBindings = propertyBindings;
        this.eventBindings = eventBindings;
        this.hostPropertyBindings = hostPropertyBindings;
    }
}
export class ProtoViewDto {
    constructor({ render, elementBinders, variableBindings, type }) {
        this.render = render;
        this.elementBinders = elementBinders;
        this.variableBindings = variableBindings;
        this.type = type;
    }
    // A view that contains the host element with bound
    // component directive.
    // Contains a view of type #COMPONENT_VIEW_TYPE.
    static get HOST_VIEW_TYPE() { return 0; }
    // The view of the component
    // Can contain 0 to n views of type #EMBEDDED_VIEW_TYPE
    static get COMPONENT_VIEW_TYPE() { return 1; }
    // A view that is embedded into another View via a <template> element
    // inside of a component view
    static get EMBEDDED_VIEW_TYPE() { return 2; }
}
export class DirectiveMetadata {
    constructor({ id, selector, compileChildren, events, hostListeners, hostProperties, hostAttributes, hostActions, properties, readAttributes, type, callOnDestroy, callOnChange, callOnCheck, callOnInit, callOnAllChangesDone, changeDetection }) {
        this.id = id;
        this.selector = selector;
        this.compileChildren = isPresent(compileChildren) ? compileChildren : true;
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
    static get DIRECTIVE_TYPE() { return 0; }
    static get COMPONENT_TYPE() { return 1; }
}
// An opaque reference to a DomProtoView
export class RenderProtoViewRef {
}
// An opaque reference to a DomView
export class RenderViewRef {
}
export class ViewDefinition {
    constructor({ componentId, absUrl, template, directives }) {
        this.componentId = componentId;
        this.absUrl = absUrl;
        this.template = template;
        this.directives = directives;
    }
}
export class RenderCompiler {
    /**
     * Creats a ProtoViewDto that contains a single nested component with the given componentId.
     */
    compileHost(directiveMetadata) { return null; }
    /**
     * Compiles a single DomProtoView. Non recursive so that
     * we don't need to serialize all possible components over the wire,
     * but only the needed ones based on previous calls.
     */
    compile(template) { return null; }
}
export class Renderer {
    /**
     * Creates a root host view that includes the given element.
     * @param {RenderProtoViewRef} hostProtoViewRef a RenderProtoViewRef of type
     * ProtoViewDto.HOST_VIEW_TYPE
     * @param {any} hostElementSelector css selector for the host element (will be queried against the
     * main document)
     * @return {RenderViewRef} the created view
     */
    createRootHostView(hostProtoViewRef, hostElementSelector) {
        return null;
    }
    /**
     * Detaches a free view's element from the DOM.
     */
    detachFreeView(view) { }
    /**
     * Creates a regular view out of the given ProtoView
     */
    createView(protoViewRef) { return null; }
    /**
     * Destroys the given view after it has been dehydrated and detached
     */
    destroyView(viewRef) { }
    /**
     * Attaches a componentView into the given hostView at the given element
     */
    attachComponentView(hostViewRef, elementIndex, componentViewRef) { }
    /**
     * Detaches a componentView into the given hostView at the given element
     */
    detachComponentView(hostViewRef, boundElementIndex, componentViewRef) { }
    /**
     * Attaches a view into a ViewContainer (in the given parentView at the given element) at the
     * given index.
     */
    attachViewInContainer(parentViewRef, boundElementIndex, atIndex, viewRef) { }
    /**
     * Detaches a view into a ViewContainer (in the given parentView at the given element) at the
     * given index.
     */
    // TODO(tbosch): this should return a promise as it can be animated!
    detachViewInContainer(parentViewRef, boundElementIndex, atIndex, viewRef) { }
    /**
     * Hydrates a view after it has been attached. Hydration/dehydration is used for reusing views
     * inside of the view pool.
     */
    hydrateView(viewRef) { }
    /**
     * Dehydrates a view after it has been attached. Hydration/dehydration is used for reusing views
     * inside of the view pool.
     */
    dehydrateView(viewRef) { }
    /**
     * Sets a property on an element.
     * Note: This will fail if the property was not mentioned previously as a host property
     * in the ProtoView
     */
    setElementProperty(viewRef, elementIndex, propertyName, propertyValue) { }
    /**
     * Calls an action.
     * Note: This will fail if the action was not mentioned previously as a host action
     * in the ProtoView
     */
    callAction(viewRef, elementIndex, actionExpression, actionArgs) { }
    /**
     * Sets the value of a text node.
     */
    setText(viewRef, textNodeIndex, text) { }
    /**
     * Sets the dispatcher for all events of the given view
     */
    setEventDispatcher(viewRef, dispatcher) { }
}
//# sourceMappingURL=api.js.map