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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
import { Directive, Ancestor, onDestroy, onInit } from 'angular2/angular2';
import { FORWARD_REF, Binding } from 'angular2/di';
import { CONST_EXPR } from 'angular2/src/facade/lang';
import { ControlContainerDirective } from './control_container_directive';
import { controlPath } from './shared';
const controlGroupBinding = CONST_EXPR(new Binding(ControlContainerDirective, { toAlias: FORWARD_REF(() => ControlGroupDirective) }));
/**
 * Binds a ng-control group to a DOM element.
 *
 * # Example
 *
 * In this example, we create a ng-control group, and we bind the login and
 * password controls to the login and password elements.
 *
 * Here we use {@link formDirectives}, rather than importing each form directive individually, e.g.
 * `ControlDirective`, `ControlGroupDirective`. This is just a shorthand for the same end result.
 *
 *  ```
 * @Component({selector: "login-comp"})
 * @View({
 *      directives: [formDirectives],
 *      template:
 *              "<form [ng-form-model]='loginForm'>" +
 *              "<div ng-control-group="credentials">
 *              "Login <input type='text' ng-control='login'>" +
 *              "Password <input type='password' ng-control='password'>" +
 *              "<button (click)="onLogin()">Login</button>" +
 *              "</div>"
 *              "</form>"
 *      })
 * class LoginComp {
 *  loginForm:ControlGroup;
 *
 *  constructor() {
 *    this.loginForm = new ControlGroup({
 *      credentials: new ControlGroup({
 *        login: new Cntrol(""),
 *        password: new Control("")
 *      })
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
export let ControlGroupDirective = class extends ControlContainerDirective {
    constructor(_parent) {
        super();
        this._parent = _parent;
    }
    onInit() { this.formDirective.addControlGroup(this); }
    onDestroy() { this.formDirective.removeControlGroup(this); }
    get path() { return controlPath(this.name, this._parent); }
    get formDirective() { return this._parent.formDirective; }
};
ControlGroupDirective = __decorate([
    Directive({
        selector: '[ng-control-group]',
        hostInjector: [controlGroupBinding],
        properties: ['name: ng-control-group'],
        lifecycle: [onInit, onDestroy]
    }),
    __param(0, Ancestor()), 
    __metadata('design:paramtypes', [ControlContainerDirective])
], ControlGroupDirective);
//# sourceMappingURL=control_group_directive.js.map