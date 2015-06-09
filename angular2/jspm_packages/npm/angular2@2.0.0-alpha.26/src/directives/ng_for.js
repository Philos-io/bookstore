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
var annotations_1 = require("../../annotations");
var core_1 = require("../../core");
var lang_1 = require("../facade/lang");
var collection_1 = require("../facade/collection");
var NgFor = (function() {
  function NgFor(viewContainer, protoViewRef) {
    this.viewContainer = viewContainer;
    this.protoViewRef = protoViewRef;
  }
  Object.defineProperty(NgFor.prototype, "iterableChanges", {
    set: function(changes) {
      if (lang_1.isBlank(changes)) {
        this.viewContainer.clear();
        return ;
      }
      var recordViewTuples = [];
      changes.forEachRemovedItem(function(removedRecord) {
        return collection_1.ListWrapper.push(recordViewTuples, new RecordViewTuple(removedRecord, null));
      });
      changes.forEachMovedItem(function(movedRecord) {
        return collection_1.ListWrapper.push(recordViewTuples, new RecordViewTuple(movedRecord, null));
      });
      var insertTuples = NgFor.bulkRemove(recordViewTuples, this.viewContainer);
      changes.forEachAddedItem(function(addedRecord) {
        return collection_1.ListWrapper.push(insertTuples, new RecordViewTuple(addedRecord, null));
      });
      NgFor.bulkInsert(insertTuples, this.viewContainer, this.protoViewRef);
      for (var i = 0; i < insertTuples.length; i++) {
        this.perViewChange(insertTuples[i].view, insertTuples[i].record);
      }
    },
    enumerable: true,
    configurable: true
  });
  NgFor.prototype.perViewChange = function(view, record) {
    view.setLocal('\$implicit', record.item);
    view.setLocal('index', record.currentIndex);
  };
  NgFor.bulkRemove = function(tuples, viewContainer) {
    tuples.sort(function(a, b) {
      return a.record.previousIndex - b.record.previousIndex;
    });
    var movedTuples = [];
    for (var i = tuples.length - 1; i >= 0; i--) {
      var tuple = tuples[i];
      if (lang_1.isPresent(tuple.record.currentIndex)) {
        tuple.view = viewContainer.detach(tuple.record.previousIndex);
        collection_1.ListWrapper.push(movedTuples, tuple);
      } else {
        viewContainer.remove(tuple.record.previousIndex);
      }
    }
    return movedTuples;
  };
  NgFor.bulkInsert = function(tuples, viewContainer, protoViewRef) {
    tuples.sort(function(a, b) {
      return a.record.currentIndex - b.record.currentIndex;
    });
    for (var i = 0; i < tuples.length; i++) {
      var tuple = tuples[i];
      if (lang_1.isPresent(tuple.view)) {
        viewContainer.insert(tuple.view, tuple.record.currentIndex);
      } else {
        tuple.view = viewContainer.create(protoViewRef, tuple.record.currentIndex);
      }
    }
    return tuples;
  };
  NgFor = __decorate([annotations_1.Directive({
    selector: '[ng-for][ng-for-of]',
    properties: ['iterableChanges: ngForOf | iterableDiff']
  }), __metadata('design:paramtypes', [core_1.ViewContainerRef, core_1.ProtoViewRef])], NgFor);
  return NgFor;
})();
exports.NgFor = NgFor;
var RecordViewTuple = (function() {
  function RecordViewTuple(record, view) {
    this.record = record;
    this.view = view;
  }
  return RecordViewTuple;
})();
exports.__esModule = true;