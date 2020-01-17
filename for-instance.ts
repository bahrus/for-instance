import { define } from 'trans-render/define.js';
import {XtalViewElement} from 'xtal-element/xtal-view-element.js';
import {ElementInfo, ElementSetInfo} from 'api-viewer-element/src/lib/types.js';
import {createTemplate, newRenderContext} from 'xtal-element/utils.js';
import {PDProps} from 'p-et-alia/types.d.js';
import {IfDiffProps} from 'if-diff/types.d.js';
import {ForInstanceViewModel} from './types.js';
import {appendTag} from 'trans-render/appendTag.js';
import { Test } from '../event-switch/event-switch.js';


const mainTemplate = createTemplate(/* html */`
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
export class ForInstance extends XtalViewElement<ForInstanceViewModel>{
    static get is() {
        return 'for-instance';
    }
    static get observedAttributes() {
        return super.observedAttributes.concat([href, tag, contract_prop, skip_imports]);
    }
    get noShadow(){return true;}
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
        import('p-et-alia/p-d.js');
        import ('@alenaksu/json-viewer/build/index.js');
        import ('if-diff/if-diff-then-stiff.js');
        let trigger = this._viewModel.test.trigger;
        if(trigger != undefined){
          const scr = document.createElement('script');
          scr.type = 'module';
          if(this._skipImports){
            const split = trigger.split('\n');
            split.forEach((line, idx) =>{
              if(line.trim().startsWith('import ')){
                split[idx] = '//' + line;
              }
            });
            trigger = split.join('\n');
          }
          scr.innerHTML = trigger;
          document.head.appendChild(scr);
        }
        return newRenderContext({
            mark: this._tag! + ', for instance.',
            'json-viewer': ({target})=>{
                (<any>target).data = this._viewModel;
            },
            main:  ({target}) => {
                const newElement = appendTag(target, this._tag!, {});
                this._viewModel.elementInfo.properties.forEach(prop =>{
                  if(prop.default !== undefined){
                    switch(typeof prop.default){
                      case 'string':{
                        switch(prop.type){
                          case 'object':{
                            (<any>newElement)[prop.name] = JSON.parse(prop.default);
                          }
                          break;
                          default:{
                            if(prop.type[0] === '{'){ //example:   "type": "{ [key: string]: number; }",
                              (<any>newElement)[prop.name] = JSON.parse(prop.default);
                            }else{
                              (<any>newElement)[prop.name] = prop.default;
                            }
                           
                          }
                          break;
                        }
                      }
                      break;
                      default:{
                        (<any>newElement)[prop.name] = prop.default;
                      }
                    }

                  }

                })
            },
            'p-d': ({target}) =>{
                (target as any as PDProps).on = this._viewModel.test.expectedEvent.name;
            },
            details:{'section[data-lhs]':{'json-viewer': ({target}) =>{(<any>target).data = this._viewModel.test.expectedEvent.detail;}}},
            'if-diff-then-stiff': ({target}) =>{
                (target as any as IfDiffProps).rhs = this._viewModel.test.expectedEvent.detail;
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
        return new Promise<ForInstanceViewModel>((resolve, reject) =>{
            fetch(this._href!).then(resp =>{
                resp.json().then(data =>{
                    const esi = data as ElementSetInfo;
                    const elementInfo = esi.tags?.find(tag => tag.name === this._tag);
                    if(elementInfo === undefined){
                      reject('No Element Info Found');
                      return;
                    }
                    const test$ = elementInfo.properties.find(prop => prop.name === this._contractProp)?.default as string;
                    if(test$ === undefined){
                      reject('No contract found');
                    }
                    const test = JSON.parse(test$) as Test;
                    resolve({test, elementInfo});
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
define(ForInstance);