import { isPresent } from 'angular2/src/facade/lang';
import { MapWrapper, StringMapWrapper } from 'angular2/src/facade/collection';
export class Reflector {
    constructor(reflectionCapabilities) {
        this._typeInfo = MapWrapper.create();
        this._getters = MapWrapper.create();
        this._setters = MapWrapper.create();
        this._methods = MapWrapper.create();
        this.reflectionCapabilities = reflectionCapabilities;
    }
    registerType(type, typeInfo) {
        MapWrapper.set(this._typeInfo, type, typeInfo);
    }
    registerGetters(getters) {
        _mergeMaps(this._getters, getters);
    }
    registerSetters(setters) {
        _mergeMaps(this._setters, setters);
    }
    registerMethods(methods) {
        _mergeMaps(this._methods, methods);
    }
    factory(type) {
        if (this._containsTypeInfo(type)) {
            return this._getTypeInfoField(type, "factory", null);
        }
        else {
            return this.reflectionCapabilities.factory(type);
        }
    }
    parameters(typeOrFunc) {
        if (MapWrapper.contains(this._typeInfo, typeOrFunc)) {
            return this._getTypeInfoField(typeOrFunc, "parameters", []);
        }
        else {
            return this.reflectionCapabilities.parameters(typeOrFunc);
        }
    }
    annotations(typeOrFunc) {
        if (MapWrapper.contains(this._typeInfo, typeOrFunc)) {
            return this._getTypeInfoField(typeOrFunc, "annotations", []);
        }
        else {
            return this.reflectionCapabilities.annotations(typeOrFunc);
        }
    }
    interfaces(type) {
        if (MapWrapper.contains(this._typeInfo, type)) {
            return this._getTypeInfoField(type, "interfaces", []);
        }
        else {
            return this.reflectionCapabilities.interfaces(type);
        }
    }
    getter(name) {
        if (MapWrapper.contains(this._getters, name)) {
            return MapWrapper.get(this._getters, name);
        }
        else {
            return this.reflectionCapabilities.getter(name);
        }
    }
    setter(name) {
        if (MapWrapper.contains(this._setters, name)) {
            return MapWrapper.get(this._setters, name);
        }
        else {
            return this.reflectionCapabilities.setter(name);
        }
    }
    method(name) {
        if (MapWrapper.contains(this._methods, name)) {
            return MapWrapper.get(this._methods, name);
        }
        else {
            return this.reflectionCapabilities.method(name);
        }
    }
    _getTypeInfoField(typeOrFunc, key, defaultValue) {
        var res = MapWrapper.get(this._typeInfo, typeOrFunc)[key];
        return isPresent(res) ? res : defaultValue;
    }
    _containsTypeInfo(typeOrFunc) { return MapWrapper.contains(this._typeInfo, typeOrFunc); }
}
function _mergeMaps(target, config) {
    StringMapWrapper.forEach(config, (v, k) => MapWrapper.set(target, k, v));
}
//# sourceMappingURL=reflector.js.map