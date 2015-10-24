import { EventEmitter } from 'angular2/src/facade/async';
import { ControlDirective } from './control_directive';
import { Control } from '../model';
/**
 * Binds a control to a DOM element.
 *
 * # Example
 *
 * In this example, we bind the control to an input element. When the value of the input element
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
 *      template: "<input type='text' [ng-form-control]='loginControl'>"
 *      })
 * class LoginComp {
 *  loginControl:Control;
 *
 *  constructor() {
 *    this.loginControl = new Control('');
 *  }
 * }
 *
 *  ```
 *
 * @exportedAs angular2/forms
 */
export declare class FormControlDirective extends ControlDirective {
    form: Control;
    ngModel: EventEmitter;
    _added: boolean;
    model: any;
    constructor();
    onChange(c: any): void;
    control: Control;
    path: List<string>;
    viewToModelUpdate(newValue: any): void;
}
export declare var __esModule: boolean;
