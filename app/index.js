import angular, {bootstrap, module} from 'angular';
import 'angular-route';

// Import core module
import './modules/core';
import './modules/book';
import './routes';

module('bookstore', ['bookstore.routes', 'core', 'book'])

bootstrap(document.body, ['bookstore']);
