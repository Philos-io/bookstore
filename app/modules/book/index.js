import angular , {module} from 'angular';
import 'angular-toastr';

import BookController from './controllers/BookController';
import BookDetailsController from './controllers/BookDetailsController';
import bookComponent from './directives/book';
import booksComponent from './directives/books';
import BookFactory from './services/BookService';

module('book', ['toastr'])
  .controller('BookController', BookController)
  .controller('BookDetailsController', BookDetailsController)
  .directive('books', booksComponent)
  .directive('bsBook', bookComponent)
  .factory('bookFactory', BookFactory);
