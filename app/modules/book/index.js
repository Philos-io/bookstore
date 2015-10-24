import angular , {module} from 'angular';

import BookController from './controllers/BookController';
import BookDetailsController from './controllers/BookDetailsController';
import routes from './config/routes.js';
import bookDirective from './directives/book';
import bookStoreDirective from './directives/bookStore';

module('book', [])
  .config(routes)
  .controller('BookController', BookController)
  .controller('BookDetailsController', BookDetailsController)
  .directive('bsBook', bookDirective)
  .directive('bsBookStore', bookStoreDirective);
