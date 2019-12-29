import { define } from 'trans-render/define.js';
import { XtallatX } from 'xtal-element/xtal-latx.js';
import { hydrate } from 'trans-render/hydrate.js';
import '@alenaksu/json-viewer/build/index.js';
import { appendTag } from 'trans-render/appendTag.js';
const href = 'href';
const tag = 'tag';
const contract_prop = 'contract-prop';
const skip_imports = 'skip-imports';
//TODO -- switch to XtalElement
export class ForInstance extends XtallatX(hydrate(HTMLElement)) {
    constructor() {
        super(...arguments);
        this._skipImports = false;
        this._c = false;
    }
    static get is() {
        return 'for-instance';
    }
    static get observedAttributes() {
        return super.observedAttributes.concat([href, tag, contract_prop, skip_imports]);
    }
    attributeChangedCallback(n, ov, nv) {
        switch (n) {
            case tag:
            case href:
                this['_' + n] = nv;
                break;
            case contract_prop:
                this._contractProp = nv;
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
    get contractProp() {
        return this._contractProp;
    }
    set contractProp(nv) {
        this.attr(contract_prop, nv);
    }
    get skipImports() {
        return this._skipImports;
    }
    set skipImports(nv) {
        this.attr(skip_imports, nv, '');
    }
    connectedCallback() {
        this.propUp([href, tag, contract_prop, 'skipImports']);
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
    //from https://gist.github.com/nicbell/6081098
    compare(obj1, obj2) {
        //Loop through properties in object 1
        for (const p in obj1) {
            //Check property exists on both objects
            if (obj1.hasOwnProperty(p) !== obj2.hasOwnProperty(p))
                return false;
            switch (typeof (obj1[p])) {
                //Deep compare objects
                case 'object':
                    if (!this.compare(obj1[p], obj2[p]))
                        return false;
                    break;
                //Compare function code
                case 'function':
                    if (typeof (obj2[p]) == 'undefined' || (p != 'compare' && obj1[p].toString() != obj2[p].toString()))
                        return false;
                    break;
                //Compare values
                default:
                    if (obj1[p] != obj2[p])
                        return false;
            }
        }
        //Check object 2 for any extra properties
        for (var p in obj2) {
            if (typeof (obj1[p]) == 'undefined')
                return false;
        }
        return true;
    }
    ;
    async onPropsChange() {
        if (!this._c || this._disabled || this._href === undefined || this._contractProp === undefined || this._tag === undefined)
            return;
        this.innerHTML = '';
        const mark = document.createElement('mark');
        mark.innerHTML = `${this.tag}, for instance`;
        this.appendChild(mark);
        const resp = await fetch(this._href);
        const json = await resp.json();
        const elementSetInfo = json;
        const tag = elementSetInfo.tags.find(tag => tag.name === this._tag);
        if (tag === undefined)
            return;
        const prop = tag.properties.find(prop => prop.name === this._contractProp);
        if (prop === undefined)
            return;
        const test = JSON.parse(prop.default);
        const jsonViewer = document.createElement('json-viewer');
        jsonViewer.data = { expectedEvent: test.expectedEvent };
        this.appendChild(jsonViewer);
        const elem = document.createElement(tag.name);
        const result = document.createElement('div');
        this.sendFailure(result, this._contractProp);
        elem.addEventListener(test.expectedEvent.name, e => {
            const details = appendTag(this, 'details', {});
            const summary = appendTag(details, 'summary', {
                propVals: { textContent: 'Event Details' }
            });
            details.appendChild(summary);
            const lhs = document.createElement('json-viewer');
            lhs.data = test.expectedEvent.detail;
            details.appendChild(lhs);
            const rhs = document.createElement('json-viewer');
            rhs.data = e.detail;
            details.appendChild(rhs);
            if (test.expectedEvent.detail !== undefined) {
                if (!this.compare(test.expectedEvent.detail, e.detail))
                    return;
                if (test.expectedEvent.associatedPropName !== undefined) {
                    const lhs = elem[test.expectedEvent.associatedPropName];
                    if (!this.compare(lhs, test.expectedEvent.detail) && !this.compare(lhs, test.expectedEvent.detail.value))
                        return;
                }
            }
            this.sendSuccess(result, this._contractProp);
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
