import { ControlDirective } from './control_directive';
import { FormDirective } from './form_directive';
import { ControlGroupDirective } from './control_group_directive';
import { ControlContainerDirective } from './control_container_directive';
import { AbstractControl, ControlGroup, Control } from '../model';
export declare class TemplateDrivenFormDirective extends ControlContainerDirective implements FormDirective {
    form: ControlGroup;
    constructor();
    formDirective: FormDirective;
    path: List<string>;
    controls: StringMap<string, AbstractControl>;
    value: any;
    addControl(dir: ControlDirective): void;
    getControl(dir: ControlDirective): Control;
    removeControl(dir: ControlDirective): void;
    addControlGroup(dir: ControlGroupDirective): void;
    removeControlGroup(dir: ControlGroupDirective): void;
    updateModel(dir: ControlDirective, value: any): void;
    _findContainer(path: List<string>): ControlGroup;
    _later(fn: any): void;
}
export declare var __esModule: boolean;
