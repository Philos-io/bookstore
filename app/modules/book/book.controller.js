(function(module){
	'use strict';

	function BookController($location, $log, $timeout, bookfactory, toaster){
		var vm = this;

		vm.pop = function(args){
        	toaster.pop(args.type, '', args.message);
	    };

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

				var options = {
					type: 'success',
					title: 'Add Book',
					message: 'New Book Added with success'
				};
				vm.pop(options);

				$timeout(function(){
					$location.path('/books');
				}, 3000);
					
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

	BookController.$inject = ['$location', '$log', '$timeout', 'bookfactory', 'toaster'];

	module.controller('BookController', BookController)

})(angular.module('Bookstore'));