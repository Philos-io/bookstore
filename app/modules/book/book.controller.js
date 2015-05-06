(function(module){
	'use strict';

	function BookController(bookfactory){

		var vm = this;
		
		bookfactory.getAll().then(function(response){
			vm.books = response.data;
		})
		.catch(function(err){
			console.log(err);
		});

		vm.covers = bookfactory.getCovers();
	}

	BookController.$inject = ['bookfactory'];

	module.controller('BookController', BookController)


})(angular.module('Bookstore'));