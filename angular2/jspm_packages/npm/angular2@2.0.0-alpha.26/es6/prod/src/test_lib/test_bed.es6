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
import { Injector, bind, Injectable } from 'angular2/di';
import { isPresent, BaseException } from 'angular2/src/facade/lang';
import { isBlank } from 'angular2/src/facade/lang';
import { TemplateResolver } from 'angular2/src/core/compiler/template_resolver';
import { internalView } from 'angular2/src/core/compiler/view_ref';
import { DynamicComponentLoader } from 'angular2/src/core/compiler/dynamic_component_loader';
import { queryView, viewRootNodes, el } from './utils';
import { instantiateType, getTypeOf } from './lang_utils';
import { DOCUMENT_TOKEN } from 'angular2/src/render/dom/dom_renderer';
import { DOM } from 'angular2/src/dom/dom_adapter';
/**
 * @exportedAs angular2/test
 * TODO(juliemr): Deprecate in favor of TestComponentBuilder
 */
export let TestBed = class {
    constructor(injector) {
        this._injector = injector;
    }
    /**
     * Overrides the {@link View} of a {@link Component}.
     *
     * @see setInlineTemplate() to only override the html
     *
     * @param {Type} component
     * @param {ViewDefinition} template
     */
    overrideView(component, template) {
        this._injector.get(TemplateResolver).setView(component, template);
    }
    /**
     * Overrides only the html of a {@link Component}.
     * All the other propoerties of the component's {@link View} are preserved.
     *
     * @param {Type} component
     * @param {string} html
     */
    setInlineTemplate(component, html) {
        this._injector.get(TemplateResolver).setInlineTemplate(component, html);
    }
    /**
     * Overrides the directives from the component {@link View}.
     *
     * @param {Type} component
     * @param {Type} from
     * @param {Type} to
     */
    overrideDirective(component, from, to) {
        this._injector.get(TemplateResolver).overrideViewDirective(component, from, to);
    }
    /**
     * Creates an `AppView` for the given component.
     *
     * Only either a component or a context needs to be specified but both can be provided for
     * advanced use cases (ie subclassing the context).
     *
     * @param {Type} component
     * @param {*} context
     * @param {string} html Use as the component template when specified (shortcut for
     * setInlineTemplate)
     * @return {Promise<ViewProxy>}
     */
    createView(component, { context = null, html = null } = {}) {
        if (isBlank(component) && isBlank(context)) {
            throw new BaseException('You must specified at least a component or a context');
        }
        if (isBlank(component)) {
            component = getTypeOf(context);
        }
        else if (isBlank(context)) {
            context = instantiateType(component);
        }
        if (isPresent(html)) {
            this.setInlineTemplate(component, html);
        }
        var doc = this._injector.get(DOCUMENT_TOKEN);
        var rootEl = el('<div id="root"></div>');
        DOM.appendChild(doc.body, rootEl);
        var componentBinding = bind(component).toValue(context);
        return this._injector.get(DynamicComponentLoader)
            .loadAsRoot(componentBinding, '#root', this._injector)
            .then((hostComponentRef) => { return new ViewProxy(hostComponentRef); });
    }
};
TestBed = __decorate([
    Injectable(), 
    __metadata('design:paramtypes', [Injector])
], TestBed);
/**
 * Proxy to `AppView` return by `createView` in {@link TestBed} which offers a high level API for
 * tests.
 * TODO(juliemr): Deprecate in favor of TestElement
 */
export class ViewProxy {
    constructor(componentRef) {
        this._componentRef = componentRef;
        this._view = internalView(componentRef.hostView).componentChildViews[0];
    }
    get context() { return this._view.context; }
    get rootNodes() { return viewRootNodes(this._view); }
    detectChanges() {
        this._view.changeDetector.detectChanges();
        this._view.changeDetector.checkNoChanges();
    }
    querySelector(selector) { return queryView(this._view, selector); }
    destroy() { this._componentRef.dispose(); }
    /**
     * @returns `AppView` returns the underlying `AppView`.
     *
     * Prefer using the other methods which hide implementation details.
     */
    get rawView() { return this._view; }
}
//# sourceMappingURL=test_bed.js.map