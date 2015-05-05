(function(module){
	'use strict';

	function BookController($scope, bookfactory){

		bookfactory.getAll().then(function(response){
			$scope.books = response.data;
		})
		.catch(function(err){
			console.log(err);
		});
	}

	BookController.$inject = ['$scope', 'bookfactory'];

	module.controller('BookController', BookController)


})(angular.module('Bookstore'));