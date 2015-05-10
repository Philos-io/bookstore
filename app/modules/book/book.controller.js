(function(module){
	'use strict';

	function BookController($location, $log, bookfactory){
		var vm = this;

		vm.addBook = function(){
			var book = {
				title: vm.book.title,
				cover: vm.book.selectedCover,
				author: vm.book.author,
				price: vm.book.price,
				description: vm.book.description
			};

			bookfactory.addBook(book)
			.then(function(response){
				vm.books = response.data;
				$location.path('/books');
			});
		};

		function init(){
			bookfactory.getAll().then(getBooks, error);

			vm.covers = bookfactory.getCovers();


			function getBooks(response){
				vm.books = response.data;
			}

			function error(){
				$log.error('something weird happened');
			}
		}

		// Init book controller
		init();
	}

	BookController.$inject = ['$location', '$log', 'bookfactory'];

	module.controller('BookController', BookController)

})(angular.module('Bookstore'));