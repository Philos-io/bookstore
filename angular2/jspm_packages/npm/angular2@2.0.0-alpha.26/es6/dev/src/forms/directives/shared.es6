import { ListWrapper } from 'angular2/src/facade/collection';
import { isBlank, BaseException } from 'angular2/src/facade/lang';
import { Validators } from '../validators';
export function controlPath(name, parent) {
    var p = ListWrapper.clone(parent.path);
    ListWrapper.push(p, name);
    return p;
}
export function setUpControl(c, dir) {
    if (isBlank(c))
        _throwError(dir, "Cannot find control");
    if (isBlank(dir.valueAccessor))
        _throwError(dir, "No value accessor for");
    c.validator = Validators.compose([c.validator, dir.validator]);
    dir.valueAccessor.writeValue(c.value);
    // view -> model
    dir.valueAccessor.registerOnChange(newValue => {
        dir.viewToModelUpdate(newValue);
        c.updateValue(newValue);
        c.markAsDirty();
    });
    // model -> view
    c.registerOnChange(newValue => dir.valueAccessor.writeValue(newValue));
    // touched
    dir.valueAccessor.registerOnTouched(() => c.markAsTouched());
}
function _throwError(dir, message) {
    var path = ListWrapper.join(dir.path, " -> ");
    throw new BaseException(`${message} '${path}'`);
}
//# sourceMappingURL=shared.js.map