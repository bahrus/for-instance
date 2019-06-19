import { define } from "trans-render/define.js";
import { XtallatX } from "xtal-element/xtal-latx.js";
import { hydrate } from 'trans-render/hydrate.js';
const href = 'href';
export class ForInstance extends XtallatX(hydrate(HTMLElement)) {
    constructor() {
        super(...arguments);
        this._href = null;
        this._c = false;
    }
    static get is() { return 'for-instance'; }
    static get observedAttributes() {
        return super.observedAttributes.concat([href]);
    }
    attributeChangedCallback(n, ov, nv) {
        switch (n) {
            case href:
                this._href = nv;
                break;
        }
        this.onPropsChange();
    }
    get href() {
        return this._href;
    }
    set href(nv) {
        this.attr("href", nv);
    }
    connectedCallback() {
        this._c = true;
        this.onPropsChange();
    }
    onPropsChange() {
        if (!this._c || this._disabled || !this._href)
            return;
        fetch(this._href).then(resp => {
            resp.json().then(json => {
                const wcSuiteInfo = json;
                wcSuiteInfo.tags.forEach(tag => {
                    if (tag.selfResolvingModulePath)
                        import(tag.selfResolvingModulePath);
                    const h3 = document.createElement('h3');
                    h3.textContent = tag.name;
                    this.appendChild(h3);
                    if (tag.testCaseNames !== undefined) {
                        tag.testCaseNames.forEach(testCaseName => {
                            const h4 = document.createElement('mark');
                            h4.textContent = testCaseName + ', for instance';
                            this.appendChild(h4);
                            const tagInstance = document.createElement(tag.name);
                            if (tag.attributes !== undefined) {
                                tag.attributes.forEach(attrib => {
                                    if (attrib.testValues !== undefined) {
                                        if (attrib.testValues[testCaseName] !== undefined) {
                                            tagInstance.setAttribute(attrib.name, attrib.testValues[testCaseName]);
                                        }
                                    }
                                });
                            }
                            if (tag.properties !== undefined) {
                                tag.properties.forEach(prop => {
                                    if (prop.testValues !== undefined) {
                                        const propTestVal = prop.testValues[testCaseName];
                                        if (propTestVal !== undefined) {
                                            tagInstance[prop.name] = propTestVal;
                                        }
                                    }
                                });
                            }
                            this.appendChild(tagInstance);
                        });
                    }
                    else {
                        const tagInstance = document.createElement(tag.name);
                        this.appendChild(tagInstance);
                    }
                });
            });
        });
    }
}
define(ForInstance);
