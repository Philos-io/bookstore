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
import { CONST_EXPR } from 'angular2/src/facade/lang';
import { EventEmitter, ObservableWrapper } from 'angular2/src/facade/async';
import { StringMapWrapper } from 'angular2/src/facade/collection';
import { Directive, Ancestor, onDestroy, onChange } from 'angular2/angular2';
import { FORWARD_REF, Binding } from 'angular2/di';
import { ControlContainerDirective } from './control_container_directive';
import { ControlDirective } from './control_directive';
import { controlPath } from './shared';
const controlNameBinding = CONST_EXPR(new Binding(ControlDirective, { toAlias: FORWARD_REF(() => ControlNameDirective) }));
/**
 * Binds a control with the specified name to a DOM element.
 *
 * # Example
 *
 * In this example, we bind the login control to an input element. When the value of the input
 * element
 * changes, the value of
 * the control will reflect that change. Likewise, if the value of the control changes, the input
 * element reflects that
 * change.
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
 *              "Login <input type='text' ng-control='login'>" +
 *              "<button (click)="onLogin()">Login</button>" +
 *              "</form>"
 *      })
 * class LoginComp {
 *  loginForm:ControlGroup;
 *
 *  constructor() {
 *    this.loginForm = new ControlGroup({
 *      login: new Control(""),
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
export let ControlNameDirective = class extends ControlDirective {
    constructor(_parent) {
        super();
        this._parent = _parent;
        this.ngModel = new EventEmitter();
        this._added = false;
    }
    onChange(c) {
        if (!this._added) {
            this.formDirective.addControl(this);
            this._added = true;
        }
        if (StringMapWrapper.contains(c, "model")) {
            this.formDirective.updateModel(this, this.model);
        }
    }
    onDestroy() { this.formDirective.removeControl(this); }
    viewToModelUpdate(newValue) { ObservableWrapper.callNext(this.ngModel, newValue); }
    get path() { return controlPath(this.name, this._parent); }
    get formDirective() { return this._parent.formDirective; }
    get control() { return this.formDirective.getControl(this); }
};
ControlNameDirective = __decorate([
    Directive({
        selector: '[ng-control]',
        hostInjector: [controlNameBinding],
        properties: ['name: ng-control', 'model: ng-model'],
        events: ['ngModel'],
        lifecycle: [onDestroy, onChange]
    }),
    __param(0, Ancestor()), 
    __metadata('design:paramtypes', [ControlContainerDirective])
], ControlNameDirective);
//# sourceMappingURL=control_name_directive.js.map