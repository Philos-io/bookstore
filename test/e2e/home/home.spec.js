var HomePage = require('./homePage');

describe('BookStore Application', function() {
  var url = 'http://localhost:8080/#/';
  var homePage = new HomePage();

  beforeEach(function(){
    browser.get(url);
  });

  it('should have a title', function() {
    expect(browser.getTitle()).toEqual('Bookstore by Philos');
  });

  it('should do a search on book', function(){
    homePage.searchFor('data');
    browser.debugger();

    expect(homePage.books.count()).toEqual(1);
    browser.sleep(2000);

    // Empty our search input as a user would do
    browser.refresh();

    homePage.searchFor('JavaScript');
    expect(homePage.books.count()).toEqual(5);
    browser.sleep(2000);
  });

  it('It should navigate to another page after clicking on the button', function(){
    homePage.addNewBook();
    browser.waitForAngular();
    expect(browser.getCurrentUrl()).toMatch('http://localhost:8080/#/books/add');
    browser.sleep(3000);
    browser.navigation.back();
    browser.sleep(3000);
  });

});
