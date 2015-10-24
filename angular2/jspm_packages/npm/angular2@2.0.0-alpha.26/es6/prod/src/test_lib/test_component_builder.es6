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
import { Injector, Injectable } from 'angular2/di';
import { isPresent } from 'angular2/src/facade/lang';
import { MapWrapper } from 'angular2/src/facade/collection';
import { TemplateResolver } from 'angular2/src/core/compiler/template_resolver';
import { internalView } from 'angular2/src/core/compiler/view_ref';
import { DynamicComponentLoader } from 'angular2/src/core/compiler/dynamic_component_loader';
import { el } from './utils';
import { DOCUMENT_TOKEN } from 'angular2/src/render/dom/dom_renderer';
import { DOM } from 'angular2/src/dom/dom_adapter';
import { DebugElement } from 'angular2/src/debug/debug_element';
/**
 * @exportedAs angular2/test
 */
export class RootTestComponent extends DebugElement {
    constructor(componentRef) {
        super(internalView(componentRef.hostView), 0);
        this._componentParentView = internalView(componentRef.hostView);
        this._componentRef = componentRef;
    }
    detectChanges() {
        this._componentParentView.changeDetector.detectChanges();
        this._componentParentView.changeDetector.checkNoChanges();
    }
    destroy() { this._componentRef.dispose(); }
}
var _nextRootElementId = 0;
/**
 * @exportedAs angular2/test
 *
 * Builds a RootTestComponent for use in component level tests.
 */
export let TestComponentBuilder = class {
    constructor(injector) {
        this._injector = injector;
        this._viewOverrides = MapWrapper.create();
        this._directiveOverrides = MapWrapper.create();
        this._templateOverrides = MapWrapper.create();
    }
    _clone() {
        var clone = new TestComponentBuilder(this._injector);
        clone._viewOverrides = MapWrapper.clone(this._viewOverrides);
        clone._directiveOverrides = MapWrapper.clone(this._directiveOverrides);
        clone._templateOverrides = MapWrapper.clone(this._templateOverrides);
        return clone;
    }
    /**
     * Overrides only the html of a {@link Component}.
     * All the other propoerties of the component's {@link View} are preserved.
     *
     * @param {Type} component
     * @param {string} html
     *
     * @return {TestComponentBuilder}
     */
    overrideTemplate(componentType, template) {
        var clone = this._clone();
        MapWrapper.set(clone._templateOverrides, componentType, template);
        return clone;
    }
    /**
     * Overrides a component's {@link View}.
     *
     * @param {Type} component
     * @param {view} View
     *
     * @return {TestComponentBuilder}
     */
    overrideView(componentType, view) {
        var clone = this._clone();
        MapWrapper.set(clone._viewOverrides, componentType, view);
        return clone;
    }
    /**
     * Overrides the directives from the component {@link View}.
     *
     * @param {Type} component
     * @param {Type} from
     * @param {Type} to
     *
     * @return {TestComponentBuilder}
     */
    overrideDirective(componentType, from, to) {
        var clone = this._clone();
        var overridesForComponent = MapWrapper.get(clone._directiveOverrides, componentType);
        if (!isPresent(overridesForComponent)) {
            MapWrapper.set(clone._directiveOverrides, componentType, MapWrapper.create());
            overridesForComponent = MapWrapper.get(clone._directiveOverrides, componentType);
        }
        MapWrapper.set(overridesForComponent, from, to);
        return clone;
    }
    /**
     * Builds and returns a RootTestComponent.
     *
     * @return {Promise<RootTestComponent>}
     */
    createAsync(rootComponentType) {
        var mockTemplateResolver = this._injector.get(TemplateResolver);
        MapWrapper.forEach(this._viewOverrides, (view, type) => { mockTemplateResolver.setView(type, view); });
        MapWrapper.forEach(this._templateOverrides, (template, type) => {
            mockTemplateResolver.setInlineTemplate(type, template);
        });
        MapWrapper.forEach(this._directiveOverrides, (overrides, component) => {
            MapWrapper.forEach(overrides, (to, from) => {
                mockTemplateResolver.overrideViewDirective(component, from, to);
            });
        });
        var rootElId = `root${_nextRootElementId++}`;
        var rootEl = el(`<div id="${rootElId}"></div>`);
        var doc = this._injector.get(DOCUMENT_TOKEN);
        // TODO(juliemr): can/should this be optional?
        DOM.appendChild(doc.body, rootEl);
        return this._injector.get(DynamicComponentLoader)
            .loadAsRoot(rootComponentType, `#${rootElId}`, this._injector)
            .then((componentRef) => { return new RootTestComponent(componentRef); });
    }
};
TestComponentBuilder = __decorate([
    Injectable(), 
    __metadata('design:paramtypes', [Injector])
], TestComponentBuilder);
//# sourceMappingURL=test_component_builder.js.map