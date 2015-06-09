import { ControlContainerDirective } from './control_container_directive';
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
export declare class ControlGroupDirective extends ControlContainerDirective {
    _parent: ControlContainerDirective;
    constructor(_parent: ControlContainerDirective);
    onInit(): void;
    onDestroy(): void;
    path: List<string>;
    formDirective: any;
}
