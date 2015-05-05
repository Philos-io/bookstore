(function(module){
	'use strict';

	function configuration($routeProvider){
		$routeProvider
			.when('/', {
				controller:'BookController',
				templateUrl: 'templates/main.html'
			})
			.when('/books', {
				controller:'BookController',
				templateUrl: 'templates/main.html'
			})
			.when('/books/add', {
				controller:'BookController',
				templateUrl: 'templates/addBook.html'
			})
			.when('/books/:bookID', {
				controller: 'BookDetailsController', // TODO: bookdetailscontroller
				templateUrl: 'templates/bookDetails.html'
			})
			.otherwise('/');
	}	

	configuration.$inject = ['$routeProvider'];

	module.config(configuration);


})(angular.module('Bookstore'));