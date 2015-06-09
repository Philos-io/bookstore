import { isPresent, isBlank, BaseException } from 'angular2/src/facade/lang';
import { ListWrapper, MapWrapper } from 'angular2/src/facade/collection';
import { DOM } from 'angular2/src/dom/dom_adapter';
import { ASTWithSource, AstTransformer, AccessMember, LiteralArray, ImplicitReceiver } from 'angular2/change_detection';
import { DomProtoView, DomProtoViewRef, resolveInternalDomProtoView } from './proto_view';
import { ElementBinder, Event, HostAction } from './element_binder';
import { setterFactory } from './property_setter_factory';
import * as api from '../../api';
import { NG_BINDING_CLASS, EVENT_TARGET_SEPARATOR } from '../util';
export class ProtoViewBuilder {
    constructor(rootElement, type) {
        this.rootElement = rootElement;
        this.elements = [];
        this.variableBindings = MapWrapper.create();
        this.type = type;
    }
    bindElement(element, description = null) {
        var builder = new ElementBinderBuilder(this.elements.length, element, description);
        ListWrapper.push(this.elements, builder);
        DOM.addClass(element, NG_BINDING_CLASS);
        return builder;
    }
    bindVariable(name, value) {
        // Store the variable map from value to variable, reflecting how it will be used later by
        // DomView. When a local is set to the view, a lookup for the variable name will take place
        // keyed
        // by the "value", or exported identifier. For example, ng-for sets a view local of "index".
        // When this occurs, a lookup keyed by "index" must occur to find if there is a var referencing
        // it.
        MapWrapper.set(this.variableBindings, value, name);
    }
    build() {
        var renderElementBinders = [];
        var apiElementBinders = [];
        var transitiveContentTagCount = 0;
        ListWrapper.forEach(this.elements, (ebb) => {
            var propertySetters = MapWrapper.create();
            var hostActions = MapWrapper.create();
            var apiDirectiveBinders = ListWrapper.map(ebb.directives, (dbb) => {
                ebb.eventBuilder.merge(dbb.eventBuilder);
                MapWrapper.forEach(dbb.hostPropertyBindings, (_, hostPropertyName) => {
                    MapWrapper.set(propertySetters, hostPropertyName, setterFactory(hostPropertyName));
                });
                ListWrapper.forEach(dbb.hostActions, (hostAction) => {
                    MapWrapper.set(hostActions, hostAction.actionExpression, hostAction.expression);
                });
                return new api.DirectiveBinder({
                    directiveIndex: dbb.directiveIndex,
                    propertyBindings: dbb.propertyBindings,
                    eventBindings: dbb.eventBindings,
                    hostPropertyBindings: dbb.hostPropertyBindings
                });
            });
            MapWrapper.forEach(ebb.propertyBindings, (_, propertyName) => {
                MapWrapper.set(propertySetters, propertyName, setterFactory(propertyName));
            });
            var nestedProtoView = isPresent(ebb.nestedProtoView) ? ebb.nestedProtoView.build() : null;
            var nestedRenderProtoView = isPresent(nestedProtoView) ? resolveInternalDomProtoView(nestedProtoView.render) : null;
            if (isPresent(nestedRenderProtoView)) {
                transitiveContentTagCount += nestedRenderProtoView.transitiveContentTagCount;
            }
            if (isPresent(ebb.contentTagSelector)) {
                transitiveContentTagCount++;
            }
            var parentIndex = isPresent(ebb.parent) ? ebb.parent.index : -1;
            ListWrapper.push(apiElementBinders, new api.ElementBinder({
                index: ebb.index,
                parentIndex: parentIndex,
                distanceToParent: ebb.distanceToParent,
                directives: apiDirectiveBinders,
                nestedProtoView: nestedProtoView,
                propertyBindings: ebb.propertyBindings,
                variableBindings: ebb.variableBindings,
                eventBindings: ebb.eventBindings,
                textBindings: ebb.textBindings,
                readAttributes: ebb.readAttributes
            }));
            ListWrapper.push(renderElementBinders, new ElementBinder({
                textNodeIndices: ebb.textBindingIndices,
                contentTagSelector: ebb.contentTagSelector,
                parentIndex: parentIndex,
                distanceToParent: ebb.distanceToParent,
                nestedProtoView: isPresent(nestedProtoView) ?
                    resolveInternalDomProtoView(nestedProtoView.render) :
                    null,
                componentId: ebb.componentId,
                eventLocals: new LiteralArray(ebb.eventBuilder.buildEventLocals()),
                localEvents: ebb.eventBuilder.buildLocalEvents(),
                globalEvents: ebb.eventBuilder.buildGlobalEvents(),
                hostActions: hostActions,
                propertySetters: propertySetters
            }));
        });
        return new api.ProtoViewDto({
            render: new DomProtoViewRef(new DomProtoView({
                element: this.rootElement,
                elementBinders: renderElementBinders,
                transitiveContentTagCount: transitiveContentTagCount
            })),
            type: this.type,
            elementBinders: apiElementBinders,
            variableBindings: this.variableBindings
        });
    }
}
export class ElementBinderBuilder {
    constructor(index, element, description) {
        this.element = element;
        this.index = index;
        this.parent = null;
        this.distanceToParent = 0;
        this.directives = [];
        this.nestedProtoView = null;
        this.propertyBindings = MapWrapper.create();
        this.variableBindings = MapWrapper.create();
        this.eventBindings = ListWrapper.create();
        this.eventBuilder = new EventBuilder();
        this.textBindings = [];
        this.textBindingIndices = [];
        this.contentTagSelector = null;
        this.componentId = null;
        this.readAttributes = MapWrapper.create();
    }
    setParent(parent, distanceToParent) {
        this.parent = parent;
        if (isPresent(parent)) {
            this.distanceToParent = distanceToParent;
        }
        return this;
    }
    readAttribute(attrName) {
        if (isBlank(MapWrapper.get(this.readAttributes, attrName))) {
            MapWrapper.set(this.readAttributes, attrName, DOM.getAttribute(this.element, attrName));
        }
    }
    bindDirective(directiveIndex) {
        var directive = new DirectiveBuilder(directiveIndex);
        ListWrapper.push(this.directives, directive);
        return directive;
    }
    bindNestedProtoView(rootElement) {
        if (isPresent(this.nestedProtoView)) {
            throw new BaseException('Only one nested view per element is allowed');
        }
        this.nestedProtoView = new ProtoViewBuilder(rootElement, api.ProtoViewDto.EMBEDDED_VIEW_TYPE);
        return this.nestedProtoView;
    }
    bindProperty(name, expression) { MapWrapper.set(this.propertyBindings, name, expression); }
    bindVariable(name, value) {
        // When current is a view root, the variable bindings are set to the *nested* proto view.
        // The root view conceptually signifies a new "block scope" (the nested view), to which
        // the variables are bound.
        if (isPresent(this.nestedProtoView)) {
            this.nestedProtoView.bindVariable(name, value);
        }
        else {
            // Store the variable map from value to variable, reflecting how it will be used later by
            // DomView. When a local is set to the view, a lookup for the variable name will take place
            // keyed
            // by the "value", or exported identifier. For example, ng-for sets a view local of "index".
            // When this occurs, a lookup keyed by "index" must occur to find if there is a var
            // referencing
            // it.
            MapWrapper.set(this.variableBindings, value, name);
        }
    }
    bindEvent(name, expression, target = null) {
        ListWrapper.push(this.eventBindings, this.eventBuilder.add(name, expression, target));
    }
    bindText(index, expression) {
        ListWrapper.push(this.textBindingIndices, index);
        ListWrapper.push(this.textBindings, expression);
    }
    setContentTagSelector(value) { this.contentTagSelector = value; }
    setComponentId(componentId) { this.componentId = componentId; }
}
export class DirectiveBuilder {
    constructor(directiveIndex) {
        this.directiveIndex = directiveIndex;
        this.propertyBindings = MapWrapper.create();
        this.hostPropertyBindings = MapWrapper.create();
        this.hostActions = ListWrapper.create();
        this.eventBindings = ListWrapper.create();
        this.eventBuilder = new EventBuilder();
    }
    bindProperty(name, expression) { MapWrapper.set(this.propertyBindings, name, expression); }
    bindHostProperty(name, expression) {
        MapWrapper.set(this.hostPropertyBindings, name, expression);
    }
    bindHostAction(actionName, actionExpression, expression) {
        ListWrapper.push(this.hostActions, new HostAction(actionName, actionExpression, expression));
    }
    bindEvent(name, expression, target = null) {
        ListWrapper.push(this.eventBindings, this.eventBuilder.add(name, expression, target));
    }
}
export class EventBuilder extends AstTransformer {
    constructor() {
        super();
        this.locals = [];
        this.localEvents = [];
        this.globalEvents = [];
        this._implicitReceiver = new ImplicitReceiver();
    }
    add(name, source, target) {
        // TODO(tbosch): reenable this when we are parsing element properties
        // out of action expressions
        // var adjustedAst = astWithSource.ast.visit(this);
        var adjustedAst = source.ast;
        var fullName = isPresent(target) ? target + EVENT_TARGET_SEPARATOR + name : name;
        var result = new api.EventBinding(fullName, new ASTWithSource(adjustedAst, source.source, source.location));
        var event = new Event(name, target, fullName);
        if (isBlank(target)) {
            ListWrapper.push(this.localEvents, event);
        }
        else {
            ListWrapper.push(this.globalEvents, event);
        }
        return result;
    }
    visitAccessMember(ast) {
        var isEventAccess = false;
        var current = ast;
        while (!isEventAccess && (current instanceof AccessMember)) {
            var am = current;
            if (am.name == '$event') {
                isEventAccess = true;
            }
            current = am.receiver;
        }
        if (isEventAccess) {
            ListWrapper.push(this.locals, ast);
            var index = this.locals.length - 1;
            return new AccessMember(this._implicitReceiver, `${index}`, (arr) => arr[index], null);
        }
        else {
            return ast;
        }
    }
    buildEventLocals() { return this.locals; }
    buildLocalEvents() { return this.localEvents; }
    buildGlobalEvents() { return this.globalEvents; }
    merge(eventBuilder) {
        this._merge(this.localEvents, eventBuilder.localEvents);
        this._merge(this.globalEvents, eventBuilder.globalEvents);
        ListWrapper.concat(this.locals, eventBuilder.locals);
    }
    _merge(host, tobeAdded) {
        var names = ListWrapper.create();
        for (var i = 0; i < host.length; i++) {
            ListWrapper.push(names, host[i].fullName);
        }
        for (var j = 0; j < tobeAdded.length; j++) {
            if (!ListWrapper.contains(names, tobeAdded[j].fullName)) {
                ListWrapper.push(host, tobeAdded[j]);
            }
        }
    }
}
//# sourceMappingURL=proto_view_builder.js.map