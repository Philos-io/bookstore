import angular , {module} from 'angular';
import 'angular-route';
import 'angular-toastr';


import BookController from './controllers/BookController';
import BookDetailsController from './controllers/BookDetailsController';
import routes from './config/routes.js';
import bookDirective from './directives/book';
import bookStoreDirective from './directives/bookStore';
import BookFactory from './services/BookService';

module('book', ['ngRoute', 'toastr'])
  .config(routes)
  .controller('BookController', BookController)
  .controller('BookDetailsController', BookDetailsController)
  .directive('bsBook', bookDirective)
  .directive('bsBookStore', bookStoreDirective)
  .factory('bookFactory', BookFactory);
