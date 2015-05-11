(function(module){
	'use strict';

	function bookStore(){
		return {
			restrict: 'C',
			templateUrl: 'templates/bookstore.html'
		};
	}

	bookStore.$inject = [];
	
	module
		.directive('bookStore', bookStore);

})(angular.module('Bookstore'));