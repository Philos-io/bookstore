(function(module){
	'use strict';

	// TODO: Refactor this application in modules

	function NavController($scope){
		// TODO: Refactor this to use Constant Service instead of boring string...
		$scope.title = 'Book Store';
	}

	// TODO: Use the $log service to log activities of your application
	function BookController($scope, bookfactory){
		bookfactory.getAll().then(function(response){
			$scope.books = response;
		})
		.catch(function(err){
			// TODO: Log information using the $log service
			console.log(err);
		});
	}

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
				templateUrl: 'template/addBook.html'
			})
			.when('/books/:bookID', {
				controller: 'BookDetailsController', // TODO: bookdetailscontroller
				templateUrl: 'template/bookDetails.html'
			})
			.otherwise('/');
	}


	NavController.$inject  = ['$scope'];

	BookController.$inject = ['$scope', 'bookfactory'];

	configuration.$inject = ['$routeProvider'];

	module
		.controller('NavController', NavController)

		.controller('BookController', BookController)

		.config(configuration);

})(angular.module('Bookstore', ['ngRoute']));
