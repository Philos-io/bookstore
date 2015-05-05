(function(module){
	'use strict';

	function BookDetailsController($scope, $route, bookfactory){

		var bookID = $route.current.params.bookID;

		bookfactory.getBook(bookID).then(function(response){
			$scope.book = response.data;
		})
		.catch(function(err){
			console.log(err);
		});
	}

	BookDetailsController.$inject = ['$scope', '$route', 'bookfactory'];

	module.controller('BookDetailsController', BookDetailsController)


})(angular.module('Bookstore'));