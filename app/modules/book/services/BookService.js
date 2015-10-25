export default function BookFactory($q, $http, Config){

  return {
    getAll(forced){
      forced = forced  || false;
      return $http.get(Config.BooksUrl, {cache: forced});
    },

    getCovers(){
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
    },

    getCategories(){
      let defer = $q.defer();

      getAll().then(success, error);

      function success(response){
        let books = response.data;
        let categories = books.map(function(book){
          return book.category;
        });

        defer.resolve(categories);
      }

      function error(err){
        defer.reject({message: Config.Errors.NoCategory});
      }
      return defer.promise;
    },

    getBook(bookId){
      let url = Config.BooksUrl + '/' + bookId;
      return $http.get(url);
    },

    addBook(book){
      return $http.post(Config.AddBookUrl, book);
    }
  }
}

BookFactory.$inject = ['$q', '$http', 'Config'];
