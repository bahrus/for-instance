import { define } from "trans-render/define.js";
import { XtallatX } from "xtal-element/xtal-latx.js";
import { hydrate, disabled } from "trans-render/hydrate.js";
import { WCSuiteInfo } from "wc-info/types.d.js";
import  "swag-tag/swag-tag.js";

const href = "href";
export class ForInstance extends XtallatX(hydrate(HTMLElement)) {
  static get is() {
    return "for-instance";
  }

  static get observedAttributes() {
    return super.observedAttributes.concat([href]);
  }

  attributeChangedCallback(n: string, ov: string, nv: string) {
    switch (n) {
      case href:
        this._href = nv;
        break;
    }
    this.onPropsChange();
  }

  _href: string | null = null;
  get href() {
    return this._href;
  }
  set href(nv) {
    this.attr("href", nv!);
  }

  _c = false;
  connectedCallback() {
    this._c = true;
    this.onPropsChange();
  }
  sendFailure(el: HTMLElement, testName: string) {
    el.textContent = testName + " failed.";
    el.style.backgroundColor = "red";
    el.style.color = "white";
  }
  sendSuccess(el: HTMLElement, testName: string) {
    el.textContent = testName + " succeeded.";
    el.style.backgroundColor = "green";
    el.style.color = "white";
  }
  onPropsChange() {
    if (!this._c || this._disabled || !this._href) return;
    fetch(this._href).then(resp => {
      resp.json().then(json => {
        const wcSuiteInfo = json as WCSuiteInfo;
        wcSuiteInfo.tags.forEach(tag => {
          if (tag.selfResolvingModulePath) import(tag.selfResolvingModulePath);
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

                const details$ = /* html */`
                <details>
                  <summary>Tinker with ${tag.name}'s properties.</summary>
                  <swag-tag href="${this._href}" tag=${tag.name} test=${testCaseName}></swag-tag>
                </details>
                `;
                this.insertAdjacentHTML('beforeend', details$);
                let tagInstance: HTMLElement | undefined;
                try {
                  tagInstance = document.createElement(tag.name);
                } catch (e) {
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
                        tagInstance!.addEventListener(evt.name, e => {
                          const detail = (<any>e).detail;
                          if (detail === undefined) {
                            this.sendFailure(testDiv, testCaseName);
                          } else {
                            for (var key in expectedVal) {
                              const detailField = detail[key];
                              const expectedValField = expectedVal[key];
                              if (
                                typeof detailField !== typeof expectedValField
                              ) {
                                this.sendFailure(testDiv, testCaseName);
                              }
                              switch (typeof detailField) {
                                case "object":
                                  const lhs = JSON.stringify(detailField);
                                  const rhs = JSON.stringify(expectedValField);
                                  if (lhs !== rhs) {
                                    this.sendFailure(testDiv, testCaseName);
                                  } else {
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
                        tagInstance!.setAttribute(
                          attrib.name,
                          attrib.testValues[testCaseName]
                        );
                      }
                    }
                  });
                }
                if (tag.properties !== undefined) {
                  tag.properties.forEach(prop => {
                    if (prop.testValues !== undefined) {
                      const propTestVal = prop.testValues[testCaseName];
                      if (propTestVal !== undefined) {
                        (<any>tagInstance)[prop.name] = propTestVal;
                      }
                    }
                  });
                }

                this.appendChild(tagInstance);
              });
            } else {
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
