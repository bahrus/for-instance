import { define } from 'trans-render/define.js';
import { XtalViewElement } from 'xtal-element/xtal-view-element.js';
import { createTemplate, newRenderContext } from 'xtal-element/utils.js';
import '@alenaksu/json-viewer/build/index.js';
const mainTemplate = createTemplate(/* html */ `
<mark></mark>
<json-viewer></json-viewer>
`);
const href = 'href';
const tag = 'tag';
const contract_prop = 'contract-prop';
const skip_imports = 'skip-imports';
export class ForInstance2 extends XtalViewElement {
    constructor() {
        super(...arguments);
        this._skipImports = false;
    }
    static get is() {
        return 'for-instance2';
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
        super.attributeChangedCallback(n, ov, nv);
    }
    get initRenderContext() {
        const contractProp = this._viewModel.properties.find(prop => prop.name === this._contractProp);
        if (contractProp === undefined)
            throw 'No contract found for contract prop: ' + this._contractProp;
        const test = JSON.parse(contractProp.default);
        return newRenderContext({
            mark: this._tag + ', for instance.',
            'json-viewer': ({ target }) => {
                target.data = test.expectedEvent;
            }
        });
    }
    get mainTemplate() {
        return mainTemplate;
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
    async init() {
        return new Promise((resolve, reject) => {
            fetch(this._href).then(resp => {
                resp.json().then(data => {
                    const esi = data;
                    const ei = esi.tags.find(tag => tag.name === this._tag);
                    if (ei === undefined) {
                        reject(this._tag + ' not found.');
                    }
                    resolve(ei);
                });
            });
        });
    }
    async update() {
        this.innerHTML = '';
        return this.init();
    }
    get readyToInit() {
        return this._href !== undefined && this._tag !== undefined && this._contractProp !== undefined;
    }
}
define(ForInstance2);
