(function(module){
	'use strict';

	function BookDetailsController($route, bookfactory){

		var bookID = $route.current.params.bookID, vm = this;

		bookfactory.getBook(bookID).then(function(response){
			vm.book = response.data;
		})
		.catch(function(err){
			console.log(err);
		});
	}

	BookDetailsController.$inject = ['$route', 'bookfactory'];

	module.controller('BookDetailsController', BookDetailsController)


})(angular.module('Bookstore'));