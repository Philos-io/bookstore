import { ControlDirective } from './control_directive';
import { ControlGroupDirective } from './control_group_directive';
import { ControlContainerDirective } from './control_container_directive';
import { FormDirective } from './form_directive';
import { Control, ControlGroup } from '../model';
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
export declare class FormModelDirective extends ControlContainerDirective implements FormDirective {
    form: ControlGroup;
    directives: List<ControlDirective>;
    constructor();
    onChange(_: any): void;
    formDirective: FormDirective;
    path: List<string>;
    addControl(dir: ControlDirective): void;
    getControl(dir: ControlDirective): Control;
    removeControl(dir: ControlDirective): void;
    addControlGroup(dir: ControlGroupDirective): void;
    removeControlGroup(dir: ControlGroupDirective): void;
    updateModel(dir: ControlDirective, value: any): void;
    _updateDomValue(): void;
}
