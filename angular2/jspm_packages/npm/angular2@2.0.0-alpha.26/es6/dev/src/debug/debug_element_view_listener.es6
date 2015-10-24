var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") return Reflect.decorate(decorators, target, key, desc);
    switch (arguments.length) {
        case 2: return decorators.reduceRight(function(o, d) { return (d && d(o)) || o; }, target);
        case 3: return decorators.reduceRight(function(o, d) { return (d && d(target, key)), void 0; }, void 0);
        case 4: return decorators.reduceRight(function(o, d) { return (d && d(target, key, o)) || o; }, desc);
    }
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { CONST_EXPR, isPresent, NumberWrapper, StringWrapper, RegExpWrapper } from 'angular2/src/facade/lang';
import { MapWrapper, ListWrapper } from 'angular2/src/facade/collection';
import { Injectable, bind } from 'angular2/di';
import { AppViewListener } from 'angular2/src/core/compiler/view_listener';
import { DOM } from 'angular2/src/dom/dom_adapter';
import { resolveInternalDomView } from 'angular2/src/render/dom/view/view';
import { DebugElement } from './debug_element';
const NG_ID_PROPERTY = 'ngid';
const INSPECT_GLOBAL_NAME = 'ngProbe';
var NG_ID_SEPARATOR_RE = RegExpWrapper.create('#');
var NG_ID_SEPARATOR = '#';
// Need to keep the views in a global Map so that multiple angular apps are supported
var _allIdsByView = CONST_EXPR(MapWrapper.create());
var _allViewsById = CONST_EXPR(MapWrapper.create());
var _nextId = 0;
function _setElementId(element, indices) {
    if (isPresent(element)) {
        DOM.setData(element, NG_ID_PROPERTY, ListWrapper.join(indices, NG_ID_SEPARATOR));
    }
}
function _getElementId(element) {
    var elId = DOM.getData(element, NG_ID_PROPERTY);
    if (isPresent(elId)) {
        return ListWrapper.map(StringWrapper.split(elId, NG_ID_SEPARATOR_RE), (partStr) => NumberWrapper.parseInt(partStr, 10));
    }
    else {
        return null;
    }
}
export function inspectDomElement(element) {
    var elId = _getElementId(element);
    if (isPresent(elId)) {
        var view = MapWrapper.get(_allViewsById, elId[0]);
        if (isPresent(view)) {
            return new DebugElement(view, elId[1]);
        }
    }
    return null;
}
export let DebugElementViewListener = class {
    constructor() {
        DOM.setGlobalVar(INSPECT_GLOBAL_NAME, inspectDomElement);
    }
    viewCreated(view) {
        var viewId = _nextId++;
        MapWrapper.set(_allViewsById, viewId, view);
        MapWrapper.set(_allIdsByView, view, viewId);
        var renderView = resolveInternalDomView(view.render);
        for (var i = 0; i < renderView.boundElements.length; i++) {
            _setElementId(renderView.boundElements[i], [viewId, i]);
        }
    }
    viewDestroyed(view) {
        var viewId = MapWrapper.get(_allIdsByView, view);
        MapWrapper.delete(_allIdsByView, view);
        MapWrapper.delete(_allViewsById, viewId);
    }
};
DebugElementViewListener = __decorate([
    Injectable(), 
    __metadata('design:paramtypes', [])
], DebugElementViewListener);
export var ELEMENT_PROBE_CONFIG = [
    DebugElementViewListener,
    bind(AppViewListener).toAlias(DebugElementViewListener),
];
//# sourceMappingURL=debug_element_view_listener.js.map