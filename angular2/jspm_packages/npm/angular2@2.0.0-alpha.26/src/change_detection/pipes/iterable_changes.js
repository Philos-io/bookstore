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
var lang_1 = require("../../facade/lang");
var collection_1 = require("../../facade/collection");
var lang_2 = require("../../facade/lang");
var pipe_1 = require("./pipe");
var IterableChangesFactory = (function(_super) {
  __extends(IterableChangesFactory, _super);
  function IterableChangesFactory() {
    _super.call(this);
  }
  IterableChangesFactory.prototype.supports = function(obj) {
    return IterableChanges.supportsObj(obj);
  };
  IterableChangesFactory.prototype.create = function(cdRef) {
    return new IterableChanges();
  };
  IterableChangesFactory = __decorate([lang_1.CONST(), __metadata('design:paramtypes', [])], IterableChangesFactory);
  return IterableChangesFactory;
})(pipe_1.PipeFactory);
exports.IterableChangesFactory = IterableChangesFactory;
var IterableChanges = (function(_super) {
  __extends(IterableChanges, _super);
  function IterableChanges() {
    _super.call(this);
    this._collection = null;
    this._length = null;
    this._linkedRecords = null;
    this._unlinkedRecords = null;
    this._previousItHead = null;
    this._itHead = null;
    this._itTail = null;
    this._additionsHead = null;
    this._additionsTail = null;
    this._movesHead = null;
    this._movesTail = null;
    this._removalsHead = null;
    this._removalsTail = null;
  }
  IterableChanges.supportsObj = function(obj) {
    return collection_1.isListLikeIterable(obj);
  };
  IterableChanges.prototype.supports = function(obj) {
    return IterableChanges.supportsObj(obj);
  };
  Object.defineProperty(IterableChanges.prototype, "collection", {
    get: function() {
      return this._collection;
    },
    enumerable: true,
    configurable: true
  });
  Object.defineProperty(IterableChanges.prototype, "length", {
    get: function() {
      return this._length;
    },
    enumerable: true,
    configurable: true
  });
  IterableChanges.prototype.forEachItem = function(fn) {
    var record;
    for (record = this._itHead; record !== null; record = record._next) {
      fn(record);
    }
  };
  IterableChanges.prototype.forEachPreviousItem = function(fn) {
    var record;
    for (record = this._previousItHead; record !== null; record = record._nextPrevious) {
      fn(record);
    }
  };
  IterableChanges.prototype.forEachAddedItem = function(fn) {
    var record;
    for (record = this._additionsHead; record !== null; record = record._nextAdded) {
      fn(record);
    }
  };
  IterableChanges.prototype.forEachMovedItem = function(fn) {
    var record;
    for (record = this._movesHead; record !== null; record = record._nextMoved) {
      fn(record);
    }
  };
  IterableChanges.prototype.forEachRemovedItem = function(fn) {
    var record;
    for (record = this._removalsHead; record !== null; record = record._nextRemoved) {
      fn(record);
    }
  };
  IterableChanges.prototype.transform = function(collection) {
    if (this.check(collection)) {
      return pipe_1.WrappedValue.wrap(this);
    } else {
      return this;
    }
  };
  IterableChanges.prototype.check = function(collection) {
    var _this = this;
    this._reset();
    var record = this._itHead;
    var mayBeDirty = false;
    var index;
    var item;
    if (collection_1.ListWrapper.isList(collection)) {
      var list = collection;
      this._length = collection.length;
      for (index = 0; index < this._length; index++) {
        item = list[index];
        if (record === null || !lang_2.looseIdentical(record.item, item)) {
          record = this._mismatch(record, item, index);
          mayBeDirty = true;
        } else if (mayBeDirty) {
          record = this._verifyReinsertion(record, item, index);
        }
        record = record._next;
      }
    } else {
      index = 0;
      collection_1.iterateListLike(collection, function(item) {
        if (record === null || !lang_2.looseIdentical(record.item, item)) {
          record = _this._mismatch(record, item, index);
          mayBeDirty = true;
        } else if (mayBeDirty) {
          record = _this._verifyReinsertion(record, item, index);
        }
        record = record._next;
        index++;
      });
      this._length = index;
    }
    this._truncate(record);
    this._collection = collection;
    return this.isDirty;
  };
  Object.defineProperty(IterableChanges.prototype, "isDirty", {
    get: function() {
      return this._additionsHead !== null || this._movesHead !== null || this._removalsHead !== null;
    },
    enumerable: true,
    configurable: true
  });
  IterableChanges.prototype._reset = function() {
    if (this.isDirty) {
      var record;
      var nextRecord;
      for (record = this._previousItHead = this._itHead; record !== null; record = record._next) {
        record._nextPrevious = record._next;
      }
      for (record = this._additionsHead; record !== null; record = record._nextAdded) {
        record.previousIndex = record.currentIndex;
      }
      this._additionsHead = this._additionsTail = null;
      for (record = this._movesHead; record !== null; record = nextRecord) {
        record.previousIndex = record.currentIndex;
        nextRecord = record._nextMoved;
      }
      this._movesHead = this._movesTail = null;
      this._removalsHead = this._removalsTail = null;
    }
  };
  IterableChanges.prototype._mismatch = function(record, item, index) {
    var previousRecord;
    if (record === null) {
      previousRecord = this._itTail;
    } else {
      previousRecord = record._prev;
      this._remove(record);
    }
    record = this._linkedRecords === null ? null : this._linkedRecords.get(item, index);
    if (record !== null) {
      this._moveAfter(record, previousRecord, index);
    } else {
      record = this._unlinkedRecords === null ? null : this._unlinkedRecords.get(item);
      if (record !== null) {
        this._reinsertAfter(record, previousRecord, index);
      } else {
        record = this._addAfter(new CollectionChangeRecord(item), previousRecord, index);
      }
    }
    return record;
  };
  IterableChanges.prototype._verifyReinsertion = function(record, item, index) {
    var reinsertRecord = this._unlinkedRecords === null ? null : this._unlinkedRecords.get(item);
    if (reinsertRecord !== null) {
      record = this._reinsertAfter(reinsertRecord, record._prev, index);
    } else if (record.currentIndex != index) {
      record.currentIndex = index;
      this._addToMoves(record, index);
    }
    return record;
  };
  IterableChanges.prototype._truncate = function(record) {
    while (record !== null) {
      var nextRecord = record._next;
      this._addToRemovals(this._unlink(record));
      record = nextRecord;
    }
    if (this._unlinkedRecords !== null) {
      this._unlinkedRecords.clear();
    }
    if (this._additionsTail !== null) {
      this._additionsTail._nextAdded = null;
    }
    if (this._movesTail !== null) {
      this._movesTail._nextMoved = null;
    }
    if (this._itTail !== null) {
      this._itTail._next = null;
    }
    if (this._removalsTail !== null) {
      this._removalsTail._nextRemoved = null;
    }
  };
  IterableChanges.prototype._reinsertAfter = function(record, prevRecord, index) {
    if (this._unlinkedRecords !== null) {
      this._unlinkedRecords.remove(record);
    }
    var prev = record._prevRemoved;
    var next = record._nextRemoved;
    if (prev === null) {
      this._removalsHead = next;
    } else {
      prev._nextRemoved = next;
    }
    if (next === null) {
      this._removalsTail = prev;
    } else {
      next._prevRemoved = prev;
    }
    this._insertAfter(record, prevRecord, index);
    this._addToMoves(record, index);
    return record;
  };
  IterableChanges.prototype._moveAfter = function(record, prevRecord, index) {
    this._unlink(record);
    this._insertAfter(record, prevRecord, index);
    this._addToMoves(record, index);
    return record;
  };
  IterableChanges.prototype._addAfter = function(record, prevRecord, index) {
    this._insertAfter(record, prevRecord, index);
    if (this._additionsTail === null) {
      this._additionsTail = this._additionsHead = record;
    } else {
      this._additionsTail = this._additionsTail._nextAdded = record;
    }
    return record;
  };
  IterableChanges.prototype._insertAfter = function(record, prevRecord, index) {
    var next = prevRecord === null ? this._itHead : prevRecord._next;
    record._next = next;
    record._prev = prevRecord;
    if (next === null) {
      this._itTail = record;
    } else {
      next._prev = record;
    }
    if (prevRecord === null) {
      this._itHead = record;
    } else {
      prevRecord._next = record;
    }
    if (this._linkedRecords === null) {
      this._linkedRecords = new _DuplicateMap();
    }
    this._linkedRecords.put(record);
    record.currentIndex = index;
    return record;
  };
  IterableChanges.prototype._remove = function(record) {
    return this._addToRemovals(this._unlink(record));
  };
  IterableChanges.prototype._unlink = function(record) {
    if (this._linkedRecords !== null) {
      this._linkedRecords.remove(record);
    }
    var prev = record._prev;
    var next = record._next;
    if (prev === null) {
      this._itHead = next;
    } else {
      prev._next = next;
    }
    if (next === null) {
      this._itTail = prev;
    } else {
      next._prev = prev;
    }
    return record;
  };
  IterableChanges.prototype._addToMoves = function(record, toIndex) {
    if (record.previousIndex === toIndex) {
      return record;
    }
    if (this._movesTail === null) {
      this._movesTail = this._movesHead = record;
    } else {
      this._movesTail = this._movesTail._nextMoved = record;
    }
    return record;
  };
  IterableChanges.prototype._addToRemovals = function(record) {
    if (this._unlinkedRecords === null) {
      this._unlinkedRecords = new _DuplicateMap();
    }
    this._unlinkedRecords.put(record);
    record.currentIndex = null;
    record._nextRemoved = null;
    if (this._removalsTail === null) {
      this._removalsTail = this._removalsHead = record;
      record._prevRemoved = null;
    } else {
      record._prevRemoved = this._removalsTail;
      this._removalsTail = this._removalsTail._nextRemoved = record;
    }
    return record;
  };
  IterableChanges.prototype.toString = function() {
    var record;
    var list = [];
    for (record = this._itHead; record !== null; record = record._next) {
      collection_1.ListWrapper.push(list, record);
    }
    var previous = [];
    for (record = this._previousItHead; record !== null; record = record._nextPrevious) {
      collection_1.ListWrapper.push(previous, record);
    }
    var additions = [];
    for (record = this._additionsHead; record !== null; record = record._nextAdded) {
      collection_1.ListWrapper.push(additions, record);
    }
    var moves = [];
    for (record = this._movesHead; record !== null; record = record._nextMoved) {
      collection_1.ListWrapper.push(moves, record);
    }
    var removals = [];
    for (record = this._removalsHead; record !== null; record = record._nextRemoved) {
      collection_1.ListWrapper.push(removals, record);
    }
    return "collection: " + list.join(', ') + "\n" + "previous: " + previous.join(', ') + "\n" + "additions: " + additions.join(', ') + "\n" + "moves: " + moves.join(', ') + "\n" + "removals: " + removals.join(', ') + "\n";
  };
  return IterableChanges;
})(pipe_1.Pipe);
exports.IterableChanges = IterableChanges;
var CollectionChangeRecord = (function() {
  function CollectionChangeRecord(item) {
    this.currentIndex = null;
    this.previousIndex = null;
    this.item = item;
    this._nextPrevious = null;
    this._prev = null;
    this._next = null;
    this._prevDup = null;
    this._nextDup = null;
    this._prevRemoved = null;
    this._nextRemoved = null;
    this._nextAdded = null;
    this._nextMoved = null;
  }
  CollectionChangeRecord.prototype.toString = function() {
    return this.previousIndex === this.currentIndex ? lang_2.stringify(this.item) : lang_2.stringify(this.item) + '[' + lang_2.stringify(this.previousIndex) + '->' + lang_2.stringify(this.currentIndex) + ']';
  };
  return CollectionChangeRecord;
})();
exports.CollectionChangeRecord = CollectionChangeRecord;
var _DuplicateItemRecordList = (function() {
  function _DuplicateItemRecordList() {
    this._head = null;
    this._tail = null;
  }
  _DuplicateItemRecordList.prototype.add = function(record) {
    if (this._head === null) {
      this._head = this._tail = record;
      record._nextDup = null;
      record._prevDup = null;
    } else {
      this._tail._nextDup = record;
      record._prevDup = this._tail;
      record._nextDup = null;
      this._tail = record;
    }
  };
  _DuplicateItemRecordList.prototype.get = function(item, afterIndex) {
    var record;
    for (record = this._head; record !== null; record = record._nextDup) {
      if ((afterIndex === null || afterIndex < record.currentIndex) && lang_2.looseIdentical(record.item, item)) {
        return record;
      }
    }
    return null;
  };
  _DuplicateItemRecordList.prototype.remove = function(record) {
    var prev = record._prevDup;
    var next = record._nextDup;
    if (prev === null) {
      this._head = next;
    } else {
      prev._nextDup = next;
    }
    if (next === null) {
      this._tail = prev;
    } else {
      next._prevDup = prev;
    }
    return this._head === null;
  };
  return _DuplicateItemRecordList;
})();
var _DuplicateMap = (function() {
  function _DuplicateMap() {
    this.map = collection_1.MapWrapper.create();
  }
  _DuplicateMap.prototype.put = function(record) {
    var key = lang_2.getMapKey(record.item);
    var duplicates = collection_1.MapWrapper.get(this.map, key);
    if (!lang_2.isPresent(duplicates)) {
      duplicates = new _DuplicateItemRecordList();
      collection_1.MapWrapper.set(this.map, key, duplicates);
    }
    duplicates.add(record);
  };
  _DuplicateMap.prototype.get = function(value, afterIndex) {
    if (afterIndex === void 0) {
      afterIndex = null;
    }
    var key = lang_2.getMapKey(value);
    var recordList = collection_1.MapWrapper.get(this.map, key);
    return lang_2.isBlank(recordList) ? null : recordList.get(value, afterIndex);
  };
  _DuplicateMap.prototype.remove = function(record) {
    var key = lang_2.getMapKey(record.item);
    var recordList = collection_1.MapWrapper.get(this.map, key);
    if (recordList.remove(record)) {
      collection_1.MapWrapper.delete(this.map, key);
    }
    return record;
  };
  Object.defineProperty(_DuplicateMap.prototype, "isEmpty", {
    get: function() {
      return collection_1.MapWrapper.size(this.map) === 0;
    },
    enumerable: true,
    configurable: true
  });
  _DuplicateMap.prototype.clear = function() {
    collection_1.MapWrapper.clear(this.map);
  };
  _DuplicateMap.prototype.toString = function() {
    return '_DuplicateMap(' + lang_2.stringify(this.map) + ')';
  };
  return _DuplicateMap;
})();
exports.__esModule = true;
