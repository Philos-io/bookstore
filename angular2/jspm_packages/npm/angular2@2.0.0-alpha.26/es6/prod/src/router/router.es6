import { PromiseWrapper, EventEmitter, ObservableWrapper } from 'angular2/src/facade/async';
import { MapWrapper, List, ListWrapper } from 'angular2/src/facade/collection';
import { isBlank, isPresent } from 'angular2/src/facade/lang';
/**
 * # Router
 * The router is responsible for mapping URLs to components.
 *
 * You can see the state of the router by inspecting the read-only field `router.navigating`.
 * This may be useful for showing a spinner, for instance.
 *
 * ## Concepts
 * Routers and component instances have a 1:1 correspondence.
 *
 * The router holds reference to a number of "outlets." An outlet is a placeholder that the
 * router dynamically fills in depending on the current URL.
 *
 * When the router navigates from a URL, it must first recognizes it and serialize it into an
 * `Instruction`.
 * The router uses the `RouteRegistry` to get an `Instruction`.
 *
 * @exportedAs angular2/router
 */
export class Router {
    // todo(jeffbcross): rename _registry to registry since it is accessed from subclasses
    // todo(jeffbcross): rename _pipeline to pipeline since it is accessed from subclasses
    constructor(_registry, _pipeline, parent, hostComponent) {
        this._registry = _registry;
        this._pipeline = _pipeline;
        this.parent = parent;
        this.hostComponent = hostComponent;
        this.navigating = false;
        this.previousUrl = null;
        this._outlets = MapWrapper.create();
        this._subject = new EventEmitter();
        this._currentInstruction = null;
    }
    /**
     * Constructs a child router. You probably don't need to use this unless you're writing a reusable
     * component.
     */
    childRouter(hostComponent) { return new ChildRouter(this, hostComponent); }
    /**
     * Register an object to notify of route changes. You probably don't need to use this unless
     * you're writing a reusable component.
     */
    registerOutlet(outlet, name = 'default') {
        MapWrapper.set(this._outlets, name, outlet);
        if (isPresent(this._currentInstruction)) {
            var childInstruction = this._currentInstruction.getChild(name);
            return outlet.activate(childInstruction);
        }
        return PromiseWrapper.resolve(true);
    }
    /**
     * Dynamically update the routing configuration and trigger a navigation.
     *
     * # Usage
     *
     * ```
     * router.config({ 'path': '/', 'component': IndexCmp});
     * ```
     *
     * Or:
     *
     * ```
     * router.config([
     *   { 'path': '/', 'component': IndexComp },
     *   { 'path': '/user/:id', 'component': UserComp },
     * ]);
     * ```
     *
     */
    config(config) {
        if (config instanceof List) {
            config.forEach((configObject) => { this._registry.config(this.hostComponent, configObject); });
        }
        else {
            this._registry.config(this.hostComponent, config);
        }
        return this.renavigate();
    }
    /**
     * Navigate to a URL. Returns a promise that resolves to the canonical URL for the route.
     *
     * If the given URL begins with a `/`, router will navigate absolutely.
     * If the given URL does not begin with `/`, the router will navigate relative to this component.
     */
    navigate(url) {
        if (this.navigating) {
            return PromiseWrapper.resolve(true);
        }
        this.lastNavigationAttempt = url;
        var matchedInstruction = this.recognize(url);
        if (isBlank(matchedInstruction)) {
            return PromiseWrapper.resolve(false);
        }
        if (isPresent(this._currentInstruction)) {
            matchedInstruction.reuseComponentsFrom(this._currentInstruction);
        }
        this._startNavigating();
        var result = this.commit(matchedInstruction)
            .then((_) => {
            ObservableWrapper.callNext(this._subject, matchedInstruction.accumulatedUrl);
            this._finishNavigating();
        });
        PromiseWrapper.catchError(result, (_) => this._finishNavigating());
        return result;
    }
    _startNavigating() { this.navigating = true; }
    _finishNavigating() { this.navigating = false; }
    /**
     * Subscribe to URL updates from the router
     */
    subscribe(onNext) { ObservableWrapper.subscribe(this._subject, onNext); }
    /**
     *
     */
    commit(instruction) {
        this._currentInstruction = instruction;
        // collect all outlets that do not have a corresponding child instruction
        // and remove them from the internal map of child outlets
        var toDeactivate = ListWrapper.create();
        MapWrapper.forEach(this._outlets, (outlet, outletName) => {
            if (!instruction.hasChild(outletName)) {
                MapWrapper.delete(this._outlets, outletName);
                ListWrapper.push(toDeactivate, outlet);
            }
        });
        return PromiseWrapper.all(ListWrapper.map(toDeactivate, (outlet) => outlet.deactivate()))
            .then((_) => this.activate(instruction));
    }
    /**
     * Recursively remove all components contained by this router's outlets.
     * Calls deactivate hooks on all descendant components
     */
    deactivate() { return this._eachOutletAsync((outlet) => outlet.deactivate); }
    /**
     * Recursively activate.
     * Calls the "activate" hook on descendant components.
     */
    activate(instruction) {
        return this._eachOutletAsync((outlet, name) => outlet.activate(instruction.getChild(name)));
    }
    _eachOutletAsync(fn) { return mapObjAsync(this._outlets, fn); }
    /**
     * Given a URL, returns an instruction representing the component graph
     */
    recognize(url) { return this._registry.recognize(url, this.hostComponent); }
    /**
     * Navigates to either the last URL successfully navigated to, or the last URL requested if the
     * router has yet to successfully navigate.
     */
    renavigate() {
        var destination = isBlank(this.previousUrl) ? this.lastNavigationAttempt : this.previousUrl;
        if (this.navigating || isBlank(destination)) {
            return PromiseWrapper.resolve(false);
        }
        return this.navigate(destination);
    }
    /**
     * Generate a URL from a component name and optional map of parameters. The URL is relative to the
     * app's base href.
     */
    generate(name, params) {
        return this._registry.generate(name, params, this.hostComponent);
    }
}
export class RootRouter extends Router {
    constructor(registry, pipeline, location, hostComponent) {
        super(registry, pipeline, null, hostComponent);
        this._location = location;
        this._location.subscribe((change) => this.navigate(change['url']));
        this._registry.configFromComponent(hostComponent);
        this.navigate(location.path());
    }
    commit(instruction) {
        return super.commit(instruction)
            .then((_) => { this._location.go(instruction.accumulatedUrl); });
    }
}
class ChildRouter extends Router {
    constructor(parent, hostComponent) {
        super(parent._registry, parent._pipeline, parent, hostComponent);
        this.parent = parent;
    }
}
function mapObjAsync(obj, fn) {
    return PromiseWrapper.all(mapObj(obj, fn));
}
function mapObj(obj, fn) {
    var result = ListWrapper.create();
    MapWrapper.forEach(obj, (value, key) => ListWrapper.push(result, fn(value, key)));
    return result;
}
//# sourceMappingURL=router.js.map