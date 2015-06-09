export declare class RouteParams {
    params: StringMap<string, string>;
    constructor(params: StringMap<string, string>);
    get(param: string): string;
}
/**
 * An `Instruction` represents the component hierarchy of the application based on a given route
 */
export declare class Instruction {
    component: any;
    private _children;
    capturedUrl: string;
    accumulatedUrl: string;
    params: StringMap<string, string>;
    reuse: boolean;
    specificity: number;
    constructor({params, component, children, matchedUrl, parentSpecificity}?: {
        params?: StringMap<string, any>;
        component?: any;
        children?: StringMap<string, Instruction>;
        matchedUrl?: string;
        parentSpecificity?: number;
    });
    hasChild(outletName: string): boolean;
    /**
     * Returns the child instruction with the given outlet name
     */
    getChild(outletName: string): Instruction;
    /**
     * (child:Instruction, outletName:string) => {}
     */
    forEachChild(fn: Function): void;
    /**
     * Does a synchronous, breadth-first traversal of the graph of instructions.
     * Takes a function with signature:
     * (child:Instruction, outletName:string) => {}
     */
    traverseSync(fn: Function): void;
    /**
     * Takes a currently active instruction and sets a reuse flag on each of this instruction's
     * children
     */
    reuseComponentsFrom(oldInstruction: Instruction): void;
}
export declare var __esModule: boolean;
