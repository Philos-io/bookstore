(function(module){
  'strict';

  function bookfactory($q, $http){

    function getAllFromServer(){
      return $http.get('http://localhost:9000/api/books');
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
      var url = 'http://localhost:9000/api/books/' + bookId;   
      return $http.get(url);
    }


    return {
      getAll: getAllFromServer,
      getCovers: covers
    };
  }

  bookfactory.$inject = ['$q', '$http'];

  module.factory('bookfactory', bookfactory);

})(angular.module('Bookstore'));
