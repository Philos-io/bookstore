import { StringMapWrapper, ListWrapper } from 'angular2/src/facade/collection';
import { PromiseWrapper } from 'angular2/src/facade/async';
import { isPresent, normalizeBlank } from 'angular2/src/facade/lang';
export class RouteParams {
    constructor(params) {
        this.params = params;
    }
    get(param) { return normalizeBlank(StringMapWrapper.get(this.params, param)); }
}
/**
 * An `Instruction` represents the component hierarchy of the application based on a given route
 */
export class Instruction {
    constructor({ params, component, children, matchedUrl, parentSpecificity } = {}) {
        this.reuse = false;
        this.capturedUrl = matchedUrl;
        this.accumulatedUrl = matchedUrl;
        this.specificity = parentSpecificity;
        if (isPresent(children)) {
            this._children = children;
            var childUrl;
            StringMapWrapper.forEach(this._children, (child, _) => {
                childUrl = child.accumulatedUrl;
                this.specificity += child.specificity;
            });
            if (isPresent(childUrl)) {
                this.accumulatedUrl += childUrl;
            }
        }
        else {
            this._children = StringMapWrapper.create();
        }
        this.component = component;
        this.params = params;
    }
    hasChild(outletName) {
        return StringMapWrapper.contains(this._children, outletName);
    }
    /**
     * Returns the child instruction with the given outlet name
     */
    getChild(outletName) {
        return StringMapWrapper.get(this._children, outletName);
    }
    /**
     * (child:Instruction, outletName:string) => {}
     */
    forEachChild(fn) { StringMapWrapper.forEach(this._children, fn); }
    /**
     * Does a synchronous, breadth-first traversal of the graph of instructions.
     * Takes a function with signature:
     * (child:Instruction, outletName:string) => {}
     */
    traverseSync(fn) {
        this.forEachChild(fn);
        this.forEachChild((childInstruction, _) => childInstruction.traverseSync(fn));
    }
    /**
     * Takes a currently active instruction and sets a reuse flag on each of this instruction's
     * children
     */
    reuseComponentsFrom(oldInstruction) {
        this.traverseSync((childInstruction, outletName) => {
            var oldInstructionChild = oldInstruction.getChild(outletName);
            if (shouldReuseComponent(childInstruction, oldInstructionChild)) {
                childInstruction.reuse = true;
            }
        });
    }
}
function shouldReuseComponent(instr1, instr2) {
    return instr1.component == instr2.component &&
        StringMapWrapper.equals(instr1.params, instr2.params);
}
function mapObjAsync(obj, fn) {
    return PromiseWrapper.all(mapObj(obj, fn));
}
function mapObj(obj, fn) {
    var result = ListWrapper.create();
    StringMapWrapper.forEach(obj, (value, key) => ListWrapper.push(result, fn(value, key)));
    return result;
}
//# sourceMappingURL=instruction.js.map