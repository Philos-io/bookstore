import angular, {bootstrap, module} from 'angular';

// Import core module
import './modules/core';
import './modules/book';

module('bookstore', ['core', 'book']);

bootstrap(document.body, ['bookstore']);
