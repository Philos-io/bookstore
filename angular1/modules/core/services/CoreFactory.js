import angular from 'angular';

export default class commonFactory {
		 getWatchers(root) {
		  let root = angular.element(root || document.documentElement);
		  let watcherCount = 0;

		  function getElemWatchers(element) {
		    let isolateWatchers = getWatchersFromScope(element.data().$isolateScope);
		    let scopeWatchers = getWatchersFromScope(element.data().$scope);
		    let watchers = scopeWatchers.concat(isolateWatchers);
		    angular.forEach(element.children(), function (childElement) {
		      watchers = watchers.concat(getElemWatchers(angular.element(childElement)));
		    });
		    return watchers;
		  }

		  function getWatchersFromScope(scope) {
		    if (scope) {
		      return scope.$$watchers || [];
		    } else {
		      return [];
		    }
		  }
		  return getElemWatchers(root);
		}
	}

