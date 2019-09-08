import { define } from "trans-render/define.js";
import { XtallatX } from "xtal-element/xtal-latx.js";
import { hydrate } from "trans-render/hydrate.js";
import "swag-tag/swag-tag.js";
import "if-diff/if-diff.js";
import "p-et-alia/p-d.js";
const href = "href";
export class ForInstance extends XtallatX(hydrate(HTMLElement)) {
    constructor() {
        super(...arguments);
        this._href = null;
        this._c = false;
    }
    static get is() {
        return "for-instance";
    }
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
    sendFailure(el, testName) {
        el.textContent = testName + " failed.";
        el.style.backgroundColor = "red";
        el.style.color = "white";
    }
    sendSuccess(el, testName) {
        el.textContent = testName + " succeeded.";
        el.style.backgroundColor = "green";
        el.style.color = "white";
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
                    customElements.whenDefined(tag.name).then(() => {
                        const h3 = document.createElement("h3");
                        h3.textContent = tag.name;
                        this.appendChild(h3);
                        // const details = document.createElement('details');
                        // const summary = document.createElement('summary');
                        // summary.textContent = 'tinker';
                        // details.appendChild()
                        if (tag.testCaseNames !== undefined) {
                            tag.testCaseNames.forEach(testCaseName => {
                                const h4 = document.createElement("mark");
                                h4.textContent = testCaseName + ", for instance";
                                this.appendChild(h4);
                                const details$ = /* html */ `
                <details>
                  <p-d on=toggle to=[-if] val=target.open m=1 skip-init></p-d>
                  <summary>Tinker with ${tag.name}'s properties.</summary>
                  <if-diff -if data-key-name=open m=1></if-diff>
                  <div data-open=0>
                    <template >
                      <swag-tag href="${this._href}" tag=${tag.name} test=${testCaseName} ></swag-tag>
                    </template>
                  </div>

                  
                </details>
                `;
                                this.insertAdjacentHTML('beforeend', details$);
                                let tagInstance;
                                try {
                                    tagInstance = document.createElement(tag.name);
                                }
                                catch (e) {
                                    console.error(e);
                                    return;
                                }
                                if (tag.customEvents !== undefined) {
                                    tag.customEvents.forEach(evt => {
                                        if (evt.testExpectedValues !== undefined) {
                                            const expectedVal = evt.testExpectedValues[testCaseName];
                                            if (expectedVal !== undefined) {
                                                const testDiv = document.createElement("div");
                                                testDiv.textContent = "Awaiting event " + evt.name;
                                                this.appendChild(testDiv);
                                                tagInstance.addEventListener(evt.name, e => {
                                                    const detail = e.detail;
                                                    if (detail === undefined) {
                                                        this.sendFailure(testDiv, testCaseName);
                                                    }
                                                    else {
                                                        for (var key in expectedVal) {
                                                            const detailField = detail[key];
                                                            const expectedValField = expectedVal[key];
                                                            if (typeof detailField !== typeof expectedValField) {
                                                                this.sendFailure(testDiv, testCaseName);
                                                            }
                                                            switch (typeof detailField) {
                                                                case "object":
                                                                    const lhs = JSON.stringify(detailField);
                                                                    const rhs = JSON.stringify(expectedValField);
                                                                    if (lhs !== rhs) {
                                                                        this.sendFailure(testDiv, testCaseName);
                                                                    }
                                                                    else {
                                                                        this.sendSuccess(testDiv, testCaseName);
                                                                    }
                                                                    break;
                                                            }
                                                        }
                                                    }
                                                });
                                            }
                                        }
                                    });
                                }
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
        });
    }
}
define(ForInstance);
