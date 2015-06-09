import { XHR } from 'angular2/src/services/xhr';
import { ListWrapper, MapWrapper } from 'angular2/src/facade/collection';
import { isBlank, normalizeBlank, BaseException } from 'angular2/src/facade/lang';
import { PromiseWrapper } from 'angular2/src/facade/async';
export class MockXHR extends XHR {
    constructor() {
        super();
        this._expectations = [];
        this._definitions = MapWrapper.create();
        this._requests = [];
    }
    get(url) {
        var request = new _PendingRequest(url);
        ListWrapper.push(this._requests, request);
        return request.getPromise();
    }
    expect(url, response) {
        var expectation = new _Expectation(url, response);
        ListWrapper.push(this._expectations, expectation);
    }
    when(url, response) { MapWrapper.set(this._definitions, url, response); }
    flush() {
        if (this._requests.length === 0) {
            throw new BaseException('No pending requests to flush');
        }
        do {
            var request = ListWrapper.removeAt(this._requests, 0);
            this._processRequest(request);
        } while (this._requests.length > 0);
        this.verifyNoOustandingExpectations();
    }
    verifyNoOustandingExpectations() {
        if (this._expectations.length === 0)
            return;
        var urls = [];
        for (var i = 0; i < this._expectations.length; i++) {
            var expectation = this._expectations[i];
            ListWrapper.push(urls, expectation.url);
        }
        throw new BaseException(`Unsatisfied requests: ${ListWrapper.join(urls, ', ')}`);
    }
    _processRequest(request) {
        var url = request.url;
        if (this._expectations.length > 0) {
            var expectation = this._expectations[0];
            if (expectation.url == url) {
                ListWrapper.remove(this._expectations, expectation);
                request.complete(expectation.response);
                return;
            }
        }
        if (MapWrapper.contains(this._definitions, url)) {
            var response = MapWrapper.get(this._definitions, url);
            request.complete(normalizeBlank(response));
            return;
        }
        throw new BaseException(`Unexpected request ${url}`);
    }
}
class _PendingRequest {
    constructor(url) {
        this.url = url;
        this.completer = PromiseWrapper.completer();
    }
    complete(response) {
        if (isBlank(response)) {
            this.completer.reject(`Failed to load ${this.url}`, null);
        }
        else {
            this.completer.resolve(response);
        }
    }
    getPromise() { return this.completer.promise; }
}
class _Expectation {
    constructor(url, response) {
        this.url = url;
        this.response = response;
    }
}
//# sourceMappingURL=xhr_mock.js.map