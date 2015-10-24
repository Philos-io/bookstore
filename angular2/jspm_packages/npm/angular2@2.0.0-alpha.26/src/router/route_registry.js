/* */ 
var route_recognizer_1 = require("./route_recognizer");
var instruction_1 = require("./instruction");
var collection_1 = require("../facade/collection");
var lang_1 = require("../facade/lang");
var route_config_impl_1 = require("./route_config_impl");
var reflection_1 = require("../reflection/reflection");
var RouteRegistry = (function() {
  function RouteRegistry() {
    this._rules = collection_1.MapWrapper.create();
  }
  RouteRegistry.prototype.config = function(parentComponent, config) {
    var _this = this;
    if (!collection_1.StringMapWrapper.contains(config, 'path')) {
      throw new lang_1.BaseException('Route config does not contain "path"');
    }
    if (!collection_1.StringMapWrapper.contains(config, 'component') && !collection_1.StringMapWrapper.contains(config, 'components') && !collection_1.StringMapWrapper.contains(config, 'redirectTo')) {
      throw new lang_1.BaseException('Route config does not contain "component," "components," or "redirectTo"');
    }
    var recognizer = collection_1.MapWrapper.get(this._rules, parentComponent);
    if (lang_1.isBlank(recognizer)) {
      recognizer = new route_recognizer_1.RouteRecognizer();
      collection_1.MapWrapper.set(this._rules, parentComponent, recognizer);
    }
    config = normalizeConfig(config);
    if (collection_1.StringMapWrapper.contains(config, 'redirectTo')) {
      recognizer.addRedirect(config['path'], config['redirectTo']);
      return ;
    }
    var components = config['components'];
    collection_1.StringMapWrapper.forEach(components, function(component, _) {
      return _this.configFromComponent(component);
    });
    recognizer.addConfig(config['path'], config, config['as']);
  };
  RouteRegistry.prototype.configFromComponent = function(component) {
    var _this = this;
    if (!lang_1.isType(component)) {
      return ;
    }
    if (collection_1.MapWrapper.contains(this._rules, component)) {
      return ;
    }
    var annotations = reflection_1.reflector.annotations(component);
    if (lang_1.isPresent(annotations)) {
      for (var i = 0; i < annotations.length; i++) {
        var annotation = annotations[i];
        if (annotation instanceof route_config_impl_1.RouteConfig) {
          collection_1.ListWrapper.forEach(annotation.configs, function(config) {
            return _this.config(component, config);
          });
        }
      }
    }
  };
  RouteRegistry.prototype.recognize = function(url, parentComponent) {
    var componentRecognizer = collection_1.MapWrapper.get(this._rules, parentComponent);
    if (lang_1.isBlank(componentRecognizer)) {
      return null;
    }
    var possibleMatches = componentRecognizer.recognize(url);
    var fullSolutions = collection_1.ListWrapper.create();
    for (var i = 0; i < possibleMatches.length; i++) {
      var candidate = possibleMatches[i];
      if (candidate.unmatchedUrl.length == 0) {
        collection_1.ListWrapper.push(fullSolutions, routeMatchToInstruction(candidate, parentComponent));
      } else {
        var children = collection_1.StringMapWrapper.create(),
            allChildrenMatch = true,
            components = collection_1.StringMapWrapper.get(candidate.handler, 'components');
        var componentNames = collection_1.StringMapWrapper.keys(components);
        for (var nameIndex = 0; nameIndex < componentNames.length; nameIndex++) {
          var name = componentNames[nameIndex];
          var component = collection_1.StringMapWrapper.get(components, name);
          var childInstruction = this.recognize(candidate.unmatchedUrl, component);
          if (lang_1.isPresent(childInstruction)) {
            childInstruction.params = candidate.params;
            children[name] = childInstruction;
          } else {
            allChildrenMatch = false;
            break;
          }
        }
        if (allChildrenMatch) {
          collection_1.ListWrapper.push(fullSolutions, new instruction_1.Instruction({
            component: parentComponent,
            children: children,
            matchedUrl: candidate.matchedUrl,
            parentSpecificity: candidate.specificity
          }));
        }
      }
    }
    if (fullSolutions.length > 0) {
      var mostSpecificSolution = fullSolutions[0];
      for (var solutionIndex = 1; solutionIndex < fullSolutions.length; solutionIndex++) {
        var solution = fullSolutions[solutionIndex];
        if (solution.specificity > mostSpecificSolution.specificity) {
          mostSpecificSolution = solution;
        }
      }
      return mostSpecificSolution;
    }
    return null;
  };
  RouteRegistry.prototype.generate = function(name, params, hostComponent) {
    var componentRecognizer = collection_1.MapWrapper.get(this._rules, hostComponent);
    return lang_1.isPresent(componentRecognizer) ? componentRecognizer.generate(name, params) : null;
  };
  return RouteRegistry;
})();
exports.RouteRegistry = RouteRegistry;
function routeMatchToInstruction(routeMatch, parentComponent) {
  var children = collection_1.StringMapWrapper.create();
  var components = collection_1.StringMapWrapper.get(routeMatch.handler, 'components');
  collection_1.StringMapWrapper.forEach(components, function(component, outletName) {
    children[outletName] = new instruction_1.Instruction({
      component: component,
      params: routeMatch.params,
      parentSpecificity: 0
    });
  });
  return new instruction_1.Instruction({
    component: parentComponent,
    children: children,
    matchedUrl: routeMatch.matchedUrl,
    parentSpecificity: routeMatch.specificity
  });
}
function normalizeConfig(config) {
  if (!collection_1.StringMapWrapper.contains(config, 'component')) {
    return config;
  }
  var newConfig = {'components': {'default': config['component']}};
  collection_1.StringMapWrapper.forEach(config, function(value, key) {
    if (key != 'component' && key != 'components') {
      newConfig[key] = value;
    }
  });
  return newConfig;
}
exports.__esModule = true;
