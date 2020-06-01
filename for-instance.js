import { define } from 'trans-render/define.js';
import { XtalFetchViewElement } from 'xtal-element/XtalFetchViewElement.js';
import { createTemplate } from 'trans-render/createTemplate.js';
import { prependTag } from 'trans-render/prependTag.js';
const mainTemplate = createTemplate(/* html */ `
<mark></mark>
<json-viewer></json-viewer>
<main>
  <p-d from=main to=details care-of=[-data] val=detail m=1></p-d>
  <p-d from=main to=[-lhs] val=detail m=2></p-d> 
</main>

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
//const href = 'href';
const tag = 'tag';
const contract_prop = 'contract-prop';
const skip_imports = 'skip-imports';
/**
 * Test instances of custom element for custom event signature contracts.
 * @element for-instance
 */
let ForInstance = /** @class */ (() => {
    class ForInstance extends XtalFetchViewElement {
        constructor() {
            super();
            //#endregion
            //#region overridden members
            this.noShadow = true;
            this._skipImports = false;
            import('p-et-alia/p-d.js');
            import('if-diff/if-diff-then-stiff.js');
            import('@alenaksu/json-viewer/build/index.js');
        }
        get readyToInit() {
            return super.readyToInit && this._tag !== undefined && this._contractProp !== undefined;
        }
        filterInitData(data) {
            var _a, _b;
            const esi = data;
            const elementInfo = (_a = esi.tags) === null || _a === void 0 ? void 0 : _a.find(tag => tag.name === this._tag);
            if (elementInfo === undefined) {
                // reject('No Element Info Found');
                return { test: {}, elementInfo: {} };
                //TODO
            }
            const test$ = (_b = elementInfo.properties.find(prop => prop.name === this._contractProp)) === null || _b === void 0 ? void 0 : _b.default;
            if (test$ === undefined) {
                return { test: {}, elementInfo: {} };
                //reject('No contract found');
                //TODO
            }
            const test = JSON.parse(test$);
            return { test, elementInfo };
        }
        get readyToRender() {
            if (this.viewModel === undefined)
                return false;
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
                'json-viewer': [{ innerHTML: JSON.stringify(this._viewModel) }],
                main: ({ target }) => {
                    const newElement = prependTag(target, this._tag, [, , { disabled: '2' }], {});
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
                '"': {
                    'p-d': [{ on: this._viewModel.test.expectedEvent.name }],
                },
                details: {
                    'section[data-lhs]': {
                        'json-viewer': [{ innerHTML: JSON.stringify(this._viewModel.test.expectedEvent.detail) }]
                    }
                },
                'if-diff-then-stiff': [{ rhs: this._viewModel.test.expectedEvent.detail }]
            };
        }
        //#endregion
        //#region boilerplate
        static get observedAttributes() {
            return super.observedAttributes.concat([tag, contract_prop, skip_imports]);
        }
        attributeChangedCallback(n, ov, nv) {
            switch (n) {
                case tag:
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
    ForInstance.is = 'for-instance';
    return ForInstance;
})();
export { ForInstance };
define(ForInstance);
