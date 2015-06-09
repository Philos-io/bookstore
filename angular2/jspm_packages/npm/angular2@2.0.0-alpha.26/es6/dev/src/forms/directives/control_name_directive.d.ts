import { EventEmitter } from 'angular2/src/facade/async';
import { ControlContainerDirective } from './control_container_directive';
import { ControlDirective } from './control_directive';
import { Control } from '../model';
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
export declare class ControlNameDirective extends ControlDirective {
    _parent: ControlContainerDirective;
    ngModel: EventEmitter;
    model: any;
    _added: boolean;
    constructor(_parent: ControlContainerDirective);
    onChange(c: StringMap<string, any>): void;
    onDestroy(): void;
    viewToModelUpdate(newValue: any): void;
    path: List<string>;
    formDirective: any;
    control: Control;
}
