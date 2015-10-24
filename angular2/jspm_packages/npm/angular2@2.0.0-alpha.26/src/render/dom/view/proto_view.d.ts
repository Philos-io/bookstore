import { ElementBinder } from './element_binder';
import { RenderProtoViewRef } from '../../api';
export declare function resolveInternalDomProtoView(protoViewRef: RenderProtoViewRef): DomProtoView;
export declare class DomProtoViewRef extends RenderProtoViewRef {
    _protoView: DomProtoView;
    constructor(protoView: DomProtoView);
}
export declare class DomProtoView {
    element: any;
    elementBinders: List<ElementBinder>;
    isTemplateElement: boolean;
    rootBindingOffset: number;
    transitiveContentTagCount: number;
    constructor({elementBinders, element, transitiveContentTagCount}: {
        elementBinders: any;
        element: any;
        transitiveContentTagCount: any;
    });
}
export declare var __esModule: boolean;
