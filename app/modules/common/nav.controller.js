(function(module){
	'use strict';

	function NavController($scope){
		$scope.title = 'Book Store';
	}

	NavController.$inject  = ['$scope'];

	module.controller('NavController', NavController);

	
})(angular.module('core'));
