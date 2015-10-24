/* */ 
var lang_1 = require("../facade/lang");
var collection_1 = require("../facade/collection");
var path_recognizer_1 = require("./path_recognizer");
var RouteRecognizer = (function() {
  function RouteRecognizer() {
    this.names = collection_1.MapWrapper.create();
    this.matchers = collection_1.MapWrapper.create();
    this.redirects = collection_1.MapWrapper.create();
  }
  RouteRecognizer.prototype.addRedirect = function(path, target) {
    collection_1.MapWrapper.set(this.redirects, path, target);
  };
  RouteRecognizer.prototype.addConfig = function(path, handler, alias) {
    if (alias === void 0) {
      alias = null;
    }
    var recognizer = new path_recognizer_1.PathRecognizer(path, handler);
    collection_1.MapWrapper.forEach(this.matchers, function(matcher, _) {
      if (recognizer.regex.toString() == matcher.regex.toString()) {
        throw new lang_1.BaseException("Configuration '" + path + "' conflicts with existing route '" + matcher.path + "'");
      }
    });
    collection_1.MapWrapper.set(this.matchers, recognizer.regex, recognizer);
    if (lang_1.isPresent(alias)) {
      collection_1.MapWrapper.set(this.names, alias, recognizer);
    }
  };
  RouteRecognizer.prototype.recognize = function(url) {
    var solutions = collection_1.ListWrapper.create();
    collection_1.MapWrapper.forEach(this.redirects, function(target, path) {
      if (lang_1.StringWrapper.startsWith(url, path)) {
        url = target + lang_1.StringWrapper.substring(url, path.length);
      }
    });
    collection_1.MapWrapper.forEach(this.matchers, function(pathRecognizer, regex) {
      var match;
      if (lang_1.isPresent(match = lang_1.RegExpWrapper.firstMatch(regex, url))) {
        var matchedUrl = '/';
        var unmatchedUrl = '';
        if (url != '/') {
          matchedUrl = match[0];
          unmatchedUrl = lang_1.StringWrapper.substring(url, match[0].length);
        }
        collection_1.ListWrapper.push(solutions, new RouteMatch({
          specificity: pathRecognizer.specificity,
          handler: pathRecognizer.handler,
          params: pathRecognizer.parseParams(url),
          matchedUrl: matchedUrl,
          unmatchedUrl: unmatchedUrl
        }));
      }
    });
    return solutions;
  };
  RouteRecognizer.prototype.hasRoute = function(name) {
    return collection_1.MapWrapper.contains(this.names, name);
  };
  RouteRecognizer.prototype.generate = function(name, params) {
    var pathRecognizer = collection_1.MapWrapper.get(this.names, name);
    return lang_1.isPresent(pathRecognizer) ? pathRecognizer.generate(params) : null;
  };
  return RouteRecognizer;
})();
exports.RouteRecognizer = RouteRecognizer;
var RouteMatch = (function() {
  function RouteMatch(_a) {
    var _b = _a === void 0 ? {} : _a,
        specificity = _b.specificity,
        handler = _b.handler,
        params = _b.params,
        matchedUrl = _b.matchedUrl,
        unmatchedUrl = _b.unmatchedUrl;
    this.specificity = specificity;
    this.handler = handler;
    this.params = params;
    this.matchedUrl = matchedUrl;
    this.unmatchedUrl = unmatchedUrl;
  }
  return RouteMatch;
})();
exports.RouteMatch = RouteMatch;
exports.__esModule = true;