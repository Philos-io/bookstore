(function(module){
	'use strict';

	function CommonController($scope){
		$scope.app = 'Book Store';
	}
	
	CommonController.$inject = ['$scope'];
	
	module.controller('CommonController', CommonController)


})(angular.module('core'));