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
import { CONST_EXPR } from 'angular2/src/facade/lang';
import { ListWrapper } from 'angular2/src/facade/collection';
import { Directive, onChange } from 'angular2/angular2';
import { FORWARD_REF, Binding } from 'angular2/di';
import { ControlContainerDirective } from './control_container_directive';
import { setUpControl } from './shared';
const formDirectiveBinding = CONST_EXPR(new Binding(ControlContainerDirective, { toAlias: FORWARD_REF(() => FormModelDirective) }));
/**
 * Binds a control group to a DOM element.
 *
 * # Example
 *
 * In this example, we bind the control group to the form element, and we bind the login and
 * password controls to the
 * login and password elements.
 *
 * Here we use {@link formDirectives}, rather than importing each form directive individually, e.g.
 * `ControlDirective`, `ControlGroupDirective`. This is just a shorthand for the same end result.
 *
 *  ```
 * @Component({selector: "login-comp"})
 * @View({
 *      directives: [formDirectives],
 *      template: "<form [ng-form-model]='loginForm'>" +
 *              "Login <input type='text' ng-control='login'>" +
 *              "Password <input type='password' ng-control='password'>" +
 *              "<button (click)="onLogin()">Login</button>" +
 *              "</form>"
 *      })
 * class LoginComp {
 *  loginForm:ControlGroup;
 *
 *  constructor() {
 *    this.loginForm = new ControlGroup({
 *      login: new Control(""),
 *      password: new Control("")
 *    });
 *  }
 *
 *  onLogin() {
 *    // this.loginForm.value
 *  }
 * }
 *
 *  ```
 *
 * @exportedAs angular2/forms
 */
export let FormModelDirective = class extends ControlContainerDirective {
    constructor() {
        super();
        this.form = null;
        this.directives = [];
    }
    onChange(_) { this._updateDomValue(); }
    get formDirective() { return this; }
    get path() { return []; }
    addControl(dir) {
        var c = this.form.find(dir.path);
        setUpControl(c, dir);
        c.updateValidity();
        ListWrapper.push(this.directives, dir);
    }
    getControl(dir) { return this.form.find(dir.path); }
    removeControl(dir) { ListWrapper.remove(this.directives, dir); }
    addControlGroup(dir) { }
    removeControlGroup(dir) { }
    updateModel(dir, value) {
        var c = this.form.find(dir.path);
        c.updateValue(value);
    }
    _updateDomValue() {
        ListWrapper.forEach(this.directives, dir => {
            var c = this.form.find(dir.path);
            dir.valueAccessor.writeValue(c.value);
        });
    }
};
FormModelDirective = __decorate([
    Directive({
        selector: '[ng-form-model]',
        hostInjector: [formDirectiveBinding],
        properties: ['form: ng-form-model'],
        lifecycle: [onChange]
    }), 
    __metadata('design:paramtypes', [])
], FormModelDirective);
//# sourceMappingURL=form_model_directive.js.map