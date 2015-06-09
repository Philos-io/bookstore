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
import { Binding, bind, Injectable } from 'angular2/di';
import { Compiler } from './compiler';
import { BaseException } from 'angular2/src/facade/lang';
import { AppViewManager } from 'angular2/src/core/compiler/view_manager';
import { ElementRef } from './element_ref';
/**
 * @exportedAs angular2/view
 */
export class ComponentRef {
    constructor(location, instance, dispose) {
        this.location = location;
        this.instance = instance;
        this.dispose = dispose;
    }
    get hostView() { return this.location.parentView; }
}
/**
 * Service for dynamically loading a Component into an arbitrary position in the internal Angular
 * application tree.
 *
 * @exportedAs angular2/view
 */
export let DynamicComponentLoader = class {
    constructor(compiler, viewManager) {
        this._compiler = compiler;
        this._viewManager = viewManager;
    }
    /**
     * Loads a component into the location given by the provided ElementRef. The loaded component
     * receives injection as if it in the place of the provided ElementRef.
     */
    loadIntoExistingLocation(typeOrBinding, location, injector = null) {
        var binding = this._getBinding(typeOrBinding);
        return this._compiler.compile(binding.token)
            .then(componentProtoViewRef => {
            this._viewManager.createDynamicComponentView(location, componentProtoViewRef, binding, injector);
            var component = this._viewManager.getComponent(location);
            var dispose = () => { throw new BaseException("Not implemented"); };
            return new ComponentRef(location, component, dispose);
        });
    }
    /**
     * Loads a root component that is placed at the first element that matches the
     * component's selector.
     * The loaded component receives injection normally as a hosted view.
     */
    loadAsRoot(typeOrBinding, overrideSelector = null, injector = null) {
        return this._compiler.compileInHost(this._getBinding(typeOrBinding))
            .then(hostProtoViewRef => {
            var hostViewRef = this._viewManager.createRootHostView(hostProtoViewRef, overrideSelector, injector);
            var newLocation = new ElementRef(hostViewRef, 0);
            var component = this._viewManager.getComponent(newLocation);
            var dispose = () => { this._viewManager.destroyRootHostView(hostViewRef); };
            return new ComponentRef(newLocation, component, dispose);
        });
    }
    /**
     * Loads a component into a free host view that is not yet attached to
     * a parent on the render side, although it is attached to a parent in the injector hierarchy.
     * The loaded component receives injection normally as a hosted view.
     */
    loadIntoNewLocation(typeOrBinding, parentComponentLocation, injector = null) {
        return this._compiler.compileInHost(this._getBinding(typeOrBinding))
            .then(hostProtoViewRef => {
            var hostViewRef = this._viewManager.createFreeHostView(parentComponentLocation, hostProtoViewRef, injector);
            var newLocation = new ElementRef(hostViewRef, 0);
            var component = this._viewManager.getComponent(newLocation);
            var dispose = () => {
                this._viewManager.destroyFreeHostView(parentComponentLocation, hostViewRef);
            };
            return new ComponentRef(newLocation, component, dispose);
        });
    }
    /**
     * Loads a component next to the provided ElementRef. The loaded component receives
     * injection normally as a hosted view.
     */
    loadNextToExistingLocation(typeOrBinding, location, injector = null) {
        var binding = this._getBinding(typeOrBinding);
        return this._compiler.compileInHost(binding).then(hostProtoViewRef => {
            var viewContainer = this._viewManager.getViewContainer(location);
            var hostViewRef = viewContainer.create(hostProtoViewRef, viewContainer.length, null, injector);
            var newLocation = new ElementRef(hostViewRef, 0);
            var component = this._viewManager.getComponent(newLocation);
            var dispose = () => {
                var index = viewContainer.indexOf(hostViewRef);
                viewContainer.remove(index);
            };
            return new ComponentRef(newLocation, component, dispose);
        });
    }
    _getBinding(typeOrBinding) {
        var binding;
        if (typeOrBinding instanceof Binding) {
            binding = typeOrBinding;
        }
        else {
            binding = bind(typeOrBinding).toClass(typeOrBinding);
        }
        return binding;
    }
};
DynamicComponentLoader = __decorate([
    Injectable(), 
    __metadata('design:paramtypes', [Compiler, AppViewManager])
], DynamicComponentLoader);
//# sourceMappingURL=dynamic_component_loader.js.map