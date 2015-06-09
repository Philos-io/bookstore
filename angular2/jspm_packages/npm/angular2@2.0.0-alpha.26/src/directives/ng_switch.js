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
var __param = (this && this.__param) || function(paramIndex, decorator) {
  return function(target, key) {
    decorator(target, key, paramIndex);
  };
};
var annotations_1 = require("../../annotations");
var core_1 = require("../../core");
var lang_1 = require("../facade/lang");
var collection_1 = require("../facade/collection");
var SwitchView = (function() {
  function SwitchView(viewContainerRef, protoViewRef) {
    this._protoViewRef = protoViewRef;
    this._viewContainerRef = viewContainerRef;
  }
  SwitchView.prototype.create = function() {
    this._viewContainerRef.create(this._protoViewRef);
  };
  SwitchView.prototype.destroy = function() {
    this._viewContainerRef.clear();
  };
  return SwitchView;
})();
exports.SwitchView = SwitchView;
var NgSwitch = (function() {
  function NgSwitch() {
    this._valueViews = collection_1.MapWrapper.create();
    this._activeViews = collection_1.ListWrapper.create();
    this._useDefault = false;
  }
  Object.defineProperty(NgSwitch.prototype, "ngSwitch", {
    set: function(value) {
      this._emptyAllActiveViews();
      this._useDefault = false;
      var views = collection_1.MapWrapper.get(this._valueViews, value);
      if (lang_1.isBlank(views)) {
        this._useDefault = true;
        views = lang_1.normalizeBlank(collection_1.MapWrapper.get(this._valueViews, _whenDefault));
      }
      this._activateViews(views);
      this._switchValue = value;
    },
    enumerable: true,
    configurable: true
  });
  NgSwitch.prototype._onWhenValueChanged = function(oldWhen, newWhen, view) {
    this._deregisterView(oldWhen, view);
    this._registerView(newWhen, view);
    if (oldWhen === this._switchValue) {
      view.destroy();
      collection_1.ListWrapper.remove(this._activeViews, view);
    } else if (newWhen === this._switchValue) {
      if (this._useDefault) {
        this._useDefault = false;
        this._emptyAllActiveViews();
      }
      view.create();
      collection_1.ListWrapper.push(this._activeViews, view);
    }
    if (this._activeViews.length === 0 && !this._useDefault) {
      this._useDefault = true;
      this._activateViews(collection_1.MapWrapper.get(this._valueViews, _whenDefault));
    }
  };
  NgSwitch.prototype._emptyAllActiveViews = function() {
    var activeContainers = this._activeViews;
    for (var i = 0; i < activeContainers.length; i++) {
      activeContainers[i].destroy();
    }
    this._activeViews = collection_1.ListWrapper.create();
  };
  NgSwitch.prototype._activateViews = function(views) {
    if (lang_1.isPresent(views)) {
      for (var i = 0; i < views.length; i++) {
        views[i].create();
      }
      this._activeViews = views;
    }
  };
  NgSwitch.prototype._registerView = function(value, view) {
    var views = collection_1.MapWrapper.get(this._valueViews, value);
    if (lang_1.isBlank(views)) {
      views = collection_1.ListWrapper.create();
      collection_1.MapWrapper.set(this._valueViews, value, views);
    }
    collection_1.ListWrapper.push(views, view);
  };
  NgSwitch.prototype._deregisterView = function(value, view) {
    if (value == _whenDefault)
      return ;
    var views = collection_1.MapWrapper.get(this._valueViews, value);
    if (views.length == 1) {
      collection_1.MapWrapper.delete(this._valueViews, value);
    } else {
      collection_1.ListWrapper.remove(views, view);
    }
  };
  NgSwitch = __decorate([annotations_1.Directive({
    selector: '[ng-switch]',
    properties: ['ngSwitch']
  }), __metadata('design:paramtypes', [])], NgSwitch);
  return NgSwitch;
})();
exports.NgSwitch = NgSwitch;
var NgSwitchWhen = (function() {
  function NgSwitchWhen(viewContainer, protoViewRef, sswitch) {
    this._value = _whenDefault;
    this._switch = sswitch;
    this._view = new SwitchView(viewContainer, protoViewRef);
  }
  NgSwitchWhen.prototype.onDestroy = function() {
    this._switch;
  };
  Object.defineProperty(NgSwitchWhen.prototype, "ngSwitchWhen", {
    set: function(value) {
      this._switch._onWhenValueChanged(this._value, value, this._view);
      this._value = value;
    },
    enumerable: true,
    configurable: true
  });
  NgSwitchWhen = __decorate([annotations_1.Directive({
    selector: '[ng-switch-when]',
    properties: ['ngSwitchWhen']
  }), __param(2, annotations_1.Parent()), __metadata('design:paramtypes', [core_1.ViewContainerRef, core_1.ProtoViewRef, NgSwitch])], NgSwitchWhen);
  return NgSwitchWhen;
})();
exports.NgSwitchWhen = NgSwitchWhen;
var NgSwitchDefault = (function() {
  function NgSwitchDefault(viewContainer, protoViewRef, sswitch) {
    sswitch._registerView(_whenDefault, new SwitchView(viewContainer, protoViewRef));
  }
  NgSwitchDefault = __decorate([annotations_1.Directive({selector: '[ng-switch-default]'}), __param(2, annotations_1.Parent()), __metadata('design:paramtypes', [core_1.ViewContainerRef, core_1.ProtoViewRef, NgSwitch])], NgSwitchDefault);
  return NgSwitchDefault;
})();
exports.NgSwitchDefault = NgSwitchDefault;
var _whenDefault = new Object();
exports.__esModule = true;
