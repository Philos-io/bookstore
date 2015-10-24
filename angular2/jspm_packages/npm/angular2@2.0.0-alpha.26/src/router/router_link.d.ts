import { ElementRef } from 'angular2/core';
import { Router } from './router';
import { Location } from './location';
/**
 * The RouterLink directive lets you link to specific parts of your app.
 *
 *
 * Consider the following route configuration:

 * ```
 * @RouteConfig({
 *   path: '/user', component: UserCmp, alias: 'user'
 * });
 * class MyComp {}
 * ```
 *
 * When linking to a route, you can write:
 *
 * ```
 * <a router-link="user">link to user component</a>
 * ```
 *
 * @exportedAs angular2/router
 */
export declare class RouterLink {
    private _router;
    private _location;
    private _domEl;
    private _route;
    private _params;
    _visibleHref: string;
    _navigationHref: string;
    constructor(elementRef: ElementRef, _router: Router, _location: Location);
    route: string;
    params: StringMap<string, string>;
    onAllChangesDone(): void;
}
export declare var __esModule: boolean;
