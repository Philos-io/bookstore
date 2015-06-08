(function(module){
	'use strict';

	function bsBook(){
		return {
			restrict: 'E',
			scope: {
				model: '='
			},
			templateUrl: 'templates/book.html'
		};
	}

	bsBook.$inject = [];
	
	module
		.directive('bsBook', bsBook);

})(angular.module('Bookstore'));