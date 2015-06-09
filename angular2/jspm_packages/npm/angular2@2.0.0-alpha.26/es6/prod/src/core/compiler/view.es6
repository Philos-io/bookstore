import { ListWrapper, MapWrapper, StringMapWrapper } from 'angular2/src/facade/collection';
import { Locals } from 'angular2/change_detection';
import { ElementBinder } from './element_binder';
import { isPresent, isBlank, BaseException } from 'angular2/src/facade/lang';
export class AppViewContainer {
    constructor() {
        // The order in this list matches the DOM order.
        this.views = [];
        this.freeViews = [];
    }
}
/**
 * Const of making objects: http://jsperf.com/instantiate-size-of-object
 *
 */
export class AppView {
    constructor(renderer, proto, protoLocals) {
        this.renderer = renderer;
        this.proto = proto;
        this.render = null;
        this.changeDetector = null;
        this.elementInjectors = null;
        this.rootElementInjectors = null;
        this.componentChildViews = null;
        this.viewContainers = ListWrapper.createFixedSize(this.proto.elementBinders.length);
        this.preBuiltObjects = null;
        this.context = null;
        this.locals = new Locals(null, MapWrapper.clone(protoLocals)); // TODO optimize this
        this.freeHostViews = [];
    }
    init(changeDetector, elementInjectors, rootElementInjectors, preBuiltObjects, componentChildViews) {
        this.changeDetector = changeDetector;
        this.elementInjectors = elementInjectors;
        this.rootElementInjectors = rootElementInjectors;
        this.preBuiltObjects = preBuiltObjects;
        this.componentChildViews = componentChildViews;
    }
    setLocal(contextName, value) {
        if (!this.hydrated())
            throw new BaseException('Cannot set locals on dehydrated view.');
        if (!MapWrapper.contains(this.proto.variableBindings, contextName)) {
            return;
        }
        var templateName = MapWrapper.get(this.proto.variableBindings, contextName);
        this.locals.set(templateName, value);
    }
    hydrated() { return isPresent(this.context); }
    /**
     * Triggers the event handlers for the element and the directives.
     *
     * This method is intended to be called from directive EventEmitters.
     *
     * @param {string} eventName
     * @param {*} eventObj
     * @param {int} binderIndex
     */
    triggerEventHandlers(eventName, eventObj, binderIndex) {
        var locals = MapWrapper.create();
        MapWrapper.set(locals, '$event', eventObj);
        this.dispatchEvent(binderIndex, eventName, locals);
    }
    // dispatch to element injector or text nodes based on context
    notifyOnBinding(b, currentValue) {
        if (b.isElement()) {
            this.renderer.setElementProperty(this.render, b.elementIndex, b.propertyName, currentValue);
        }
        else {
            // we know it refers to _textNodes.
            this.renderer.setText(this.render, b.elementIndex, currentValue);
        }
    }
    getDirectiveFor(directive) {
        var elementInjector = this.elementInjectors[directive.elementIndex];
        return elementInjector.getDirectiveAtIndex(directive.directiveIndex);
    }
    getDetectorFor(directive) {
        var childView = this.componentChildViews[directive.elementIndex];
        return isPresent(childView) ? childView.changeDetector : null;
    }
    callAction(elementIndex, actionExpression, action) {
        this.renderer.callAction(this.render, elementIndex, actionExpression, action);
    }
    // implementation of EventDispatcher#dispatchEvent
    // returns false if preventDefault must be applied to the DOM event
    dispatchEvent(elementIndex, eventName, locals) {
        // Most of the time the event will be fired only when the view is in the live document.
        // However, in a rare circumstance the view might get dehydrated, in between the event
        // queuing up and firing.
        var allowDefaultBehavior = true;
        if (this.hydrated()) {
            var elBinder = this.proto.elementBinders[elementIndex];
            if (isBlank(elBinder.hostListeners))
                return allowDefaultBehavior;
            var eventMap = elBinder.hostListeners[eventName];
            if (isBlank(eventMap))
                return allowDefaultBehavior;
            MapWrapper.forEach(eventMap, (expr, directiveIndex) => {
                var context;
                if (directiveIndex === -1) {
                    context = this.context;
                }
                else {
                    context = this.elementInjectors[elementIndex].getDirectiveAtIndex(directiveIndex);
                }
                var result = expr.eval(context, new Locals(this.locals, locals));
                if (isPresent(result)) {
                    allowDefaultBehavior = allowDefaultBehavior && result == true;
                }
            });
        }
        return allowDefaultBehavior;
    }
}
/**
 *
 */
export class AppProtoView {
    constructor(render, protoChangeDetector, variableBindings) {
        this.render = render;
        this.protoChangeDetector = protoChangeDetector;
        this.variableBindings = variableBindings;
        this.elementBinders = [];
        this.protoLocals = MapWrapper.create();
        if (isPresent(variableBindings)) {
            MapWrapper.forEach(variableBindings, (templateName, _) => {
                MapWrapper.set(this.protoLocals, templateName, null);
            });
        }
    }
    bindElement(parent, distanceToParent, protoElementInjector, componentDirective = null) {
        var elBinder = new ElementBinder(this.elementBinders.length, parent, distanceToParent, protoElementInjector, componentDirective);
        ListWrapper.push(this.elementBinders, elBinder);
        return elBinder;
    }
    /**
     * Adds an event binding for the last created ElementBinder via bindElement.
     *
     * If the directive index is a positive integer, the event is evaluated in the context of
     * the given directive.
     *
     * If the directive index is -1, the event is evaluated in the context of the enclosing view.
     *
     * @param {string} eventName
     * @param {AST} expression
     * @param {int} directiveIndex The directive index in the binder or -1 when the event is not bound
     *                             to a directive
     */
    bindEvent(eventBindings, boundElementIndex, directiveIndex = -1) {
        var elBinder = this.elementBinders[boundElementIndex];
        var events = elBinder.hostListeners;
        if (isBlank(events)) {
            events = StringMapWrapper.create();
            elBinder.hostListeners = events;
        }
        for (var i = 0; i < eventBindings.length; i++) {
            var eventBinding = eventBindings[i];
            var eventName = eventBinding.fullName;
            var event = StringMapWrapper.get(events, eventName);
            if (isBlank(event)) {
                event = MapWrapper.create();
                StringMapWrapper.set(events, eventName, event);
            }
            MapWrapper.set(event, directiveIndex, eventBinding.source);
        }
    }
}
//# sourceMappingURL=view.js.map