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
import { Injectable } from 'angular2/di';
import { ListWrapper, MapWrapper } from 'angular2/src/facade/collection';
import { isPresent, isBlank } from 'angular2/src/facade/lang';
import { reflector } from 'angular2/src/reflection/reflection';
import { ChangeDetection, DirectiveIndex, BindingRecord, DirectiveRecord, DEFAULT, ChangeDetectorDefinition } from 'angular2/change_detection';
import * as renderApi from 'angular2/src/render/api';
import { AppProtoView } from './view';
import { ProtoElementInjector } from './element_injector';
class BindingRecordsCreator {
    constructor() {
        this._directiveRecordsMap = MapWrapper.create();
        this._textNodeIndex = 0;
    }
    getBindingRecords(elementBinders, allDirectiveMetadatas) {
        var bindings = [];
        for (var boundElementIndex = 0; boundElementIndex < elementBinders.length; boundElementIndex++) {
            var renderElementBinder = elementBinders[boundElementIndex];
            this._createTextNodeRecords(bindings, renderElementBinder);
            this._createElementPropertyRecords(bindings, boundElementIndex, renderElementBinder);
            this._createDirectiveRecords(bindings, boundElementIndex, renderElementBinder.directives, allDirectiveMetadatas);
        }
        return bindings;
    }
    getDirectiveRecords(elementBinders, allDirectiveMetadatas) {
        var directiveRecords = [];
        for (var elementIndex = 0; elementIndex < elementBinders.length; ++elementIndex) {
            var dirs = elementBinders[elementIndex].directives;
            for (var dirIndex = 0; dirIndex < dirs.length; ++dirIndex) {
                ListWrapper.push(directiveRecords, this._getDirectiveRecord(elementIndex, dirIndex, allDirectiveMetadatas[dirs[dirIndex].directiveIndex]));
            }
        }
        return directiveRecords;
    }
    _createTextNodeRecords(bindings, renderElementBinder) {
        if (isBlank(renderElementBinder.textBindings))
            return;
        ListWrapper.forEach(renderElementBinder.textBindings, (b) => {
            ListWrapper.push(bindings, BindingRecord.createForTextNode(b, this._textNodeIndex++));
        });
    }
    _createElementPropertyRecords(bindings, boundElementIndex, renderElementBinder) {
        MapWrapper.forEach(renderElementBinder.propertyBindings, (astWithSource, propertyName) => {
            ListWrapper.push(bindings, BindingRecord.createForElement(astWithSource, boundElementIndex, propertyName));
        });
    }
    _createDirectiveRecords(bindings, boundElementIndex, directiveBinders, allDirectiveMetadatas) {
        for (var i = 0; i < directiveBinders.length; i++) {
            var directiveBinder = directiveBinders[i];
            var directiveMetadata = allDirectiveMetadatas[directiveBinder.directiveIndex];
            var directiveRecord = this._getDirectiveRecord(boundElementIndex, i, directiveMetadata);
            // directive properties
            MapWrapper.forEach(directiveBinder.propertyBindings, (astWithSource, propertyName) => {
                // TODO: these setters should eventually be created by change detection, to make
                // it monomorphic!
                var setter = reflector.setter(propertyName);
                ListWrapper.push(bindings, BindingRecord.createForDirective(astWithSource, propertyName, setter, directiveRecord));
            });
            if (directiveRecord.callOnChange) {
                ListWrapper.push(bindings, BindingRecord.createDirectiveOnChange(directiveRecord));
            }
            if (directiveRecord.callOnInit) {
                ListWrapper.push(bindings, BindingRecord.createDirectiveOnInit(directiveRecord));
            }
            if (directiveRecord.callOnCheck) {
                ListWrapper.push(bindings, BindingRecord.createDirectiveOnCheck(directiveRecord));
            }
        }
        for (var i = 0; i < directiveBinders.length; i++) {
            var directiveBinder = directiveBinders[i];
            // host properties
            MapWrapper.forEach(directiveBinder.hostPropertyBindings, (astWithSource, propertyName) => {
                var dirIndex = new DirectiveIndex(boundElementIndex, i);
                ListWrapper.push(bindings, BindingRecord.createForHostProperty(dirIndex, astWithSource, propertyName));
            });
        }
    }
    _getDirectiveRecord(boundElementIndex, directiveIndex, directiveMetadata) {
        var id = boundElementIndex * 100 + directiveIndex;
        if (!MapWrapper.contains(this._directiveRecordsMap, id)) {
            MapWrapper.set(this._directiveRecordsMap, id, new DirectiveRecord({
                directiveIndex: new DirectiveIndex(boundElementIndex, directiveIndex),
                callOnAllChangesDone: directiveMetadata.callOnAllChangesDone,
                callOnChange: directiveMetadata.callOnChange,
                callOnCheck: directiveMetadata.callOnCheck,
                callOnInit: directiveMetadata.callOnInit,
                changeDetection: directiveMetadata.changeDetection
            }));
        }
        return MapWrapper.get(this._directiveRecordsMap, id);
    }
}
export let ProtoViewFactory = class {
    constructor(changeDetection) {
        this._changeDetection = changeDetection;
    }
    createAppProtoViews(hostComponentBinding, rootRenderProtoView, allDirectives) {
        var allRenderDirectiveMetadata = ListWrapper.map(allDirectives, directiveBinding => directiveBinding.metadata);
        var nestedPvsWithIndex = _collectNestedProtoViews(rootRenderProtoView);
        var nestedPvVariableBindings = _collectNestedProtoViewsVariableBindings(nestedPvsWithIndex);
        var nestedPvVariableNames = _collectNestedProtoViewsVariableNames(nestedPvsWithIndex, nestedPvVariableBindings);
        var changeDetectorDefs = _getChangeDetectorDefinitions(hostComponentBinding.metadata, nestedPvsWithIndex, nestedPvVariableNames, allRenderDirectiveMetadata);
        var protoChangeDetectors = ListWrapper.map(changeDetectorDefs, changeDetectorDef => this._changeDetection.createProtoChangeDetector(changeDetectorDef));
        var appProtoViews = ListWrapper.createFixedSize(nestedPvsWithIndex.length);
        ListWrapper.forEach(nestedPvsWithIndex, (pvWithIndex) => {
            var appProtoView = _createAppProtoView(pvWithIndex.renderProtoView, protoChangeDetectors[pvWithIndex.index], nestedPvVariableBindings[pvWithIndex.index], allDirectives);
            if (isPresent(pvWithIndex.parentIndex)) {
                var parentView = appProtoViews[pvWithIndex.parentIndex];
                parentView.elementBinders[pvWithIndex.boundElementIndex].nestedProtoView = appProtoView;
            }
            appProtoViews[pvWithIndex.index] = appProtoView;
        });
        return appProtoViews;
    }
};
ProtoViewFactory = __decorate([
    Injectable(), 
    __metadata('design:paramtypes', [ChangeDetection])
], ProtoViewFactory);
/**
 * Returns the data needed to create ChangeDetectors
 * for the given ProtoView and all nested ProtoViews.
 */
export function getChangeDetectorDefinitions(hostComponentMetadata, rootRenderProtoView, allRenderDirectiveMetadata) {
    var nestedPvsWithIndex = _collectNestedProtoViews(rootRenderProtoView);
    var nestedPvVariableBindings = _collectNestedProtoViewsVariableBindings(nestedPvsWithIndex);
    var nestedPvVariableNames = _collectNestedProtoViewsVariableNames(nestedPvsWithIndex, nestedPvVariableBindings);
    return _getChangeDetectorDefinitions(hostComponentMetadata, nestedPvsWithIndex, nestedPvVariableNames, allRenderDirectiveMetadata);
}
function _collectNestedProtoViews(renderProtoView, parentIndex = null, boundElementIndex = null, result = null) {
    if (isBlank(result)) {
        result = [];
    }
    ListWrapper.push(result, new RenderProtoViewWithIndex(renderProtoView, result.length, parentIndex, boundElementIndex));
    var currentIndex = result.length - 1;
    var childBoundElementIndex = 0;
    ListWrapper.forEach(renderProtoView.elementBinders, (elementBinder) => {
        if (isPresent(elementBinder.nestedProtoView)) {
            _collectNestedProtoViews(elementBinder.nestedProtoView, currentIndex, childBoundElementIndex, result);
        }
        childBoundElementIndex++;
    });
    return result;
}
function _getChangeDetectorDefinitions(hostComponentMetadata, nestedPvsWithIndex, nestedPvVariableNames, allRenderDirectiveMetadata) {
    return ListWrapper.map(nestedPvsWithIndex, (pvWithIndex) => {
        var elementBinders = pvWithIndex.renderProtoView.elementBinders;
        var bindingRecordsCreator = new BindingRecordsCreator();
        var bindingRecords = bindingRecordsCreator.getBindingRecords(elementBinders, allRenderDirectiveMetadata);
        var directiveRecords = bindingRecordsCreator.getDirectiveRecords(elementBinders, allRenderDirectiveMetadata);
        var strategyName = DEFAULT;
        var typeString;
        if (pvWithIndex.renderProtoView.type === renderApi.ProtoViewDto.COMPONENT_VIEW_TYPE) {
            strategyName = hostComponentMetadata.changeDetection;
            typeString = 'comp';
        }
        else if (pvWithIndex.renderProtoView.type === renderApi.ProtoViewDto.HOST_VIEW_TYPE) {
            typeString = 'host';
        }
        else {
            typeString = 'embedded';
        }
        var id = `${hostComponentMetadata.id}_${typeString}_${pvWithIndex.index}`;
        var variableNames = nestedPvVariableNames[pvWithIndex.index];
        return new ChangeDetectorDefinition(id, strategyName, variableNames, bindingRecords, directiveRecords);
    });
}
function _createAppProtoView(renderProtoView, protoChangeDetector, variableBindings, allDirectives) {
    var elementBinders = renderProtoView.elementBinders;
    var protoView = new AppProtoView(renderProtoView.render, protoChangeDetector, variableBindings);
    // TODO: vsavkin refactor to pass element binders into proto view
    _createElementBinders(protoView, elementBinders, allDirectives);
    _bindDirectiveEvents(protoView, elementBinders);
    return protoView;
}
function _collectNestedProtoViewsVariableBindings(nestedPvsWithIndex) {
    return ListWrapper.map(nestedPvsWithIndex, (pvWithIndex) => {
        return _createVariableBindings(pvWithIndex.renderProtoView);
    });
}
function _createVariableBindings(renderProtoView) {
    var variableBindings = MapWrapper.create();
    MapWrapper.forEach(renderProtoView.variableBindings, (mappedName, varName) => {
        MapWrapper.set(variableBindings, varName, mappedName);
    });
    ListWrapper.forEach(renderProtoView.elementBinders, binder => {
        MapWrapper.forEach(binder.variableBindings, (mappedName, varName) => {
            MapWrapper.set(variableBindings, varName, mappedName);
        });
    });
    return variableBindings;
}
function _collectNestedProtoViewsVariableNames(nestedPvsWithIndex, nestedPvVariableBindings) {
    var nestedPvVariableNames = ListWrapper.createFixedSize(nestedPvsWithIndex.length);
    ListWrapper.forEach(nestedPvsWithIndex, (pvWithIndex) => {
        var parentVariableNames = isPresent(pvWithIndex.parentIndex) ? nestedPvVariableNames[pvWithIndex.parentIndex] : null;
        nestedPvVariableNames[pvWithIndex.index] =
            _createVariableNames(parentVariableNames, nestedPvVariableBindings[pvWithIndex.index]);
    });
    return nestedPvVariableNames;
}
function _createVariableNames(parentVariableNames, variableBindings) {
    var variableNames = isPresent(parentVariableNames) ? ListWrapper.clone(parentVariableNames) : [];
    MapWrapper.forEach(variableBindings, (local, v) => { ListWrapper.push(variableNames, local); });
    return variableNames;
}
function _createElementBinders(protoView, elementBinders, allDirectiveBindings) {
    for (var i = 0; i < elementBinders.length; i++) {
        var renderElementBinder = elementBinders[i];
        var dirs = elementBinders[i].directives;
        var parentPeiWithDistance = _findParentProtoElementInjectorWithDistance(i, protoView.elementBinders, elementBinders);
        var directiveBindings = ListWrapper.map(dirs, (dir) => allDirectiveBindings[dir.directiveIndex]);
        var componentDirectiveBinding = null;
        if (directiveBindings.length > 0) {
            if (directiveBindings[0].metadata.type === renderApi.DirectiveMetadata.COMPONENT_TYPE) {
                componentDirectiveBinding = directiveBindings[0];
            }
        }
        var protoElementInjector = _createProtoElementInjector(i, parentPeiWithDistance, renderElementBinder, componentDirectiveBinding, directiveBindings);
        _createElementBinder(protoView, i, renderElementBinder, protoElementInjector, componentDirectiveBinding);
    }
}
function _findParentProtoElementInjectorWithDistance(binderIndex, elementBinders, renderElementBinders) {
    var distance = 0;
    do {
        var renderElementBinder = renderElementBinders[binderIndex];
        binderIndex = renderElementBinder.parentIndex;
        if (binderIndex !== -1) {
            distance += renderElementBinder.distanceToParent;
            var elementBinder = elementBinders[binderIndex];
            if (isPresent(elementBinder.protoElementInjector)) {
                return new ParentProtoElementInjectorWithDistance(elementBinder.protoElementInjector, distance);
            }
        }
    } while (binderIndex !== -1);
    return new ParentProtoElementInjectorWithDistance(null, -1);
}
function _createProtoElementInjector(binderIndex, parentPeiWithDistance, renderElementBinder, componentDirectiveBinding, directiveBindings) {
    var protoElementInjector = null;
    // Create a protoElementInjector for any element that either has bindings *or* has one
    // or more var- defined. Elements with a var- defined need a their own element injector
    // so that, when hydrating, $implicit can be set to the element.
    var hasVariables = MapWrapper.size(renderElementBinder.variableBindings) > 0;
    if (directiveBindings.length > 0 || hasVariables) {
        protoElementInjector = ProtoElementInjector.create(parentPeiWithDistance.protoElementInjector, binderIndex, directiveBindings, isPresent(componentDirectiveBinding), parentPeiWithDistance.distance);
        protoElementInjector.attributes = renderElementBinder.readAttributes;
        if (hasVariables) {
            protoElementInjector.exportComponent = isPresent(componentDirectiveBinding);
            protoElementInjector.exportElement = isBlank(componentDirectiveBinding);
            // experiment
            var exportImplicitName = MapWrapper.get(renderElementBinder.variableBindings, '\$implicit');
            if (isPresent(exportImplicitName)) {
                protoElementInjector.exportImplicitName = exportImplicitName;
            }
        }
    }
    return protoElementInjector;
}
function _createElementBinder(protoView, boundElementIndex, renderElementBinder, protoElementInjector, componentDirectiveBinding) {
    var parent = null;
    if (renderElementBinder.parentIndex !== -1) {
        parent = protoView.elementBinders[renderElementBinder.parentIndex];
    }
    var elBinder = protoView.bindElement(parent, renderElementBinder.distanceToParent, protoElementInjector, componentDirectiveBinding);
    protoView.bindEvent(renderElementBinder.eventBindings, boundElementIndex, -1);
    // variables
    // The view's locals needs to have a full set of variable names at construction time
    // in order to prevent new variables from being set later in the lifecycle. Since we don't want
    // to actually create variable bindings for the $implicit bindings, add to the
    // protoLocals manually.
    MapWrapper.forEach(renderElementBinder.variableBindings, (mappedName, varName) => {
        MapWrapper.set(protoView.protoLocals, mappedName, null);
    });
    return elBinder;
}
function _bindDirectiveEvents(protoView, elementBinders) {
    for (var boundElementIndex = 0; boundElementIndex < elementBinders.length; ++boundElementIndex) {
        var dirs = elementBinders[boundElementIndex].directives;
        for (var i = 0; i < dirs.length; i++) {
            var directiveBinder = dirs[i];
            // directive events
            protoView.bindEvent(directiveBinder.eventBindings, boundElementIndex, i);
        }
    }
}
class RenderProtoViewWithIndex {
    constructor(renderProtoView, index, parentIndex, boundElementIndex) {
        this.renderProtoView = renderProtoView;
        this.index = index;
        this.parentIndex = parentIndex;
        this.boundElementIndex = boundElementIndex;
    }
}
class ParentProtoElementInjectorWithDistance {
    constructor(protoElementInjector, distance) {
        this.protoElementInjector = protoElementInjector;
        this.distance = distance;
    }
}
//# sourceMappingURL=proto_view_factory.js.map