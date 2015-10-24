/* */ 
var collection_1 = require("../../facade/collection");
var lang_1 = require("../../facade/lang");
var NgZone = (function() {
  function NgZone(_a) {
    var enableLongStackTrace = _a.enableLongStackTrace;
    this._onTurnStart = null;
    this._onTurnDone = null;
    this._onErrorHandler = null;
    this._pendingMicrotasks = 0;
    this._hasExecutedCodeInInnerZone = false;
    this._nestedRun = 0;
    if (lang_1.global.zone) {
      this._disabled = false;
      this._mountZone = lang_1.global.zone;
      this._innerZone = this._createInnerZone(this._mountZone, enableLongStackTrace);
    } else {
      this._disabled = true;
      this._mountZone = null;
    }
  }
  NgZone.prototype.initCallbacks = function(_a) {
    var _b = _a === void 0 ? {} : _a,
        onTurnStart = _b.onTurnStart,
        onTurnDone = _b.onTurnDone,
        onErrorHandler = _b.onErrorHandler;
    this._onTurnStart = lang_1.normalizeBlank(onTurnStart);
    this._onTurnDone = lang_1.normalizeBlank(onTurnDone);
    this._onErrorHandler = lang_1.normalizeBlank(onErrorHandler);
  };
  NgZone.prototype.run = function(fn) {
    if (this._disabled) {
      return fn();
    } else {
      return this._innerZone.run(fn);
    }
  };
  NgZone.prototype.runOutsideAngular = function(fn) {
    if (this._disabled) {
      return fn();
    } else {
      return this._mountZone.run(fn);
    }
  };
  NgZone.prototype._createInnerZone = function(zone, enableLongStackTrace) {
    var ngZone = this;
    var errorHandling;
    if (enableLongStackTrace) {
      errorHandling = collection_1.StringMapWrapper.merge(Zone.longStackTraceZone, {onError: function(e) {
          ngZone._onError(this, e);
        }});
    } else {
      errorHandling = {onError: function(e) {
          ngZone._onError(this, e);
        }};
    }
    return zone.fork(errorHandling).fork({
      '$run': function(parentRun) {
        return function() {
          try {
            ngZone._nestedRun++;
            if (!ngZone._hasExecutedCodeInInnerZone) {
              ngZone._hasExecutedCodeInInnerZone = true;
              if (ngZone._onTurnStart) {
                parentRun.call(ngZone._innerZone, ngZone._onTurnStart);
              }
            }
            return parentRun.apply(this, arguments);
          } finally {
            ngZone._nestedRun--;
            if (ngZone._pendingMicrotasks == 0 && ngZone._nestedRun == 0) {
              if (ngZone._onTurnDone && ngZone._hasExecutedCodeInInnerZone) {
                try {
                  parentRun.call(ngZone._innerZone, ngZone._onTurnDone);
                } finally {
                  ngZone._hasExecutedCodeInInnerZone = false;
                }
              }
            }
          }
        };
      },
      '$scheduleMicrotask': function(parentScheduleMicrotask) {
        return function(fn) {
          ngZone._pendingMicrotasks++;
          var microtask = function() {
            try {
              fn();
            } finally {
              ngZone._pendingMicrotasks--;
            }
          };
          parentScheduleMicrotask.call(this, microtask);
        };
      },
      _innerZone: true
    });
  };
  NgZone.prototype._onError = function(zone, e) {
    if (lang_1.isPresent(this._onErrorHandler)) {
      var trace = [lang_1.normalizeBlank(e.stack)];
      while (zone && zone.constructedAtException) {
        trace.push(zone.constructedAtException.get());
        zone = zone.parent;
      }
      this._onErrorHandler(e, trace);
    } else {
      console.log('## _onError ##');
      console.log(e.stack);
      throw e;
    }
  };
  return NgZone;
})();
exports.NgZone = NgZone;
exports.__esModule = true;
