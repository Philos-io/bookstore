(function(){
	'use strict';

	function getBooks(){
		return [
		    {
		      bookID: 09809,
		      author: 'Davy Mitchel',
		      title: 'Functional JavaScript',
		      description: 'Functional programming in JavaScript',
		      price: 29.99,
		      category: 'Programming language',
		      cover: 'images/javascript.jpg'
		    },
		    {
		      bookID: 09100,
		      author: 'Max Mitchel',
		      title: 'AngularJS: Up and Running',
		      description: 'Enhanced Productivity with Structured Web Apps',
		      price: 19.99,
		      category: 'Web Frameworks',
		      cover: 'images/angularjs.jpg'
		    },
		    {
		      bookID: 09353,
		      author: 'Jesse Cravens, Thomas Q Brady',
		      title: 'Building Web Apps with Ember.js',
		      description: "Build ambitious JavaScript App",
		      price: 9.99,
		      category: 'Web Frameworks',
		      cover: 'images/iot.jpg'
		    },
		    {
		      bookID: 09301,
		      author: 'Jesse Cravens, Thomas Q Brady',
		      title: 'Build',
		      description: "Build ambitious JavaScript App",
		      price: 9.99,
		      category: 'Web Frameworks',
		      cover: 'images/datavis.jpg'
		    },
		    {
		      bookID: 09380,
		      author: 'Jesse Cravens, Thomas Q Brady',
		      title: 'ES6: JavaScript Next',
		      description: "This book will cover ES6 entirely and will show you how to use ES6 today.",
		      price: 9.99,
		      category: 'Web Frameworks',
		      cover: 'images/es6.jpg'
		    },
		    {
		      bookID: 09333,
		      author: 'Jesse Cravens, Thomas Q Brady',
		      title: 'Ionic Framework: Building hybrid app',
		      description: "Build Hybrid apps using Angular, Ionic and deliver fast.",
		      price: 9.99,
		      category: 'Web Frameworks',
		      cover: 'images/ionic.jpg'
		    },
		    {
		      bookID: 09546,
		      author: 'Backstop Media, Rick Waldron',
		      title: 'Make: JavaScript Robotics',
		      description: 'Building NodeBots with Raspberry Pi, Arduino, and BeagleBone',
		      price: 9.99,
		      category: 'Robotic & Programming',
		      cover: 'images/robot.jpg'
		    }
		  ];
	}


	var bookstore = angular.module('bookstore', ['ngRoute']);

	bookstore	
		.controller('MainController', function($scope){
			$scope.books = getBooks();
		});

	bookstore
		.config(function($routeProvider){
			$routeProvider
				.when('/', {
					templateUrl: 'templates/main.html',
					controller: 'MainController'
				})
				$routeProvider
				.when('/addBook', {
					templateUrl: 'templates/addBook.html',
					controller: 'MainController'
				});

			console.log('running config');
		});
		
})();