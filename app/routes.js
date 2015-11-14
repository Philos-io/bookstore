import angular, {module} from 'angular';
import 'angular-route';

export default function routes($routeProvider, $compileProvider){

  $compileProvider.debugInfoEnabled(false);

  $routeProvider
      .when('/', {
        template: '<books></books>'
      })
      .when('/books', {
        template: '<books></books>'
      })
      .when('/books/add', {
        controller:'BookController',
        controllerAs: 'vm',
        templateUrl: 'templates/addBook.html'
      })
      .when('/books/:bookID', {
        controller: 'BookDetailsController',
        controllerAs: 'vm',
        templateUrl: 'templates/bookDetails.html'
      });

}

routes.$inject = ['$routeProvider', '$compileProvider'];

module('bookstore.routes', ['ngRoute']).config(routes);
