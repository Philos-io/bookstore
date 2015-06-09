import { ControlValueAccessor } from './control_value_accessor';
import { Control } from '../model';
/**
 * A directive that bind a [ng-control] object to a DOM element.
 *
 * @exportedAs angular2/forms
 */
export declare class ControlDirective {
    name: string;
    valueAccessor: ControlValueAccessor;
    validator: Function;
    path: List<string>;
    control: Control;
    constructor();
    viewToModelUpdate(newValue: any): void;
}
