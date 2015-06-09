import { EventEmitter } from 'angular2/src/facade/async';
import { ControlDirective } from './control_directive';
import { Control } from '../model';
export declare class NgModelDirective extends ControlDirective {
    control: Control;
    ngModel: EventEmitter;
    model: any;
    _added: boolean;
    constructor();
    onChange(c: any): void;
    path: List<string>;
    viewToModelUpdate(newValue: any): void;
}
export declare var __esModule: boolean;
