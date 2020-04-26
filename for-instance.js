import { define } from 'trans-render/define.js';
import { XtalViewElement } from 'xtal-element/xtal-view-element.js';
import { createTemplate } from 'trans-render/createTemplate.js';
import { appendTag } from 'trans-render/appendTag.js';
const mainTemplate = createTemplate(/* html */ `
<mark></mark>
<json-viewer></json-viewer>
<main></main>
<p-d to=details care-of=[-data] val=detail m=1></p-d>
<p-d to=[-lhs] val=detail m=2></p-d> 
<details>
    <summary>Event Details</summary>
    <section data-lhs>
        <h4>Expected Event Detail</h4>
        <json-viewer></json-viewer>
    </section>
    <section>
        <h4>Actual Event Detail</h4>
        <json-viewer -data></json-viewer>
    </section>
</details>
<if-diff-then-stiff if -lhs equals -rhs data-key-name=success></if-diff-then-stiff>
<if-diff-then-stiff if -lhs not_equals -rhs data-key-name=failure></if-diff-then-stiff>
<div data-success=0>
    <template>
        <div mark style="background-color: green; color: white;">selectedElementContract succeeded.</div>
    </template>
</div>
<div data-failure=0>
    <template>
      <div err style="background-color: red; color: white;">selectedElementContract failed.</div>
    </template>
</div>
`);
const href = 'href';
const tag = 'tag';
const contract_prop = 'contract-prop';
const skip_imports = 'skip-imports';
/**
 * Test instances of custom element for custom event signature contracts.
 * @element for-instance
 */
export class ForInstance extends XtalViewElement {
    constructor() {
        super();
        this._skipImports = false;
        import('p-et-alia/p-d.js');
        import('if-diff/if-diff-then-stiff.js');
        import('@alenaksu/json-viewer/build/index.js');
    }
    static get is() {
        return 'for-instance';
    }
    //#region required members
    get readyToInit() {
        return this._href !== undefined && this._tag !== undefined && this._contractProp !== undefined;
    }
    init(signal) {
        return new Promise((resolve, reject) => {
            fetch(this._href).then(resp => {
                resp.json().then(data => {
                    var _a, _b;
                    const esi = data;
                    const elementInfo = (_a = esi.tags) === null || _a === void 0 ? void 0 : _a.find(tag => tag.name === this._tag);
                    if (elementInfo === undefined) {
                        reject('No Element Info Found');
                        return;
                    }
                    const test$ = (_b = elementInfo.properties.find(prop => prop.name === this._contractProp)) === null || _b === void 0 ? void 0 : _b.default;
                    if (test$ === undefined) {
                        reject('No contract found');
                    }
                    const test = JSON.parse(test$);
                    resolve({ test, elementInfo });
                });
            });
        });
    }
    get readyToRender() {
        let trigger = this._viewModel.test.trigger;
        if (trigger != undefined) {
            const scr = document.createElement('script');
            scr.type = 'module';
            if (this._skipImports) {
                const split = trigger.split('\n');
                split.forEach((line, idx) => {
                    if (line.trim().startsWith('import ')) {
                        split[idx] = '//' + line;
                    }
                });
                trigger = split.join('\n');
            }
            scr.innerHTML = trigger;
            document.head.appendChild(scr);
        }
        return true;
    }
    get mainTemplate() {
        return mainTemplate;
    }
    get initTransform() {
        return {
            mark: this._tag + ', for instance.',
            'json-viewer': ({ target }) => {
                target.innerHTML = JSON.stringify(this._viewModel);
            },
            main: ({ target }) => {
                const newElement = appendTag(target, this._tag, {});
                this._viewModel.elementInfo.properties.forEach(prop => {
                    if (prop.default !== undefined) {
                        switch (typeof prop.default) {
                            case 'string':
                                switch (prop.type) {
                                    case 'string':
                                    case 'object':
                                        newElement[prop.name] = JSON.parse(prop.default);
                                        break;
                                    default:
                                        if (prop.type[0] === '{') { //example:   "type": "{ [key: string]: number; }",
                                            newElement[prop.name] = JSON.parse(prop.default);
                                        }
                                        else {
                                            newElement[prop.name] = prop.default;
                                        }
                                }
                                break;
                            default:
                                newElement[prop.name] = prop.default;
                        }
                    }
                });
            },
            'p-d': ({ target }) => {
                target.on = this._viewModel.test.expectedEvent.name;
            },
            details: {
                'section[data-lhs]': {
                    'json-viewer': ({ target }) => { target.innerHTML = JSON.stringify(this._viewModel.test.expectedEvent.detail); }
                }
            },
            'if-diff-then-stiff': ({ target }) => {
                target.rhs = this._viewModel.test.expectedEvent.detail;
            }
        };
    }
    async update(signal) {
        this.innerHTML = '';
        return this.init(signal);
    }
    //#endregion
    //#region boilerplate
    static get observedAttributes() {
        return super.observedAttributes.concat([href, tag, contract_prop, skip_imports]);
    }
    //#endregion
    //#region overridden members
    get noShadow() { return true; }
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
        super.attributeChangedCallback(n, ov, nv);
    }
    get href() {
        return this._href;
    }
    /**
     * URL for custom-elements.json file / stream.
     * @attr
     */
    set href(nv) {
        this.attr(href, nv);
    }
    get tag() {
        return this._tag;
    }
    /**
     * Name of tag to test / showcase.
     * @attr
     */
    set tag(nv) {
        this.attr(tag, nv);
    }
    get contractProp() {
        return this._contractProp;
    }
    /**
     * Name of property that specifies contract.
     * @attr contract-prop
     */
    set contractProp(nv) {
        this.attr(contract_prop, nv);
    }
    get skipImports() {
        return this._skipImports;
    }
    /**
     * If test page contains needed imports, skip any imports contained in test script.
     * @attr skip-imports
     */
    set skipImports(nv) {
        this.attr(skip_imports, nv, '');
    }
}
define(ForInstance);
