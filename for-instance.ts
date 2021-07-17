import { XtalFetchViewElement, AttributeProps, mergeProps, define, TransformValueOptions, PSettings, RenderContext } from 'xtal-element/XtalFetchViewElement.js';
import { ElementInfo, ElementSetInfo } from 'api-viewer-element/src/lib/types.js';
import { createTemplate } from 'trans-render/createTemplate.js';
import { PDProps } from 'p-et-alia/types.d.js';
import { IfDiffProps } from 'if-diff/types.d.js';
import { ForInstanceViewModel, Test, ForInstanceProps } from './types.js';
import { prependTag } from 'trans-render/prependTag.js';



//const href = 'href';
const tag = 'tag';
const contract_prop = 'contract-prop';
const skip_imports = 'skip-imports';
/**
 * Test instances of custom element for custom event signature contracts.
 * @element for-instance
 */
export class ForInstance extends XtalFetchViewElement<ForInstanceViewModel>{
  constructor() {
    super();
    import('p-et-alia/p-d.js');
    import('if-diff/if-diff-then-stiff.js');
    import('@alenaksu/json-viewer/build/index.js');
  }
  
  static is = 'for-instance';



  noShadow = true;



  static attributeProps = ({skipImports, tag, contractProp}: ForInstance) =>{
    const ap = {
      bool: [skipImports],
      str: [tag, contractProp],
      reflect: [skipImports, tag, contract_prop]
    } as AttributeProps;
    return mergeProps(ap, XtalFetchViewElement.props) as AttributeProps;
  }

  get readyToInit() {
    return super.readyToInit && this.tag !== undefined && this.contractProp !== undefined;
  }

  filterInitData(data: any){
    const esi = data as ElementSetInfo;
    const elementInfo = esi.tags?.find(tag => tag.name === this.tag);
    if (elementInfo === undefined) {
      
      // reject('No Element Info Found');
      return {test: {} as Test, elementInfo: {} as ElementInfo};
      //TODO
    }
    const test$ = elementInfo.properties.find(prop => prop.name === this.contractProp)?.default as string;
    if (test$ === undefined) {
      return {test: {} as Test, elementInfo: {} as ElementInfo};
      //reject('No contract found');
      //TODO
    }
    const test = JSON.parse(test$) as Test;
    return { test, elementInfo };
  }


  get readyToRender(){
    if(this.viewModel === undefined) return false;
    let trigger = this.viewModel.test.trigger;
    if (trigger != undefined) {
      const scr = document.createElement('script');
      scr.type = 'module';
      if (this.skipImports) {
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

  get initTransform(){
    return {
      mark: this.tag! + ', for instance.',
      'json-viewer': [{innerHTML: JSON.stringify(this.viewModel)}]  as PSettings<Partial<HTMLElement>>,
      main: ({ target }: RenderContext<HTMLElement>) => {
        const newElement = prependTag(target!, this.tag!, [,,{disabled:'2'}], {});
        this.viewModel.elementInfo.properties.forEach(prop => {
          if (prop.default !== undefined) {
            switch (typeof prop.default) {
              case 'string':
                if(typeof(prop.type) === 'string'){
                  if(prop.type.indexOf('=>') > -1){
                    return;
                  }
                }
                switch (prop.type) {
                  case 'string':
                  case 'object':
                  case undefined:
                    (<any>newElement)[prop.name] = JSON.parse(prop.default);
                    break;
                  default:
                    if (prop.type[0] === '{') { //example:   "type": "{ [key: string]: number; }",
                      (<any>newElement)[prop.name] = JSON.parse(prop.default);
                    } else {
                      (<any>newElement)[prop.name] = prop.default;
                    }
                }
                break;
              default:
                (<any>newElement)[prop.name] = prop.default;
            }

          }

        })
      },
      '"':{
        'p-d':[{on: this.viewModel.test.expectedEvent.name}] as PSettings<PDProps>,
      },
      details: {
        'section[data-lhs]': {
          'json-viewer': [{innerHTML: JSON.stringify(this.viewModel.test.expectedEvent.detail)}]  as PSettings<Partial<HTMLElement>>
        }
      },
      'if-diff-then-stiff': [{rhs: this.viewModel.test.expectedEvent.detail}] as PSettings<IfDiffProps>
    } as TransformValueOptions
  }

}

export interface ForInstance extends ForInstanceProps{}

define(ForInstance);

declare global {
  interface HTMLElementTagNameMap {
    "for-instance": ForInstance,
  }
}