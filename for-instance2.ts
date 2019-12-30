import { define } from 'trans-render/define.js';
import {XtalViewElement} from 'xtal-element/xtal-view-element.js';
import {ElementInfo, ElementSetInfo} from 'api-viewer-element/src/lib/types.js';
import {createTemplate, newRenderContext} from 'xtal-element/utils.js';
import {init} from 'trans-render/init.js';

const mainTemplate = createTemplate(/* html */`
<mark></mark>
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
        return newRenderContext({
            mark: this._tag!
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