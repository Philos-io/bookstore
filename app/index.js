import angular, {bootstrap, module} from 'angular';

// Import core module
import './modules/core';
import './modules/book';
import './modules/routes';

module('bookstore', ['bookstore.routes', 'bookstore.core', 'bookstore.book'])

bootstrap(document.body, ['bookstore']);
