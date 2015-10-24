import { DOM } from 'angular2/src/dom/dom_adapter';
import { ListWrapper } from 'angular2/src/facade/collection';
import { isPresent } from 'angular2/src/facade/lang';
export class DestinationLightDom {
}
class _Root {
    constructor(node, boundElementIndex) {
        this.node = node;
        this.boundElementIndex = boundElementIndex;
    }
}
// TODO: LightDom should implement DestinationLightDom
// once interfaces are supported
export class LightDom {
    constructor(lightDomView, element) {
        this.lightDomView = lightDomView;
        this.nodes = DOM.childNodesAsList(element);
        this._roots = null;
        this.shadowDomView = null;
    }
    attachShadowDomView(shadowDomView) { this.shadowDomView = shadowDomView; }
    detachShadowDomView() { this.shadowDomView = null; }
    redistribute() { redistributeNodes(this.contentTags(), this.expandedDomNodes()); }
    contentTags() {
        if (isPresent(this.shadowDomView)) {
            return this._collectAllContentTags(this.shadowDomView, []);
        }
        else {
            return [];
        }
    }
    // Collects the Content directives from the view and all its child views
    _collectAllContentTags(view, acc) {
        // Note: exiting early here is important as we call this function for every view
        // that is added, so we have O(n^2) runtime.
        // TODO(tbosch): fix the root problem, see
        // https://github.com/angular/angular/issues/2298
        if (view.proto.transitiveContentTagCount === 0) {
            return acc;
        }
        var contentTags = view.contentTags;
        var vcs = view.viewContainers;
        for (var i = 0; i < vcs.length; i++) {
            var vc = vcs[i];
            var contentTag = contentTags[i];
            if (isPresent(contentTag)) {
                ListWrapper.push(acc, contentTag);
            }
            if (isPresent(vc)) {
                ListWrapper.forEach(vc.contentTagContainers(), (view) => { this._collectAllContentTags(view, acc); });
            }
        }
        return acc;
    }
    // Collects the nodes of the light DOM by merging:
    // - nodes from enclosed ViewContainers,
    // - nodes from enclosed content tags,
    // - plain DOM nodes
    expandedDomNodes() {
        var res = [];
        var roots = this._findRoots();
        for (var i = 0; i < roots.length; ++i) {
            var root = roots[i];
            if (isPresent(root.boundElementIndex)) {
                var vc = this.lightDomView.viewContainers[root.boundElementIndex];
                var content = this.lightDomView.contentTags[root.boundElementIndex];
                if (isPresent(vc)) {
                    res = ListWrapper.concat(res, vc.nodes());
                }
                else if (isPresent(content)) {
                    res = ListWrapper.concat(res, content.nodes());
                }
                else {
                    ListWrapper.push(res, root.node);
                }
            }
            else {
                ListWrapper.push(res, root.node);
            }
        }
        return res;
    }
    // Returns a list of Roots for all the nodes of the light DOM.
    // The Root object contains the DOM node and its corresponding boundElementIndex
    _findRoots() {
        if (isPresent(this._roots))
            return this._roots;
        var boundElements = this.lightDomView.boundElements;
        this._roots = ListWrapper.map(this.nodes, (n) => {
            var boundElementIndex = null;
            for (var i = 0; i < boundElements.length; i++) {
                var boundEl = boundElements[i];
                if (isPresent(boundEl) && boundEl === n) {
                    boundElementIndex = i;
                    break;
                }
            }
            return new _Root(n, boundElementIndex);
        });
        return this._roots;
    }
}
// Projects the light DOM into the shadow DOM
function redistributeNodes(contents, nodes) {
    for (var i = 0; i < contents.length; ++i) {
        var content = contents[i];
        var select = content.select;
        // Empty selector is identical to <content/>
        if (select.length === 0) {
            content.insert(ListWrapper.clone(nodes));
            ListWrapper.clear(nodes);
        }
        else {
            var matchSelector = (n) => DOM.elementMatches(n, select);
            var matchingNodes = ListWrapper.filter(nodes, matchSelector);
            content.insert(matchingNodes);
            ListWrapper.removeAll(nodes, matchingNodes);
        }
    }
    for (var i = 0; i < nodes.length; i++) {
        var node = nodes[i];
        if (isPresent(node.parentNode)) {
            DOM.remove(nodes[i]);
        }
    }
}
//# sourceMappingURL=light_dom.js.map