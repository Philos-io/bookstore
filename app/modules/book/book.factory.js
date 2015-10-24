(function(module){
  'strict';

  function bookfactory($q, $http, Config){

    function getAllFromServer(forced){
      forced = forced  || false;
      return $http.get(Config.BooksUrl, {cache: forced});
    }

    function covers(){
      return [
        'images/angularjs.jpg', 
        'images/coman.jpeg', 
        'images/datavis.jpg', 
        'images/designpattern.jpg', 
        'images/emberjs.jpg', 
        'images/ionic.jpg', 
        'images/es6.jpg', 
        'images/iot.jpg'
      ];
    }

    function getAll(){
      var defer = $q.defer();

      var config = {

      };

      config.data = getBooks();

      if (!books) {
        defer.resolve(config);
      }else{
        defer.reject({message:"things are broken!!"});
      }

      return defer.promise;
    }

    function getCategories(){
      var defer = $q.defer();

      getAllFromServer().then(success, error);

      function success(response){
        var books = response.data;
        var categories = books.map(function(book){
          return book.category;
        });

        defer.resolve(categories);
      }

      function error(err){
        defer.reject({message: Config.Errors.NoCategory});
      }

      return defer.promise;
    }

    function getBook(bookId){
      var url = Config.BooksUrl + '/' + bookId;   
      return $http.get(url);
    }

    function addBook(book){
      return $http.post(Config.AddBookUrl, book);
    }
    
    this.getAll = getAllFromServer;
    this.getBook = getBook;
    this.getCovers = covers;
    this.addBook = addBook;
    this.getCategories = getCategories;
  }

  bookfactory.$inject = ['$q', '$http', 'Config'];

  // module.factory('bookfactory', bookfactory);

  module.service('bookfactory', bookfactory);

})(angular.module('Bookstore'));
