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
import { PromiseWrapper } from 'angular2/src/facade/async';
import { BaseException } from 'angular2/src/facade/lang';
import { DOM } from 'angular2/src/dom/dom_adapter';
import { ViewDefinition, ProtoViewDto, RenderCompiler } from '../../api';
import { CompilePipeline } from './compile_pipeline';
import { TemplateLoader } from 'angular2/src/render/dom/compiler/template_loader';
import { DefaultStepFactory } from './compile_step_factory';
import { Parser } from 'angular2/change_detection';
import { ShadowDomStrategy } from '../shadow_dom/shadow_dom_strategy';
/**
 * The compiler loads and translates the html templates of components into
 * nested ProtoViews. To decompose its functionality it uses
 * the CompilePipeline and the CompileSteps.
 */
export class DomCompiler extends RenderCompiler {
    constructor(stepFactory, templateLoader) {
        super();
        this._templateLoader = templateLoader;
        this._stepFactory = stepFactory;
    }
    compile(template) {
        var tplPromise = this._templateLoader.load(template);
        return PromiseWrapper.then(tplPromise, (el) => this._compileTemplate(template, el, ProtoViewDto.COMPONENT_VIEW_TYPE), (e) => {
            throw new BaseException(`Failed to load the template for "${template.componentId}" : ${e}`);
        });
    }
    compileHost(directiveMetadata) {
        var hostViewDef = new ViewDefinition({
            componentId: directiveMetadata.id,
            absUrl: null, template: null,
            directives: [directiveMetadata]
        });
        var element = DOM.createElement(directiveMetadata.selector);
        return this._compileTemplate(hostViewDef, element, ProtoViewDto.HOST_VIEW_TYPE);
    }
    _compileTemplate(viewDef, tplElement, protoViewType) {
        var subTaskPromises = [];
        var pipeline = new CompilePipeline(this._stepFactory.createSteps(viewDef, subTaskPromises));
        var compileElements = pipeline.process(tplElement, protoViewType, viewDef.componentId);
        var protoView = compileElements[0].inheritedProtoView.build();
        if (subTaskPromises.length > 0) {
            return PromiseWrapper.all(subTaskPromises).then((_) => protoView);
        }
        else {
            return PromiseWrapper.resolve(protoView);
        }
    }
}
export let DefaultDomCompiler = class extends DomCompiler {
    constructor(parser, shadowDomStrategy, templateLoader) {
        super(new DefaultStepFactory(parser, shadowDomStrategy), templateLoader);
    }
};
DefaultDomCompiler = __decorate([
    Injectable(), 
    __metadata('design:paramtypes', [Parser, ShadowDomStrategy, TemplateLoader])
], DefaultDomCompiler);
//# sourceMappingURL=compiler.js.map