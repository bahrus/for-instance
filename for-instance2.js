import { define } from 'trans-render/define.js';
import { XtalViewElement } from 'xtal-element/xtal-view-element.js';
import { createTemplate, newRenderContext } from 'xtal-element/utils.js';
import '@alenaksu/json-viewer/build/index.js';
import { PD } from 'p-et-alia/p-d.js';
import { appendTag } from 'trans-render/appendTag.js';
const mainTemplate = createTemplate(/* html */ `
<mark></mark>
<json-viewer></json-viewer>
<main></main>
<p-d to=details care-of=[-data] val=detail m=1></p-d>
<details>
    <summary>Event Details</summary>
    <section data-lhs>
        <json-viewer></json-viewer>
    </section>
    <section>
        <json-viewer -data></json-viewer>
    </section>
</details>
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
    get initRenderContext() {
        const contractProp = this._viewModel.properties.find(prop => prop.name === this._contractProp);
        if (contractProp === undefined)
            throw 'No contract found for contract prop: ' + this._contractProp;
        const test = JSON.parse(contractProp.default);
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
        return newRenderContext({
            mark: this._tag + ', for instance.',
            'json-viewer': ({ target }) => {
                target.data = test.expectedEvent;
            },
            main: ({ target }) => {
                appendTag(target, this._tag, {});
            },
            [PD.is]: ({ target }) => {
                const pd = target;
                pd.on = test.expectedEvent.name;
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
