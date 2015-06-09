import { ControlDirective } from './control_directive';
import { ControlValueAccessor } from './control_value_accessor';
/**
 * The accessor for writing a value and listening to changes on a checkbox input element.
 *
 *
 *  # Example
 *  ```
 *  <input type="checkbox" [ng-control]="rememberLogin">
 *  ```
 *
 * @exportedAs angular2/forms
 */
export declare class CheckboxControlValueAccessor implements ControlValueAccessor {
    private cd;
    checked: boolean;
    onChange: Function;
    onTouched: Function;
    constructor(cd: ControlDirective);
    writeValue(value: any): void;
    registerOnChange(fn: any): void;
    registerOnTouched(fn: any): void;
}
