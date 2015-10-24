import {isPresent, isBlank, BaseException, FunctionWrapper} from 'angular2/src/facade/lang';
import {List, ListWrapper, MapWrapper, StringMapWrapper} from 'angular2/src/facade/collection';

import {AbstractChangeDetector} from './abstract_change_detector';
import {BindingRecord} from './binding_record';
import {PipeRegistry} from './pipes/pipe_registry';
import {ChangeDetectionUtil, SimpleChange, uninitialized} from './change_detection_util';


import {
  ProtoRecord,
  RECORD_TYPE_SELF,
  RECORD_TYPE_PROPERTY,
  RECORD_TYPE_LOCAL,
  RECORD_TYPE_INVOKE_METHOD,
  RECORD_TYPE_CONST,
  RECORD_TYPE_INVOKE_CLOSURE,
  RECORD_TYPE_PRIMITIVE_OP,
  RECORD_TYPE_KEYED_ACCESS,
  RECORD_TYPE_PIPE,
  RECORD_TYPE_BINDING_PIPE,
  RECORD_TYPE_INTERPOLATE,
  RECORD_TYPE_SAFE_PROPERTY,
  RECORD_TYPE_SAFE_INVOKE_METHOD
} from './proto_record';

import {ExpressionChangedAfterItHasBeenChecked, ChangeDetectionError} from './exceptions';

export class DynamicChangeDetector extends AbstractChangeDetector {
  locals: any = null;
  values: List<any>;
  changes: List<any>;
  pipes: List<any>;
  prevContexts: List<any>;
  directives: any = null;
  alreadyChecked: boolean = false;

  constructor(private changeControlStrategy: string, private dispatcher: any,
              private pipeRegistry: PipeRegistry, private protos: List<ProtoRecord>,
              private directiveRecords: List<any>) {
    super();
    this.values = ListWrapper.createFixedSize(protos.length + 1);
    this.pipes = ListWrapper.createFixedSize(protos.length + 1);
    this.prevContexts = ListWrapper.createFixedSize(protos.length + 1);
    this.changes = ListWrapper.createFixedSize(protos.length + 1);

    ListWrapper.fill(this.values, uninitialized);
    ListWrapper.fill(this.pipes, null);
    ListWrapper.fill(this.prevContexts, uninitialized);
    ListWrapper.fill(this.changes, false);
  }

  hydrate(context: any, locals: any, directives: any) {
    this.mode = ChangeDetectionUtil.changeDetectionMode(this.changeControlStrategy);
    this.values[0] = context;
    this.locals = locals;
    this.directives = directives;
    this.alreadyChecked = false;
  }

  dehydrate() {
    this._destroyPipes();
    ListWrapper.fill(this.values, uninitialized);
    ListWrapper.fill(this.changes, false);
    ListWrapper.fill(this.pipes, null);
    ListWrapper.fill(this.prevContexts, uninitialized);
    this.locals = null;
  }

  _destroyPipes() {
    for (var i = 0; i < this.pipes.length; ++i) {
      if (isPresent(this.pipes[i])) {
        this.pipes[i].onDestroy();
      }
    }
  }

  hydrated(): boolean { return this.values[0] !== uninitialized; }

  detectChangesInRecords(throwOnChange: boolean) {
    var protos: List<ProtoRecord> = this.protos;

    var changes = null;
    var isChanged = false;
    for (var i = 0; i < protos.length; ++i) {
      var proto: ProtoRecord = protos[i];
      var bindingRecord = proto.bindingRecord;
      var directiveRecord = bindingRecord.directiveRecord;

      if (proto.isLifeCycleRecord()) {
        if (proto.name === "onCheck" && !throwOnChange) {
          this._getDirectiveFor(directiveRecord.directiveIndex).onCheck();
        } else if (proto.name === "onInit" && !throwOnChange && !this.alreadyChecked) {
          this._getDirectiveFor(directiveRecord.directiveIndex).onInit();
        } else if (proto.name === "onChange" && isPresent(changes) && !throwOnChange) {
          this._getDirectiveFor(directiveRecord.directiveIndex).onChange(changes);
        }

      } else {
        var change = this._check(proto, throwOnChange);
        if (isPresent(change)) {
          this._updateDirectiveOrElement(change, bindingRecord);
          isChanged = true;
          changes = this._addChange(bindingRecord, change, changes);
        }
      }

      if (proto.lastInDirective) {
        changes = null;
        if (isChanged && bindingRecord.isOnPushChangeDetection()) {
          this._getDetectorFor(directiveRecord.directiveIndex).markAsCheckOnce();
        }

        isChanged = false;
      }
    }

    this.alreadyChecked = true;
  }

  callOnAllChangesDone() {
    var dirs = this.directiveRecords;
    for (var i = dirs.length - 1; i >= 0; --i) {
      var dir = dirs[i];
      if (dir.callOnAllChangesDone) {
        this._getDirectiveFor(dir.directiveIndex).onAllChangesDone();
      }
    }
  }

  _updateDirectiveOrElement(change, bindingRecord) {
    if (isBlank(bindingRecord.directiveRecord)) {
      this.dispatcher.notifyOnBinding(bindingRecord, change.currentValue);
    } else {
      var directiveIndex = bindingRecord.directiveRecord.directiveIndex;
      bindingRecord.setter(this._getDirectiveFor(directiveIndex), change.currentValue);
    }
  }

  _addChange(bindingRecord: BindingRecord, change, changes) {
    if (bindingRecord.callOnChange()) {
      return ChangeDetectionUtil.addChange(changes, bindingRecord.propertyName, change);
    } else {
      return changes;
    }
  }

  _getDirectiveFor(directiveIndex) { return this.directives.getDirectiveFor(directiveIndex); }

  _getDetectorFor(directiveIndex) { return this.directives.getDetectorFor(directiveIndex); }

  _check(proto: ProtoRecord, throwOnChange: boolean): SimpleChange {
    try {
      if (proto.isPipeRecord()) {
        return this._pipeCheck(proto, throwOnChange);
      } else {
        return this._referenceCheck(proto, throwOnChange);
      }
    } catch (e) {
      throw new ChangeDetectionError(proto, e);
    }
  }

  _referenceCheck(proto: ProtoRecord, throwOnChange: boolean) {
    if (this._pureFuncAndArgsDidNotChange(proto)) {
      this._setChanged(proto, false);
      return null;
    }

    var prevValue = this._readSelf(proto);
    var currValue = this._calculateCurrValue(proto);

    if (!isSame(prevValue, currValue)) {
      if (proto.lastInBinding) {
        var change = ChangeDetectionUtil.simpleChange(prevValue, currValue);
        if (throwOnChange) ChangeDetectionUtil.throwOnChange(proto, change);

        this._writeSelf(proto, currValue);
        this._setChanged(proto, true);

        return change;

      } else {
        this._writeSelf(proto, currValue);
        this._setChanged(proto, true);
        return null;
      }
    } else {
      this._setChanged(proto, false);
      return null;
    }
  }

  _calculateCurrValue(proto: ProtoRecord) {
    switch (proto.mode) {
      case RECORD_TYPE_SELF:
        return this._readContext(proto);

      case RECORD_TYPE_CONST:
        return proto.funcOrValue;

      case RECORD_TYPE_PROPERTY:
        var context = this._readContext(proto);
        return proto.funcOrValue(context);

      case RECORD_TYPE_SAFE_PROPERTY:
        var context = this._readContext(proto);
        return isBlank(context) ? null : proto.funcOrValue(context);

      case RECORD_TYPE_LOCAL:
        return this.locals.get(proto.name);

      case RECORD_TYPE_INVOKE_METHOD:
        var context = this._readContext(proto);
        var args = this._readArgs(proto);
        return proto.funcOrValue(context, args);

      case RECORD_TYPE_SAFE_INVOKE_METHOD:
        var context = this._readContext(proto);
        if (isBlank(context)) {
          return null;
        }
        var args = this._readArgs(proto);
        return proto.funcOrValue(context, args);

      case RECORD_TYPE_KEYED_ACCESS:
        var arg = this._readArgs(proto)[0];
        return this._readContext(proto)[arg];

      case RECORD_TYPE_INVOKE_CLOSURE:
        return FunctionWrapper.apply(this._readContext(proto), this._readArgs(proto));

      case RECORD_TYPE_INTERPOLATE:
      case RECORD_TYPE_PRIMITIVE_OP:
        return FunctionWrapper.apply(proto.funcOrValue, this._readArgs(proto));

      default:
        throw new BaseException(`Unknown operation ${proto.mode}`);
    }
  }

  _pipeCheck(proto: ProtoRecord, throwOnChange: boolean) {
    var context = this._readContext(proto);
    var pipe = this._pipeFor(proto, context);
    var prevValue = this._readSelf(proto);

    var currValue = pipe.transform(context);

    if (!isSame(prevValue, currValue)) {
      currValue = ChangeDetectionUtil.unwrapValue(currValue);

      if (proto.lastInBinding) {
        var change = ChangeDetectionUtil.simpleChange(prevValue, currValue);
        if (throwOnChange) ChangeDetectionUtil.throwOnChange(proto, change);

        this._writeSelf(proto, currValue);
        this._setChanged(proto, true);

        return change;

      } else {
        this._writeSelf(proto, currValue);
        this._setChanged(proto, true);
        return null;
      }
    } else {
      this._setChanged(proto, false);
      return null;
    }
  }

  _pipeFor(proto: ProtoRecord, context) {
    var storedPipe = this._readPipe(proto);
    if (isPresent(storedPipe) && storedPipe.supports(context)) {
      return storedPipe;
    }
    if (isPresent(storedPipe)) {
      storedPipe.onDestroy();
    }

    // Currently, only pipes that used in bindings in the template get
    // the changeDetectorRef of the encompassing component.
    //
    // In the future, pipes declared in the bind configuration should
    // be able to access the changeDetectorRef of that component.
    var cdr = proto.mode === RECORD_TYPE_BINDING_PIPE ? this.ref : null;
    var pipe = this.pipeRegistry.get(proto.name, context, cdr);
    this._writePipe(proto, pipe);
    return pipe;
  }

  _readContext(proto: ProtoRecord) {
    if (proto.contextIndex == -1) {
      return this._getDirectiveFor(proto.directiveIndex);
    } else {
      return this.values[proto.contextIndex];
    }

    return this.values[proto.contextIndex];
  }

  _readSelf(proto: ProtoRecord) { return this.values[proto.selfIndex]; }

  _writeSelf(proto: ProtoRecord, value) { this.values[proto.selfIndex] = value; }

  _readPipe(proto: ProtoRecord) { return this.pipes[proto.selfIndex]; }

  _writePipe(proto: ProtoRecord, value) { this.pipes[proto.selfIndex] = value; }

  _setChanged(proto: ProtoRecord, value: boolean) { this.changes[proto.selfIndex] = value; }

  _pureFuncAndArgsDidNotChange(proto: ProtoRecord): boolean {
    return proto.isPureFunction() && !this._argsChanged(proto);
  }

  _argsChanged(proto: ProtoRecord): boolean {
    var args = proto.args;
    for (var i = 0; i < args.length; ++i) {
      if (this.changes[args[i]]) {
        return true;
      }
    }
    return false;
  }

  _readArgs(proto: ProtoRecord) {
    var res = ListWrapper.createFixedSize(proto.args.length);
    var args = proto.args;
    for (var i = 0; i < args.length; ++i) {
      res[i] = this.values[args[i]];
    }
    return res;
  }
}

function isSame(a, b) {
  if (a === b) return true;
  if (a instanceof String && b instanceof String && a == b) return true;
  if ((a !== a) && (b !== b)) return true;
  return false;
}
