import { Validators } from '../validators';
/**
 * A directive that bind a [ng-control] object to a DOM element.
 *
 * @exportedAs angular2/forms
 */
export class ControlDirective {
    constructor() {
        this.name = null;
        this.valueAccessor = null;
        this.validator = Validators.nullValidator;
    }
    get path() { return null; }
    get control() { return null; }
    viewToModelUpdate(newValue) { }
}
//# sourceMappingURL=control_directive.js.map