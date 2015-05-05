(function(module){
	'use strict';

	function CommonController($scope, commonFactory){
		$scope.app = 'Book Store';

		$scope.watchers = commonFactory.getWatchers().length;
		window.watchers = commonFactory.getWatchers;
	}
	
	CommonController.$inject = ['$scope', 'commonFactory'];
	
	module.controller('CommonController', CommonController)


})(angular.module('core'));