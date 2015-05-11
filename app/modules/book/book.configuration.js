(function(module){
	'use strict';

	function configuration($routeProvider){
		$routeProvider
			.when('/', {
				controller:'BookController',
				controllerAs: 'vm',
				templateUrl: 'templates/main.html'
			})
			.when('/books', {
				controller:'BookController',
				controllerAs: 'vm',
				templateUrl: 'templates/main.html'
			})
			.when('/books/add', {
				controller:'BookController',
				controllerAs: 'vm',
				templateUrl: 'templates/addBook.html'
			})
			.when('/books/:bookID', {
				controller: 'BookDetailsController', // TODO: bookdetailscontroller
				controllerAs: 'vm',
				templateUrl: 'templates/bookDetails.html'
			});
	}	

	configuration.$inject = ['$routeProvider'];

	module.config(configuration);


})(angular.module('Bookstore'));