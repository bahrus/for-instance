import { define } from 'trans-render/define.js';
import { XtallatX } from 'xtal-element/xtal-latx.js';
import { hydrate, disabled } from 'trans-render/hydrate.js';
import {ElementSetInfo} from 'api-viewer-element/src/lib/types.js';
import {Test} from './types.js';
import '@alenaksu/json-viewer/build/index.js';

const href = 'href';
const tag = 'tag';
const prop = 'prop';
const skip_imports = 'skip-imports';

export class ForInstance extends XtallatX(hydrate(HTMLElement)) {
  static get is() {
    return "for-instance";
  }

  static get observedAttributes() {
    return super.observedAttributes.concat([href, tag, prop, skip_imports]);
  }

  attributeChangedCallback(n: string, ov: string, nv: string) {
    switch (n) {
      case tag:
      case href:
      case prop:
        (<any>this)['_' + n] = nv;
        break;
      case skip_imports:
        this._skipImports = nv !== null;
        break;
    }
    this.onPropsChange();
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

  _prop: string | undefined;
  get prop(){
    return this._prop;
  }
  set prop(nv){
    this.attr(prop, nv!);
  }

  _skipImports = false;
  get skipImports(){
    return this._skipImports;
  }
  set skipImports(nv){
    this.attr(skip_imports, nv, '');
  }

  _c = false;
  connectedCallback() {
    this.propUp([href, tag, prop, 'skipImports']);
    this._c = true;
    this.onPropsChange();
  }
  sendFailure(el: HTMLElement, testName: string) {
    el.textContent = testName + " failed.";
    el.style.backgroundColor = "red";
    el.style.color = "white";
    el.setAttribute('err', '');
  }
  sendSuccess(el: HTMLElement, testName: string) {
    el.textContent = testName + " succeeded.";
    el.style.backgroundColor = "green";
    el.style.color = "white";
    el.removeAttribute('err');
    el.setAttribute('mark', '');
  }
  //from https://gist.github.com/nicbell/6081098
 compare(obj1: any, obj2: any) {
    //Loop through properties in object 1
    for (const p in obj1) {
      //Check property exists on both objects
      if (obj1.hasOwnProperty(p) !== obj2.hasOwnProperty(p)) return false;
   
      switch (typeof (obj1[p])) {
        //Deep compare objects
        case 'object':
          if (!this.compare(obj1[p], obj2[p])) return false;
          break;
        //Compare function code
        case 'function':
          if (typeof (obj2[p]) == 'undefined' || (p != 'compare' && obj1[p].toString() != obj2[p].toString())) return false;
          break;
        //Compare values
        default:
          if (obj1[p] != obj2[p]) return false;
      }
    }
   
    //Check object 2 for any extra properties
    for (var p in obj2) {
      if (typeof (obj1[p]) == 'undefined') return false;
    }
    return true;
  };

  async onPropsChange() {
    if (!this._c || this._disabled || this._href === undefined || this._prop === undefined || this._tag === undefined) return;
    this.innerHTML = '';
    const mark = document.createElement('mark');
    mark.innerHTML = `${this.tag}, for instance`;
    this.appendChild(mark);
    const resp = await fetch(this._href);
    const json =  await resp.json();
    const elementSetInfo = json as ElementSetInfo;
    const tag = elementSetInfo.tags.find(tag => tag.name === this._tag);
    if(tag === undefined) return;
    const prop = tag.properties.find(prop => prop.name === this._prop);
    if(prop === undefined) return;
    const test = JSON.parse(prop.default as string) as Test;
    const jsonViewer = document.createElement('json-viewer') as any;
    jsonViewer.data = {expectedEvent: test.expectedEvent};
    this.appendChild(jsonViewer);
    const elem = document.createElement(tag.name);
    const result = document.createElement('div');
    this.sendFailure(result, this._prop);
    elem.addEventListener(test.expectedEvent.name, e=>{
      if(test.expectedEvent.detail !== undefined){
        if(!this.compare(test.expectedEvent.detail, (<any>e).detail)) return;
        if(test.expectedEvent.associatedPropName !== undefined){
          const lhs = (<any>elem)[test.expectedEvent.associatedPropName];
          if(!this.compare(lhs, test.expectedEvent.detail) && !this.compare(lhs, test.expectedEvent.detail.value)) return;
        }
      }
      this.sendSuccess(result, this._prop!);
    });
    this.appendChild(elem);
    this.appendChild(result);
    let trigger = test.trigger;
    if(trigger != undefined){
      const scr = document.createElement('script');
      scr.type = 'module';
      if(this._skipImports){
        const split = trigger.split('\n');
        split.forEach((line, idx) =>{
          if(line.trimStart().startsWith('import ')){
            split[idx] = '//' + line;
          }
        });
        trigger = split.join('\n');
      }
      scr.innerHTML = trigger;
      document.head.appendChild(scr);
    }

  }
}

define(ForInstance);
