import { define } from "trans-render/define.js";
import { XtallatX } from "xtal-element/xtal-latx.js";
import { hydrate } from "trans-render/hydrate.js";
// import "if-diff/if-diff.js";
// import "p-et-alia/p-d.js";
const href = 'href';
const tag = 'tag';
const prop = 'prop';
const skip_imports = 'skip-imports';
export class ForInstance extends XtallatX(hydrate(HTMLElement)) {
    constructor() {
        super(...arguments);
        this._skipImports = false;
        this._c = false;
    }
    static get is() {
        return "for-instance";
    }
    static get observedAttributes() {
        return super.observedAttributes.concat([href, tag, prop, skip_imports]);
    }
    attributeChangedCallback(n, ov, nv) {
        switch (n) {
            case tag:
            case href:
            case prop:
                this['_' + n] = nv;
                break;
            case skip_imports:
                this._skipImports = nv !== null;
                break;
        }
        this.onPropsChange();
    }
    get href() {
        return this._href;
    }
    set href(nv) {
        this.attr(href, nv);
    }
    get tag() {
        return this._tag;
    }
    set tag(nv) {
        this.attr(tag, nv);
    }
    get prop() {
        return this._prop;
    }
    set prop(nv) {
        this.attr(prop, nv);
    }
    get skipImports() {
        return this._skipImports;
    }
    set skipImports(nv) {
        this.attr(skip_imports, nv, '');
    }
    connectedCallback() {
        this.propUp([href, tag, prop, 'skipImports']);
        this._c = true;
        this.onPropsChange();
    }
    sendFailure(el, testName) {
        el.textContent = testName + " failed.";
        el.style.backgroundColor = "red";
        el.style.color = "white";
        el.setAttribute('err', '');
    }
    sendSuccess(el, testName) {
        el.textContent = testName + " succeeded.";
        el.style.backgroundColor = "green";
        el.style.color = "white";
        el.removeAttribute('err');
        el.setAttribute('mark', '');
    }
    async onPropsChange() {
        if (!this._c || this._disabled || this._href === undefined || this._prop === undefined || this._tag === undefined)
            return;
        const resp = await fetch(this._href);
        const json = await resp.json();
        const elementSetInfo = json;
        const tag = elementSetInfo.tags.find(tag => tag.name === this._tag);
        if (tag === undefined)
            return;
        const prop = tag.properties.find(prop => prop.name === this._prop);
        if (prop === undefined)
            return;
        const test = JSON.parse(prop.default);
        const elem = document.createElement(tag.name);
        const result = document.createElement('div');
        this.sendFailure(result, this._prop);
        elem.addEventListener(test.expectedEvent.name, e => {
            if (test.expectedEvent.detail !== undefined) {
                const expectedDetailString = JSON.stringify(test.expectedEvent.detail);
                const actualDetailString = JSON.stringify(e.detail);
                if (expectedDetailString !== actualDetailString) {
                    return;
                }
                if (test.expectedEvent.associatedPropName !== undefined) {
                    const propValString = JSON.stringify(elem[test.expectedEvent.associatedPropName]);
                    if (expectedDetailString !== propValString) {
                        const expectedDetailValueString = JSON.stringify(test.expectedEvent.detail.value);
                        if (expectedDetailValueString !== propValString) {
                            return;
                        }
                    }
                }
            }
            this.sendSuccess(result, this._prop);
        });
        this.appendChild(elem);
        this.appendChild(result);
        let trigger = test.trigger;
        if (trigger != undefined) {
            const scr = document.createElement('script');
            scr.type = 'module';
            if (this._skipImports) {
                const split = trigger.split('\n');
                split.forEach((line, idx) => {
                    if (line.trimStart().startsWith('import ')) {
                        split[idx] = '//' + line;
                    }
                });
                trigger = split.join('\n');
            }
            scr.innerHTML = trigger;
            document.head.appendChild(scr);
        }
    }
}
define(ForInstance);
