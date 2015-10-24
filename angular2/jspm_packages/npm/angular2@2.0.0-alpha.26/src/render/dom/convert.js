/* */ 
var collection_1 = require("../../facade/collection");
var lang_1 = require("../../facade/lang");
var api_1 = require("../api");
function directiveMetadataToMap(meta) {
  return collection_1.MapWrapper.createFromPairs([['id', meta.id], ['selector', meta.selector], ['compileChildren', meta.compileChildren], ['hostListeners', _cloneIfPresent(meta.hostListeners)], ['hostProperties', _cloneIfPresent(meta.hostProperties)], ['hostAttributes', _cloneIfPresent(meta.hostAttributes)], ['hostActions', _cloneIfPresent(meta.hostActions)], ['properties', _cloneIfPresent(meta.properties)], ['readAttributes', _cloneIfPresent(meta.readAttributes)], ['type', meta.type], ['callOnDestroy', meta.callOnDestroy], ['callOnCheck', meta.callOnCheck], ['callOnInit', meta.callOnInit], ['callOnChange', meta.callOnChange], ['callOnAllChangesDone', meta.callOnAllChangesDone], ['version', 1]]);
}
exports.directiveMetadataToMap = directiveMetadataToMap;
function directiveMetadataFromMap(map) {
  return new api_1.DirectiveMetadata({
    id: collection_1.MapWrapper.get(map, 'id'),
    selector: collection_1.MapWrapper.get(map, 'selector'),
    compileChildren: collection_1.MapWrapper.get(map, 'compileChildren'),
    hostListeners: _cloneIfPresent(collection_1.MapWrapper.get(map, 'hostListeners')),
    hostProperties: _cloneIfPresent(collection_1.MapWrapper.get(map, 'hostProperties')),
    hostActions: _cloneIfPresent(collection_1.MapWrapper.get(map, 'hostActions')),
    hostAttributes: _cloneIfPresent(collection_1.MapWrapper.get(map, 'hostAttributes')),
    properties: _cloneIfPresent(collection_1.MapWrapper.get(map, 'properties')),
    readAttributes: _cloneIfPresent(collection_1.MapWrapper.get(map, 'readAttributes')),
    type: collection_1.MapWrapper.get(map, 'type'),
    callOnDestroy: collection_1.MapWrapper.get(map, 'callOnDestroy'),
    callOnCheck: collection_1.MapWrapper.get(map, 'callOnCheck'),
    callOnChange: collection_1.MapWrapper.get(map, 'callOnChange'),
    callOnInit: collection_1.MapWrapper.get(map, 'callOnInit'),
    callOnAllChangesDone: collection_1.MapWrapper.get(map, 'callOnAllChangesDone')
  });
}
exports.directiveMetadataFromMap = directiveMetadataFromMap;
function _cloneIfPresent(o) {
  if (!lang_1.isPresent(o))
    return null;
  return collection_1.ListWrapper.isList(o) ? collection_1.ListWrapper.clone(o) : collection_1.MapWrapper.clone(o);
}
exports.__esModule = true;
