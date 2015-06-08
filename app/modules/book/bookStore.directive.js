(function(module){
	'use strict';

	function bookStore(){
		return {
			restrict: 'E',
			templateUrl: 'templates/bookstore.html',
			link: function(scope, element, attrs){
				
			}
		};
	}

	bookStore.$inject = [];
	
	module
		.directive('bookStore', bookStore);

})(angular.module('Bookstore'));