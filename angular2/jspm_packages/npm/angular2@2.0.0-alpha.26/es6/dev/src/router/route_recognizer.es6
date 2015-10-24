import { RegExpWrapper, StringWrapper, isPresent, BaseException } from 'angular2/src/facade/lang';
import { MapWrapper, ListWrapper } from 'angular2/src/facade/collection';
import { PathRecognizer } from './path_recognizer';
/**
 * `RouteRecognizer` is responsible for recognizing routes for a single component.
 * It is consumed by `RouteRegistry`, which knows how to recognize an entire hierarchy of
 * components.
 */
export class RouteRecognizer {
    constructor() {
        this.names = MapWrapper.create();
        this.matchers = MapWrapper.create();
        this.redirects = MapWrapper.create();
    }
    addRedirect(path, target) { MapWrapper.set(this.redirects, path, target); }
    addConfig(path, handler, alias = null) {
        var recognizer = new PathRecognizer(path, handler);
        MapWrapper.forEach(this.matchers, (matcher, _) => {
            if (recognizer.regex.toString() == matcher.regex.toString()) {
                throw new BaseException(`Configuration '${path}' conflicts with existing route '${matcher.path}'`);
            }
        });
        MapWrapper.set(this.matchers, recognizer.regex, recognizer);
        if (isPresent(alias)) {
            MapWrapper.set(this.names, alias, recognizer);
        }
    }
    /**
     * Given a URL, returns a list of `RouteMatch`es, which are partial recognitions for some route.
     *
     */
    recognize(url) {
        var solutions = ListWrapper.create();
        MapWrapper.forEach(this.redirects, (target, path) => {
            // TODO: "/" redirect case
            if (StringWrapper.startsWith(url, path)) {
                url = target + StringWrapper.substring(url, path.length);
            }
        });
        MapWrapper.forEach(this.matchers, (pathRecognizer, regex) => {
            var match;
            if (isPresent(match = RegExpWrapper.firstMatch(regex, url))) {
                // TODO(btford): determine a good generic way to deal with terminal matches
                var matchedUrl = '/';
                var unmatchedUrl = '';
                if (url != '/') {
                    matchedUrl = match[0];
                    unmatchedUrl = StringWrapper.substring(url, match[0].length);
                }
                ListWrapper.push(solutions, new RouteMatch({
                    specificity: pathRecognizer.specificity,
                    handler: pathRecognizer.handler,
                    params: pathRecognizer.parseParams(url),
                    matchedUrl: matchedUrl,
                    unmatchedUrl: unmatchedUrl
                }));
            }
        });
        return solutions;
    }
    hasRoute(name) { return MapWrapper.contains(this.names, name); }
    generate(name, params) {
        var pathRecognizer = MapWrapper.get(this.names, name);
        return isPresent(pathRecognizer) ? pathRecognizer.generate(params) : null;
    }
}
export class RouteMatch {
    constructor({ specificity, handler, params, matchedUrl, unmatchedUrl } = {}) {
        this.specificity = specificity;
        this.handler = handler;
        this.params = params;
        this.matchedUrl = matchedUrl;
        this.unmatchedUrl = unmatchedUrl;
    }
}
//# sourceMappingURL=route_recognizer.js.map