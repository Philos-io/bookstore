/* */ 
var __extends = (this && this.__extends) || function(d, b) {
  for (var p in b)
    if (b.hasOwnProperty(p))
      d[p] = b[p];
  function __() {
    this.constructor = d;
  }
  __.prototype = b.prototype;
  d.prototype = new __();
};
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
var proto_change_detector_1 = require("./proto_change_detector");
var pipe_registry_1 = require("./pipes/pipe_registry");
var iterable_changes_1 = require("./pipes/iterable_changes");
var keyvalue_changes_1 = require("./pipes/keyvalue_changes");
var observable_pipe_1 = require("./pipes/observable_pipe");
var promise_pipe_1 = require("./pipes/promise_pipe");
var uppercase_pipe_1 = require("./pipes/uppercase_pipe");
var lowercase_pipe_1 = require("./pipes/lowercase_pipe");
var json_pipe_1 = require("./pipes/json_pipe");
var null_pipe_1 = require("./pipes/null_pipe");
var interfaces_1 = require("./interfaces");
var decorators_1 = require("../di/decorators");
var collection_1 = require("../facade/collection");
var lang_1 = require("../facade/lang");
exports.keyValDiff = [new keyvalue_changes_1.KeyValueChangesFactory(), new null_pipe_1.NullPipeFactory()];
exports.iterableDiff = [new iterable_changes_1.IterableChangesFactory(), new null_pipe_1.NullPipeFactory()];
exports.async = [new observable_pipe_1.ObservablePipeFactory(), new promise_pipe_1.PromisePipeFactory(), new null_pipe_1.NullPipeFactory()];
exports.uppercase = [new uppercase_pipe_1.UpperCaseFactory(), new null_pipe_1.NullPipeFactory()];
exports.lowercase = [new lowercase_pipe_1.LowerCaseFactory(), new null_pipe_1.NullPipeFactory()];
exports.json = [new json_pipe_1.JsonPipeFactory(), new null_pipe_1.NullPipeFactory()];
exports.defaultPipes = {
  "iterableDiff": exports.iterableDiff,
  "keyValDiff": exports.keyValDiff,
  "async": exports.async,
  "uppercase": exports.uppercase,
  "lowercase": exports.lowercase,
  "json": exports.json
};
exports.preGeneratedProtoDetectors = {};
var PreGeneratedChangeDetection = (function(_super) {
  __extends(PreGeneratedChangeDetection, _super);
  function PreGeneratedChangeDetection(registry, protoChangeDetectors) {
    _super.call(this);
    this.registry = registry;
    this._dynamicChangeDetection = new DynamicChangeDetection(registry);
    this._protoChangeDetectorFactories = lang_1.isPresent(protoChangeDetectors) ? protoChangeDetectors : exports.preGeneratedProtoDetectors;
  }
  PreGeneratedChangeDetection.prototype.createProtoChangeDetector = function(definition) {
    var id = definition.id;
    if (collection_1.StringMapWrapper.contains(this._protoChangeDetectorFactories, id)) {
      return collection_1.StringMapWrapper.get(this._protoChangeDetectorFactories, id)(this.registry);
    }
    return this._dynamicChangeDetection.createProtoChangeDetector(definition);
  };
  return PreGeneratedChangeDetection;
})(interfaces_1.ChangeDetection);
exports.PreGeneratedChangeDetection = PreGeneratedChangeDetection;
var DynamicChangeDetection = (function(_super) {
  __extends(DynamicChangeDetection, _super);
  function DynamicChangeDetection(registry) {
    _super.call(this);
    this.registry = registry;
  }
  DynamicChangeDetection.prototype.createProtoChangeDetector = function(definition) {
    return new proto_change_detector_1.DynamicProtoChangeDetector(this.registry, definition);
  };
  DynamicChangeDetection = __decorate([decorators_1.Injectable(), __metadata('design:paramtypes', [pipe_registry_1.PipeRegistry])], DynamicChangeDetection);
  return DynamicChangeDetection;
})(interfaces_1.ChangeDetection);
exports.DynamicChangeDetection = DynamicChangeDetection;
var JitChangeDetection = (function(_super) {
  __extends(JitChangeDetection, _super);
  function JitChangeDetection(registry) {
    _super.call(this);
    this.registry = registry;
  }
  JitChangeDetection.prototype.createProtoChangeDetector = function(definition) {
    return new proto_change_detector_1.JitProtoChangeDetector(this.registry, definition);
  };
  JitChangeDetection = __decorate([decorators_1.Injectable(), __metadata('design:paramtypes', [pipe_registry_1.PipeRegistry])], JitChangeDetection);
  return JitChangeDetection;
})(interfaces_1.ChangeDetection);
exports.JitChangeDetection = JitChangeDetection;
exports.defaultPipeRegistry = new pipe_registry_1.PipeRegistry(exports.defaultPipes);
exports.__esModule = true;
