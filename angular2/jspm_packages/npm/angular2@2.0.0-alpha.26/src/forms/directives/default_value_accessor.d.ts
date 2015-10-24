import { ControlDirective } from './control_directive';
import { ControlValueAccessor } from './control_value_accessor';
/**
 * The default accessor for writing a value and listening to changes that is used by a
 * {@link Control} directive.
 *
 * This is the default strategy that Angular uses when no other accessor is applied.
 *
 *  # Example
 *  ```
 *  <input type="text" [ng-form-control]="loginControl">
 *  ```
 *
 * @exportedAs angular2/forms
 */
export declare class DefaultValueAccessor implements ControlValueAccessor {
    private cd;
    value: any;
    onChange: Function;
    onTouched: Function;
    constructor(cd: ControlDirective);
    writeValue(value: any): void;
    registerOnChange(fn: any): void;
    registerOnTouched(fn: any): void;
}
export declare var __esModule: boolean;