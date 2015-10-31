(function(module){
	'use strict';

	function bsHeader(){
		return {
			restrict: 'E',
			templateUrl: 'templates/header.html'
		};
	}

	bsHeader.$inject = [];

	module.directive('bsHeader', bsHeader);

})(angular.module('core'));
