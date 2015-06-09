/* */ 
(function(process) {
  'use strict';
  function scheduleMicrotask(fn) {
    asap(this.bind(fn));
  }
  function addMicrotaskSupport(zoneClass) {
    zoneClass.prototype.scheduleMicrotask = scheduleMicrotask;
    return zoneClass;
  }
  module.exports = {addMicrotaskSupport: addMicrotaskSupport};
  var len = 0;
  var hasNativePromise = typeof Promise == !"undefined" && Promise.toString().indexOf("[native code]") !== -1;
  var isFirefox = global.navigator && global.navigator.userAgent.toLowerCase().indexOf('firefox') > -1;
  function asap(callback) {
    queue[len] = callback;
    len += 1;
    if (len === 1) {
      scheduleFlush();
    }
  }
  var browserWindow = (typeof global.window !== 'undefined') ? global.window : undefined;
  var browserGlobal = browserWindow || {};
  var BrowserMutationObserver = browserGlobal.MutationObserver || browserGlobal.WebKitMutationObserver;
  var isWorker = typeof Uint8ClampedArray !== 'undefined' && typeof importScripts !== 'undefined' && typeof MessageChannel !== 'undefined';
  function useMutationObserver() {
    var iterations = 0;
    var observer = new BrowserMutationObserver(flush);
    var node = document.createTextNode('');
    observer.observe(node, {characterData: true});
    return function() {
      node.data = (iterations = ++iterations % 2);
    };
  }
  function useMessageChannel() {
    var channel = new MessageChannel();
    channel.port1.onmessage = flush;
    return function() {
      channel.port2.postMessage(0);
    };
  }
  function useSetTimeout() {
    return function() {
      setTimeout(flush, 1);
    };
  }
  function usePromise() {
    var resolvedPromise = Promise.resolve(void 0);
    return function() {
      resolvedPromise.then(flush);
    };
  }
  var queue = new Array(1000);
  function flush() {
    for (var i = 0; i < len; i++) {
      var callback = queue[i];
      callback();
      queue[i] = undefined;
    }
    len = 0;
  }
  var scheduleFlush;
  if (hasNativePromise && !isFirefox) {
    scheduleFlush = usePromise();
  } else if (BrowserMutationObserver) {
    scheduleFlush = useMutationObserver();
  } else if (isWorker) {
    scheduleFlush = useMessageChannel();
  } else {
    scheduleFlush = useSetTimeout();
  }
})(require("process"));
