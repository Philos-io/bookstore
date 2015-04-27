angular.module('bookstore', ['ngRoute', 'ngAnimate']);

function Address(args){
	this.street = args.street;
	this.zipCode = args.zipCode;
	this.country = args.country;
}


function Person(args){
	this.address = new Address(args);
	this.name = args.name;
	this.age = args.age;
}

var person  = new Person({});


function Person(args){
	this.address = args.address; //
	this.name = args.name;
	this.age = args.age;
}

var person = new Person({});

