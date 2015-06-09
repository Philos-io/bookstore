import { isPresent } from 'angular2/src/facade/lang';
const DIRECTIVE = "directive";
const DIRECTIVE_LIFECYCLE = "directiveLifecycle";
const ELEMENT = "element";
const TEXT_NODE = "textNode";
export class BindingRecord {
    constructor(mode, implicitReceiver, ast, elementIndex, propertyName, setter, lifecycleEvent, directiveRecord) {
        this.mode = mode;
        this.implicitReceiver = implicitReceiver;
        this.ast = ast;
        this.elementIndex = elementIndex;
        this.propertyName = propertyName;
        this.setter = setter;
        this.lifecycleEvent = lifecycleEvent;
        this.directiveRecord = directiveRecord;
    }
    callOnChange() { return isPresent(this.directiveRecord) && this.directiveRecord.callOnChange; }
    isOnPushChangeDetection() {
        return isPresent(this.directiveRecord) && this.directiveRecord.isOnPushChangeDetection();
    }
    isDirective() { return this.mode === DIRECTIVE; }
    isDirectiveLifecycle() { return this.mode === DIRECTIVE_LIFECYCLE; }
    isElement() { return this.mode === ELEMENT; }
    isTextNode() { return this.mode === TEXT_NODE; }
    static createForDirective(ast, propertyName, setter, directiveRecord) {
        return new BindingRecord(DIRECTIVE, 0, ast, 0, propertyName, setter, null, directiveRecord);
    }
    static createDirectiveOnCheck(directiveRecord) {
        return new BindingRecord(DIRECTIVE_LIFECYCLE, 0, null, 0, null, null, "onCheck", directiveRecord);
    }
    static createDirectiveOnInit(directiveRecord) {
        return new BindingRecord(DIRECTIVE_LIFECYCLE, 0, null, 0, null, null, "onInit", directiveRecord);
    }
    static createDirectiveOnChange(directiveRecord) {
        return new BindingRecord(DIRECTIVE_LIFECYCLE, 0, null, 0, null, null, "onChange", directiveRecord);
    }
    static createForElement(ast, elementIndex, propertyName) {
        return new BindingRecord(ELEMENT, 0, ast, elementIndex, propertyName, null, null, null);
    }
    static createForHostProperty(directiveIndex, ast, propertyName) {
        return new BindingRecord(ELEMENT, directiveIndex, ast, directiveIndex.elementIndex, propertyName, null, null, null);
    }
    static createForTextNode(ast, elementIndex) {
        return new BindingRecord(TEXT_NODE, 0, ast, elementIndex, null, null, null, null);
    }
}
//# sourceMappingURL=binding_record.js.map