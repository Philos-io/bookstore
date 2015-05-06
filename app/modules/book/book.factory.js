(function(module){
  'strict';

  function bookfactory($q, $http, Config){

    function getAllFromServer(){
      return $http.get(Config.BooksUrl, {cache: true});
    }

    function covers(){
      return [
        'images/angularjs.jpg', 
        'images/coman.jpeg', 
        'datavis.jpg', 
        'designpattern.jpg', 
        'emberjs.jpg', 
        'ionic.jpg', 
        'es6.jpg', 
        'iot.jpg'
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

    function getBook(bookId){
      var url = Config.BooksUrl + '/' + bookId;   
      return $http.get(url, {cache: true});
    }
    
    this.getAll = getAllFromServer;
    this.getBook = getBook;
    this.getCovers = covers;
  }

  bookfactory.$inject = ['$q', '$http', 'Config'];

  // module.factory('bookfactory', bookfactory);

  module.service('bookfactory', bookfactory);

})(angular.module('Bookstore'));
