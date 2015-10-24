export interface ControlValueAccessor {
    writeValue(obj: any): void;
    registerOnChange(fn: any): void;
    registerOnTouched(fn: any): void;
}
export declare var __esModule: boolean;
