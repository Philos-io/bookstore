(function(module){
	'use strict';

	function bsFooter(){
		return {
			restrict: 'E',
			templateUrl: 'templates/footer.html'
		};
	}

	bsFooter.$inject = [];

	module.directive('bsFooter', bsFooter);

})(angular.module('core'));
