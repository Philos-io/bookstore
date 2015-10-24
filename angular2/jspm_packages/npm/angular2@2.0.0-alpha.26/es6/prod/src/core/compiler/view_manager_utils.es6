var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") return Reflect.decorate(decorators, target, key, desc);
    switch (arguments.length) {
        case 2: return decorators.reduceRight(function(o, d) { return (d && d(o)) || o; }, target);
        case 3: return decorators.reduceRight(function(o, d) { return (d && d(target, key)), void 0; }, void 0);
        case 4: return decorators.reduceRight(function(o, d) { return (d && d(target, key, o)) || o; }, desc);
    }
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Injectable } from 'angular2/di';
import { ListWrapper } from 'angular2/src/facade/collection';
import * as eli from './element_injector';
import { isPresent, isBlank, BaseException } from 'angular2/src/facade/lang';
import * as viewModule from './view';
import { DirectiveResolver } from './directive_resolver';
export let AppViewManagerUtils = class {
    constructor(metadataReader) {
        this._directiveResolver = metadataReader;
    }
    getComponentInstance(parentView, boundElementIndex) {
        var binder = parentView.proto.elementBinders[boundElementIndex];
        var eli = parentView.elementInjectors[boundElementIndex];
        if (binder.hasDynamicComponent()) {
            return eli.getDynamicallyLoadedComponent();
        }
        else {
            return eli.getComponent();
        }
    }
    createView(protoView, renderView, viewManager, renderer) {
        var view = new viewModule.AppView(renderer, protoView, protoView.protoLocals);
        // TODO(tbosch): pass RenderViewRef as argument to AppView!
        view.render = renderView;
        var changeDetector = protoView.protoChangeDetector.instantiate(view);
        var binders = protoView.elementBinders;
        var elementInjectors = ListWrapper.createFixedSize(binders.length);
        var rootElementInjectors = [];
        var preBuiltObjects = ListWrapper.createFixedSize(binders.length);
        var componentChildViews = ListWrapper.createFixedSize(binders.length);
        for (var binderIdx = 0; binderIdx < binders.length; binderIdx++) {
            var binder = binders[binderIdx];
            var elementInjector = null;
            // elementInjectors and rootElementInjectors
            var protoElementInjector = binder.protoElementInjector;
            if (isPresent(protoElementInjector)) {
                if (isPresent(protoElementInjector.parent)) {
                    var parentElementInjector = elementInjectors[protoElementInjector.parent.index];
                    elementInjector = protoElementInjector.instantiate(parentElementInjector);
                }
                else {
                    elementInjector = protoElementInjector.instantiate(null);
                    ListWrapper.push(rootElementInjectors, elementInjector);
                }
            }
            elementInjectors[binderIdx] = elementInjector;
            // preBuiltObjects
            if (isPresent(elementInjector)) {
                var embeddedProtoView = binder.hasEmbeddedProtoView() ? binder.nestedProtoView : null;
                preBuiltObjects[binderIdx] = new eli.PreBuiltObjects(viewManager, view, embeddedProtoView);
            }
        }
        view.init(changeDetector, elementInjectors, rootElementInjectors, preBuiltObjects, componentChildViews);
        return view;
    }
    attachComponentView(hostView, boundElementIndex, componentView) {
        var childChangeDetector = componentView.changeDetector;
        hostView.changeDetector.addShadowDomChild(childChangeDetector);
        hostView.componentChildViews[boundElementIndex] = componentView;
    }
    detachComponentView(hostView, boundElementIndex) {
        var componentView = hostView.componentChildViews[boundElementIndex];
        hostView.changeDetector.removeShadowDomChild(componentView.changeDetector);
        hostView.componentChildViews[boundElementIndex] = null;
    }
    hydrateComponentView(hostView, boundElementIndex, injector = null) {
        var elementInjector = hostView.elementInjectors[boundElementIndex];
        var componentView = hostView.componentChildViews[boundElementIndex];
        var component = this.getComponentInstance(hostView, boundElementIndex);
        this._hydrateView(componentView, injector, elementInjector, component, null);
    }
    hydrateRootHostView(hostView, injector = null) {
        this._hydrateView(hostView, injector, null, new Object(), null);
    }
    attachAndHydrateFreeHostView(parentComponentHostView, parentComponentBoundElementIndex, hostView, injector = null) {
        var hostElementInjector = parentComponentHostView.elementInjectors[parentComponentBoundElementIndex];
        var parentView = parentComponentHostView.componentChildViews[parentComponentBoundElementIndex];
        parentView.changeDetector.addChild(hostView.changeDetector);
        ListWrapper.push(parentView.freeHostViews, hostView);
        this._hydrateView(hostView, injector, hostElementInjector, new Object(), null);
    }
    detachFreeHostView(parentView, hostView) {
        parentView.changeDetector.removeChild(hostView.changeDetector);
        ListWrapper.remove(parentView.freeHostViews, hostView);
    }
    attachAndHydrateFreeEmbeddedView(parentView, boundElementIndex, view, injector = null) {
        parentView.changeDetector.addChild(view.changeDetector);
        var viewContainer = this._getOrCreateViewContainer(parentView, boundElementIndex);
        ListWrapper.push(viewContainer.freeViews, view);
        var elementInjector = parentView.elementInjectors[boundElementIndex];
        for (var i = view.rootElementInjectors.length - 1; i >= 0; i--) {
            view.rootElementInjectors[i].link(elementInjector);
        }
        this._hydrateView(view, injector, elementInjector, parentView.context, parentView.locals);
    }
    detachFreeEmbeddedView(parentView, boundElementIndex, view) {
        var viewContainer = parentView.viewContainers[boundElementIndex];
        view.changeDetector.remove();
        ListWrapper.remove(viewContainer.freeViews, view);
        for (var i = 0; i < view.rootElementInjectors.length; ++i) {
            view.rootElementInjectors[i].unlink();
        }
    }
    attachViewInContainer(parentView, boundElementIndex, contextView, contextBoundElementIndex, atIndex, view) {
        if (isBlank(contextView)) {
            contextView = parentView;
            contextBoundElementIndex = boundElementIndex;
        }
        parentView.changeDetector.addChild(view.changeDetector);
        var viewContainer = this._getOrCreateViewContainer(parentView, boundElementIndex);
        ListWrapper.insert(viewContainer.views, atIndex, view);
        var sibling;
        if (atIndex == 0) {
            sibling = null;
        }
        else {
            sibling = ListWrapper.last(viewContainer.views[atIndex - 1].rootElementInjectors);
        }
        var elementInjector = contextView.elementInjectors[contextBoundElementIndex];
        for (var i = view.rootElementInjectors.length - 1; i >= 0; i--) {
            view.rootElementInjectors[i].linkAfter(elementInjector, sibling);
        }
    }
    detachViewInContainer(parentView, boundElementIndex, atIndex) {
        var viewContainer = parentView.viewContainers[boundElementIndex];
        var view = viewContainer.views[atIndex];
        view.changeDetector.remove();
        ListWrapper.removeAt(viewContainer.views, atIndex);
        for (var i = 0; i < view.rootElementInjectors.length; ++i) {
            view.rootElementInjectors[i].unlink();
        }
    }
    hydrateViewInContainer(parentView, boundElementIndex, contextView, contextBoundElementIndex, atIndex, injector) {
        if (isBlank(contextView)) {
            contextView = parentView;
            contextBoundElementIndex = boundElementIndex;
        }
        var viewContainer = parentView.viewContainers[boundElementIndex];
        var view = viewContainer.views[atIndex];
        var elementInjector = contextView.elementInjectors[contextBoundElementIndex].getHost();
        this._hydrateView(view, injector, elementInjector, contextView.context, contextView.locals);
    }
    hydrateDynamicComponentInElementInjector(hostView, boundElementIndex, componentBinding, injector = null) {
        var elementInjector = hostView.elementInjectors[boundElementIndex];
        if (isPresent(elementInjector.getDynamicallyLoadedComponent())) {
            throw new BaseException(`There already is a dynamic component loaded at element ${boundElementIndex}`);
        }
        if (isBlank(injector)) {
            injector = elementInjector.getLightDomAppInjector();
        }
        var annotation = this._directiveResolver.resolve(componentBinding.token);
        var componentDirective = eli.DirectiveBinding.createFromBinding(componentBinding, annotation);
        elementInjector.dynamicallyCreateComponent(componentDirective, injector);
    }
    _hydrateView(view, appInjector, hostElementInjector, context, parentLocals) {
        if (isBlank(appInjector)) {
            appInjector = hostElementInjector.getShadowDomAppInjector();
        }
        if (isBlank(appInjector)) {
            appInjector = hostElementInjector.getLightDomAppInjector();
        }
        view.context = context;
        view.locals.parent = parentLocals;
        var binders = view.proto.elementBinders;
        for (var i = 0; i < binders.length; ++i) {
            var elementInjector = view.elementInjectors[i];
            if (isPresent(elementInjector)) {
                elementInjector.hydrate(appInjector, hostElementInjector, view.preBuiltObjects[i]);
                this._setUpEventEmitters(view, elementInjector, i);
                this._setUpHostActions(view, elementInjector, i);
                // The exporting of $implicit is a special case. Since multiple elements will all export
                // the different values as $implicit, directly assign $implicit bindings to the variable
                // name.
                var exportImplicitName = elementInjector.getExportImplicitName();
                if (elementInjector.isExportingComponent()) {
                    view.locals.set(exportImplicitName, elementInjector.getComponent());
                }
                else if (elementInjector.isExportingElement()) {
                    view.locals.set(exportImplicitName, elementInjector.getElementRef().domElement);
                }
            }
        }
        view.changeDetector.hydrate(view.context, view.locals, view);
    }
    _getOrCreateViewContainer(parentView, boundElementIndex) {
        var viewContainer = parentView.viewContainers[boundElementIndex];
        if (isBlank(viewContainer)) {
            viewContainer = new viewModule.AppViewContainer();
            parentView.viewContainers[boundElementIndex] = viewContainer;
        }
        return viewContainer;
    }
    _setUpEventEmitters(view, elementInjector, boundElementIndex) {
        var emitters = elementInjector.getEventEmitterAccessors();
        for (var directiveIndex = 0; directiveIndex < emitters.length; ++directiveIndex) {
            var directiveEmitters = emitters[directiveIndex];
            var directive = elementInjector.getDirectiveAtIndex(directiveIndex);
            for (var eventIndex = 0; eventIndex < directiveEmitters.length; ++eventIndex) {
                var eventEmitterAccessor = directiveEmitters[eventIndex];
                eventEmitterAccessor.subscribe(view, boundElementIndex, directive);
            }
        }
    }
    _setUpHostActions(view, elementInjector, boundElementIndex) {
        var hostActions = elementInjector.getHostActionAccessors();
        for (var directiveIndex = 0; directiveIndex < hostActions.length; ++directiveIndex) {
            var directiveHostActions = hostActions[directiveIndex];
            var directive = elementInjector.getDirectiveAtIndex(directiveIndex);
            for (var index = 0; index < directiveHostActions.length; ++index) {
                var hostActionAccessor = directiveHostActions[index];
                hostActionAccessor.subscribe(view, boundElementIndex, directive);
            }
        }
    }
    dehydrateView(view) {
        var binders = view.proto.elementBinders;
        for (var i = 0; i < binders.length; ++i) {
            var elementInjector = view.elementInjectors[i];
            if (isPresent(elementInjector)) {
                elementInjector.dehydrate();
            }
        }
        if (isPresent(view.locals)) {
            view.locals.clearValues();
        }
        view.context = null;
        view.changeDetector.dehydrate();
    }
};
AppViewManagerUtils = __decorate([
    Injectable(), 
    __metadata('design:paramtypes', [DirectiveResolver])
], AppViewManagerUtils);
//# sourceMappingURL=view_manager_utils.js.map