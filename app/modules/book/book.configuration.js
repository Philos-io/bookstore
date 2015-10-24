(function(module){
	'use strict';

	function configuration($routeProvider, $compileProvider, $stateProvider){

		// $stateProvider
		// 	.state('home', {
		// 		url: '/',
		// 		controller:'BookController',
		// 		controllerAs: 'vm',
		// 		templateUrl: 'templates/main.html'
		// 	})
		// 	.state('books', {
		// 		// abstract: true,
		// 		url: "/books", 
		// 		controller:'BookController',
		// 		controllerAs: 'vm',
		// 		templateUrl: 'templates/main.html'
		// 	})
		// 	.state('books.add', {
		// 		url:'/add',
		// 		controller:'BookController',
		// 		controllerAs: 'vm',
		// 		templateUrl: 'templates/addBook.html'
		// 	})
		// 	.state('books.details', {
		// 		url:'/details/:bookID',
		// 		controller: 'BookDetailsController', // TODO: bookdetailscontroller
		// 		controllerAs: 'vm',
		// 		templateUrl: 'templates/bookDetails.html'
		// 	});
    //

		$compileProvider.debugInfoEnabled(false);
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

	configuration.$inject = ['$routeProvider', '$compileProvider'];

	module.config(configuration);

})(angular.module('Bookstore'));
