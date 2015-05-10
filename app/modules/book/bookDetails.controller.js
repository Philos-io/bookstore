(function(module){
	'use strict';

	function BookDetailsController($route, $log, bookfactory){

		var vm = this;

		function init(){
			var bookID = $route.current.params.bookID;

			bookfactory.getBook(bookID).then(getBook);

			bookfactory.getCategories().then(getCategories);


			function getBook(response){
				vm.book = response.data;
			}

			function getCategories(categories){
				$log.info(categories);
				vm.categories = categories;
			}

			function error(){
				$log.error('something weird happened');
			}
		}

		// Init the book details controller
		init();
	}

	BookDetailsController.$inject = ['$route', '$log', 'bookfactory'];

	module.controller('BookDetailsController', BookDetailsController)


})(angular.module('Bookstore'));