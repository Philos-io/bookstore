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
import { PromiseWrapper } from 'angular2/src/facade/async';
import { ListWrapper } from 'angular2/src/facade/collection';
import { isPresent, CONST_EXPR } from 'angular2/src/facade/lang';
import { Directive } from 'angular2/src/core/annotations/decorators';
import { FORWARD_REF, Binding } from 'angular2/di';
import { ControlContainerDirective } from './control_container_directive';
import { ControlGroup, Control } from '../model';
import { setUpControl } from './shared';
const formDirectiveBinding = CONST_EXPR(new Binding(ControlContainerDirective, { toAlias: FORWARD_REF(() => TemplateDrivenFormDirective) }));
export let TemplateDrivenFormDirective = class extends ControlContainerDirective {
    constructor() {
        super();
        this.form = new ControlGroup({});
    }
    get formDirective() { return this; }
    get path() { return []; }
    get controls() { return this.form.controls; }
    get value() { return this.form.value; }
    addControl(dir) {
        this._later(_ => {
            var group = this._findContainer(dir.path);
            var c = new Control("");
            setUpControl(c, dir);
            group.addControl(dir.name, c);
        });
    }
    getControl(dir) { return this.form.find(dir.path); }
    removeControl(dir) {
        this._later(_ => {
            var c = this._findContainer(dir.path);
            if (isPresent(c))
                c.removeControl(dir.name);
        });
    }
    addControlGroup(dir) {
        this._later(_ => {
            var group = this._findContainer(dir.path);
            var c = new ControlGroup({});
            group.addControl(dir.name, c);
        });
    }
    removeControlGroup(dir) {
        this._later(_ => {
            var c = this._findContainer(dir.path);
            if (isPresent(c))
                c.removeControl(dir.name);
        });
    }
    updateModel(dir, value) {
        this._later(_ => {
            var c = this.form.find(dir.path);
            c.updateValue(value);
        });
    }
    _findContainer(path) {
        ListWrapper.removeLast(path);
        return this.form.find(path);
    }
    _later(fn) {
        var c = PromiseWrapper.completer();
        PromiseWrapper.then(c.promise, fn, (_) => { });
        c.resolve(null);
    }
};
TemplateDrivenFormDirective = __decorate([
    Directive({
        selector: 'form:not([ng-no-form]):not([ng-form-model]),ng-form,[ng-form]',
        hostInjector: [formDirectiveBinding]
    }), 
    __metadata('design:paramtypes', [])
], TemplateDrivenFormDirective);
//# sourceMappingURL=template_driven_form_directive.js.map