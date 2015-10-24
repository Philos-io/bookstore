export default function configuration($routeProvider, $compileProvider, $stateProvider){
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
    controller: 'BookDetailsController',
    controllerAs: 'vm',
    templateUrl: 'templates/bookDetails.html'
  });
}
configuration.$inject = ['$routeProvider', '$compileProvider'];

