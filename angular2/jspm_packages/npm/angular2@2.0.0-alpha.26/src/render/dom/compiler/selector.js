/* */ 
(function(process) {
  var collection_1 = require("../../../facade/collection");
  var lang_1 = require("../../../facade/lang");
  var _EMPTY_ATTR_VALUE = '';
  var _SELECTOR_REGEXP = lang_1.RegExpWrapper.create('(\\:not\\()|' + '([-\\w]+)|' + '(?:\\.([-\\w]+))|' + '(?:\\[([-\\w*]+)(?:=([^\\]]*))?\\])|' + '(\\))|' + '(\\s*,\\s*)');
  var CssSelector = (function() {
    function CssSelector() {
      this.element = null;
      this.classNames = collection_1.ListWrapper.create();
      this.attrs = collection_1.ListWrapper.create();
      this.notSelectors = collection_1.ListWrapper.create();
    }
    CssSelector.parse = function(selector) {
      var results = collection_1.ListWrapper.create();
      var _addResult = function(res, cssSel) {
        if (cssSel.notSelectors.length > 0 && lang_1.isBlank(cssSel.element) && collection_1.ListWrapper.isEmpty(cssSel.classNames) && collection_1.ListWrapper.isEmpty(cssSel.attrs)) {
          cssSel.element = "*";
        }
        collection_1.ListWrapper.push(res, cssSel);
      };
      var cssSelector = new CssSelector();
      var matcher = lang_1.RegExpWrapper.matcher(_SELECTOR_REGEXP, selector);
      var match;
      var current = cssSelector;
      var inNot = false;
      while (lang_1.isPresent(match = lang_1.RegExpMatcherWrapper.next(matcher))) {
        if (lang_1.isPresent(match[1])) {
          if (inNot) {
            throw new lang_1.BaseException('Nesting :not is not allowed in a selector');
          }
          inNot = true;
          current = new CssSelector();
          collection_1.ListWrapper.push(cssSelector.notSelectors, current);
        }
        if (lang_1.isPresent(match[2])) {
          current.setElement(match[2]);
        }
        if (lang_1.isPresent(match[3])) {
          current.addClassName(match[3]);
        }
        if (lang_1.isPresent(match[4])) {
          current.addAttribute(match[4], match[5]);
        }
        if (lang_1.isPresent(match[6])) {
          inNot = false;
          current = cssSelector;
        }
        if (lang_1.isPresent(match[7])) {
          if (inNot) {
            throw new lang_1.BaseException('Multiple selectors in :not are not supported');
          }
          _addResult(results, cssSelector);
          cssSelector = current = new CssSelector();
        }
      }
      _addResult(results, cssSelector);
      return results;
    };
    CssSelector.prototype.isElementSelector = function() {
      return lang_1.isPresent(this.element) && collection_1.ListWrapper.isEmpty(this.classNames) && collection_1.ListWrapper.isEmpty(this.attrs) && this.notSelectors.length === 0;
    };
    CssSelector.prototype.setElement = function(element) {
      if (element === void 0) {
        element = null;
      }
      if (lang_1.isPresent(element)) {
        element = element.toLowerCase();
      }
      this.element = element;
    };
    CssSelector.prototype.addAttribute = function(name, value) {
      if (value === void 0) {
        value = _EMPTY_ATTR_VALUE;
      }
      collection_1.ListWrapper.push(this.attrs, name.toLowerCase());
      if (lang_1.isPresent(value)) {
        value = value.toLowerCase();
      } else {
        value = _EMPTY_ATTR_VALUE;
      }
      collection_1.ListWrapper.push(this.attrs, value);
    };
    CssSelector.prototype.addClassName = function(name) {
      collection_1.ListWrapper.push(this.classNames, name.toLowerCase());
    };
    CssSelector.prototype.toString = function() {
      var res = '';
      if (lang_1.isPresent(this.element)) {
        res += this.element;
      }
      if (lang_1.isPresent(this.classNames)) {
        for (var i = 0; i < this.classNames.length; i++) {
          res += '.' + this.classNames[i];
        }
      }
      if (lang_1.isPresent(this.attrs)) {
        for (var i = 0; i < this.attrs.length; ) {
          var attrName = this.attrs[i++];
          var attrValue = this.attrs[i++];
          res += '[' + attrName;
          if (attrValue.length > 0) {
            res += '=' + attrValue;
          }
          res += ']';
        }
      }
      collection_1.ListWrapper.forEach(this.notSelectors, function(notSelector) {
        res += ":not(" + notSelector.toString() + ")";
      });
      return res;
    };
    return CssSelector;
  })();
  exports.CssSelector = CssSelector;
  var SelectorMatcher = (function() {
    function SelectorMatcher() {
      this._elementMap = collection_1.MapWrapper.create();
      this._elementPartialMap = collection_1.MapWrapper.create();
      this._classMap = collection_1.MapWrapper.create();
      this._classPartialMap = collection_1.MapWrapper.create();
      this._attrValueMap = collection_1.MapWrapper.create();
      this._attrValuePartialMap = collection_1.MapWrapper.create();
      this._listContexts = collection_1.ListWrapper.create();
    }
    SelectorMatcher.createNotMatcher = function(notSelectors) {
      var notMatcher = new SelectorMatcher();
      notMatcher.addSelectables(notSelectors, null);
      return notMatcher;
    };
    SelectorMatcher.prototype.addSelectables = function(cssSelectors, callbackCtxt) {
      var listContext = null;
      if (cssSelectors.length > 1) {
        listContext = new SelectorListContext(cssSelectors);
        collection_1.ListWrapper.push(this._listContexts, listContext);
      }
      for (var i = 0; i < cssSelectors.length; i++) {
        this._addSelectable(cssSelectors[i], callbackCtxt, listContext);
      }
    };
    SelectorMatcher.prototype._addSelectable = function(cssSelector, callbackCtxt, listContext) {
      var matcher = this;
      var element = cssSelector.element;
      var classNames = cssSelector.classNames;
      var attrs = cssSelector.attrs;
      var selectable = new SelectorContext(cssSelector, callbackCtxt, listContext);
      if (lang_1.isPresent(element)) {
        var isTerminal = attrs.length === 0 && classNames.length === 0;
        if (isTerminal) {
          this._addTerminal(matcher._elementMap, element, selectable);
        } else {
          matcher = this._addPartial(matcher._elementPartialMap, element);
        }
      }
      if (lang_1.isPresent(classNames)) {
        for (var index = 0; index < classNames.length; index++) {
          var isTerminal = attrs.length === 0 && index === classNames.length - 1;
          var className = classNames[index];
          if (isTerminal) {
            this._addTerminal(matcher._classMap, className, selectable);
          } else {
            matcher = this._addPartial(matcher._classPartialMap, className);
          }
        }
      }
      if (lang_1.isPresent(attrs)) {
        for (var index = 0; index < attrs.length; ) {
          var isTerminal = index === attrs.length - 2;
          var attrName = attrs[index++];
          var attrValue = attrs[index++];
          if (isTerminal) {
            var terminalMap = matcher._attrValueMap;
            var terminalValuesMap = collection_1.MapWrapper.get(terminalMap, attrName);
            if (lang_1.isBlank(terminalValuesMap)) {
              terminalValuesMap = collection_1.MapWrapper.create();
              collection_1.MapWrapper.set(terminalMap, attrName, terminalValuesMap);
            }
            this._addTerminal(terminalValuesMap, attrValue, selectable);
          } else {
            var parttialMap = matcher._attrValuePartialMap;
            var partialValuesMap = collection_1.MapWrapper.get(parttialMap, attrName);
            if (lang_1.isBlank(partialValuesMap)) {
              partialValuesMap = collection_1.MapWrapper.create();
              collection_1.MapWrapper.set(parttialMap, attrName, partialValuesMap);
            }
            matcher = this._addPartial(partialValuesMap, attrValue);
          }
        }
      }
    };
    SelectorMatcher.prototype._addTerminal = function(map, name, selectable) {
      var terminalList = collection_1.MapWrapper.get(map, name);
      if (lang_1.isBlank(terminalList)) {
        terminalList = collection_1.ListWrapper.create();
        collection_1.MapWrapper.set(map, name, terminalList);
      }
      collection_1.ListWrapper.push(terminalList, selectable);
    };
    SelectorMatcher.prototype._addPartial = function(map, name) {
      var matcher = collection_1.MapWrapper.get(map, name);
      if (lang_1.isBlank(matcher)) {
        matcher = new SelectorMatcher();
        collection_1.MapWrapper.set(map, name, matcher);
      }
      return matcher;
    };
    SelectorMatcher.prototype.match = function(cssSelector, matchedCallback) {
      var result = false;
      var element = cssSelector.element;
      var classNames = cssSelector.classNames;
      var attrs = cssSelector.attrs;
      for (var i = 0; i < this._listContexts.length; i++) {
        this._listContexts[i].alreadyMatched = false;
      }
      result = this._matchTerminal(this._elementMap, element, cssSelector, matchedCallback) || result;
      result = this._matchPartial(this._elementPartialMap, element, cssSelector, matchedCallback) || result;
      if (lang_1.isPresent(classNames)) {
        for (var index = 0; index < classNames.length; index++) {
          var className = classNames[index];
          result = this._matchTerminal(this._classMap, className, cssSelector, matchedCallback) || result;
          result = this._matchPartial(this._classPartialMap, className, cssSelector, matchedCallback) || result;
        }
      }
      if (lang_1.isPresent(attrs)) {
        for (var index = 0; index < attrs.length; ) {
          var attrName = attrs[index++];
          var attrValue = attrs[index++];
          var terminalValuesMap = collection_1.MapWrapper.get(this._attrValueMap, attrName);
          if (!lang_1.StringWrapper.equals(attrValue, _EMPTY_ATTR_VALUE)) {
            result = this._matchTerminal(terminalValuesMap, _EMPTY_ATTR_VALUE, cssSelector, matchedCallback) || result;
          }
          result = this._matchTerminal(terminalValuesMap, attrValue, cssSelector, matchedCallback) || result;
          var partialValuesMap = collection_1.MapWrapper.get(this._attrValuePartialMap, attrName);
          result = this._matchPartial(partialValuesMap, attrValue, cssSelector, matchedCallback) || result;
        }
      }
      return result;
    };
    SelectorMatcher.prototype._matchTerminal = function(map, name, cssSelector, matchedCallback) {
      if (lang_1.isBlank(map) || lang_1.isBlank(name)) {
        return false;
      }
      var selectables = collection_1.MapWrapper.get(map, name);
      var starSelectables = collection_1.MapWrapper.get(map, "*");
      if (lang_1.isPresent(starSelectables)) {
        selectables = collection_1.ListWrapper.concat(selectables, starSelectables);
      }
      if (lang_1.isBlank(selectables)) {
        return false;
      }
      var selectable;
      var result = false;
      for (var index = 0; index < selectables.length; index++) {
        selectable = selectables[index];
        result = selectable.finalize(cssSelector, matchedCallback) || result;
      }
      return result;
    };
    SelectorMatcher.prototype._matchPartial = function(map, name, cssSelector, matchedCallback) {
      if (lang_1.isBlank(map) || lang_1.isBlank(name)) {
        return false;
      }
      var nestedSelector = collection_1.MapWrapper.get(map, name);
      if (lang_1.isBlank(nestedSelector)) {
        return false;
      }
      return nestedSelector.match(cssSelector, matchedCallback);
    };
    return SelectorMatcher;
  })();
  exports.SelectorMatcher = SelectorMatcher;
  var SelectorListContext = (function() {
    function SelectorListContext(selectors) {
      this.selectors = selectors;
      this.alreadyMatched = false;
    }
    return SelectorListContext;
  })();
  var SelectorContext = (function() {
    function SelectorContext(selector, cbContext, listContext) {
      this.selector = selector;
      this.notSelectors = selector.notSelectors;
      this.cbContext = cbContext;
      this.listContext = listContext;
    }
    SelectorContext.prototype.finalize = function(cssSelector, callback) {
      var result = true;
      if (this.notSelectors.length > 0 && (lang_1.isBlank(this.listContext) || !this.listContext.alreadyMatched)) {
        var notMatcher = SelectorMatcher.createNotMatcher(this.notSelectors);
        result = !notMatcher.match(cssSelector, null);
      }
      if (result && lang_1.isPresent(callback) && (lang_1.isBlank(this.listContext) || !this.listContext.alreadyMatched)) {
        if (lang_1.isPresent(this.listContext)) {
          this.listContext.alreadyMatched = true;
        }
        callback(this.selector, this.cbContext);
      }
      return result;
    };
    return SelectorContext;
  })();
  exports.__esModule = true;
})(require("process"));
