import { define } from 'trans-render/define.js';
import {XtalViewElement} from 'xtal-element/xtal-view-element.js';
import {ElementInfo, ElementSetInfo} from 'api-viewer-element/src/lib/types.js';
import {createTemplate, newRenderContext} from 'xtal-element/utils.js';
import {init} from 'trans-render/init.js';
import '@alenaksu/json-viewer/build/index.js';
import {PD} from 'p-et-alia/p-d.js';
import {Test} from './types.js';
import {appendTag} from 'trans-render/appendTag.js';


const mainTemplate = createTemplate(/* html */`
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
export class ForInstance2 extends XtalViewElement<ElementInfo>{
    static get is() {
        return 'for-instance2';
    }

    static get observedAttributes() {
        return super.observedAttributes.concat([href, tag, contract_prop, skip_imports]);
    }

    attributeChangedCallback(n: string, ov: string, nv: string) {
        switch (n) {
          case tag:
          case href:
            (<any>this)['_' + n] = nv;
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

    get initRenderContext(){
        const contractProp = this._viewModel.properties.find(prop => prop.name === this._contractProp);
        if(contractProp === undefined) throw 'No contract found for contract prop: ' + this._contractProp;
        const test = JSON.parse(contractProp.default as string) as Test;
        return newRenderContext({
            mark: this._tag! + ', for instance.',
            'json-viewer': ({target})=>{
                (<any>target).data = test.expectedEvent;
            },
            main:  ({target}) => {
                appendTag(target, this._tag!, {})
            },
            [PD.is]: ({target}) =>{
                const pd = target as PD;
                pd.on = test.expectedEvent.name;
            }
        });
    }

    get mainTemplate(){
        return mainTemplate;
    }

    _href: string | undefined;
    get href() {
      return this._href;
    }
    set href(nv) {
      this.attr(href, nv!);
    }

    _tag: string | undefined;
    get tag(){
      return this._tag;
    }
    set tag(nv){
      this.attr(tag, nv!);
    }
  
    _contractProp: string | undefined;
    get contractProp(){
      return this._contractProp;
    }
    set contractProp(nv){
      this.attr(contract_prop, nv!);
    }
  
    _skipImports = false;
    get skipImports(){
      return this._skipImports;
    }
    set skipImports(nv){
      this.attr(skip_imports, nv, '');
    }

    async init(){
        return new Promise<ElementInfo>((resolve, reject) =>{
            fetch(this._href!).then(resp =>{
                resp.json().then(data =>{
                    const esi = data as ElementSetInfo;
                    const ei = esi.tags.find(tag => tag.name === this._tag);
                    if(ei === undefined){
                        reject(this._tag + ' not found.');
                    }
                    resolve(ei as ElementInfo);
                })
            })
        })
    }

    async update(){
        this.innerHTML = '';
        return this.init();
    }

    get readyToInit(){
        return this._href !== undefined && this._tag !==undefined && this._contractProp !== undefined;
    }
}
define(ForInstance2);