/* */ 
var __decorate = (this && this.__decorate) || function(decorators, target, key, desc) {
  if (typeof Reflect === "object" && typeof Reflect.decorate === "function")
    return Reflect.decorate(decorators, target, key, desc);
  switch (arguments.length) {
    case 2:
      return decorators.reduceRight(function(o, d) {
        return (d && d(o)) || o;
      }, target);
    case 3:
      return decorators.reduceRight(function(o, d) {
        return (d && d(target, key)), void 0;
      }, void 0);
    case 4:
      return decorators.reduceRight(function(o, d) {
        return (d && d(target, key, o)) || o;
      }, desc);
  }
};
var __metadata = (this && this.__metadata) || function(k, v) {
  if (typeof Reflect === "object" && typeof Reflect.metadata === "function")
    return Reflect.metadata(k, v);
};
var browser_location_1 = require("./browser_location");
var lang_1 = require("../facade/lang");
var async_1 = require("../facade/async");
var di_1 = require("../../di");
var Location = (function() {
  function Location(_browserLocation) {
    var _this = this;
    this._browserLocation = _browserLocation;
    this._subject = new async_1.EventEmitter();
    this._baseHref = stripIndexHtml(this._browserLocation.getBaseHref());
    this._browserLocation.onPopState(function(_) {
      return _this._onPopState(_);
    });
  }
  Location.prototype._onPopState = function(_) {
    async_1.ObservableWrapper.callNext(this._subject, {'url': this.path()});
  };
  Location.prototype.path = function() {
    return this.normalize(this._browserLocation.path());
  };
  Location.prototype.normalize = function(url) {
    return this._stripBaseHref(stripIndexHtml(url));
  };
  Location.prototype.normalizeAbsolutely = function(url) {
    if (url[0] != '/') {
      url = '/' + url;
    }
    return this._addBaseHref(url);
  };
  Location.prototype._stripBaseHref = function(url) {
    if (this._baseHref.length > 0 && lang_1.StringWrapper.startsWith(url, this._baseHref)) {
      return lang_1.StringWrapper.substring(url, this._baseHref.length);
    }
    return url;
  };
  Location.prototype._addBaseHref = function(url) {
    if (!lang_1.StringWrapper.startsWith(url, this._baseHref)) {
      return this._baseHref + url;
    }
    return url;
  };
  Location.prototype.go = function(url) {
    var finalUrl = this.normalizeAbsolutely(url);
    this._browserLocation.pushState(null, '', finalUrl);
  };
  Location.prototype.forward = function() {
    this._browserLocation.forward();
  };
  Location.prototype.back = function() {
    this._browserLocation.back();
  };
  Location.prototype.subscribe = function(onNext, onThrow, onReturn) {
    if (onThrow === void 0) {
      onThrow = null;
    }
    if (onReturn === void 0) {
      onReturn = null;
    }
    async_1.ObservableWrapper.subscribe(this._subject, onNext, onThrow, onReturn);
  };
  Location = __decorate([di_1.Injectable(), __metadata('design:paramtypes', [browser_location_1.BrowserLocation])], Location);
  return Location;
})();
exports.Location = Location;
function stripIndexHtml(url) {
  if (url.length > 10 && lang_1.StringWrapper.substring(url, url.length - 11) == '/index.html') {
    return lang_1.StringWrapper.substring(url, 0, url.length - 11);
  }
  return url;
}
exports.__esModule = true;
