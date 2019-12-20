import { define } from "trans-render/define.js";
import { XtallatX } from "xtal-element/xtal-latx.js";
import { hydrate, disabled } from "trans-render/hydrate.js";
import {ElementSetInfo} from 'api-viewer-element/src/lib/types.js';
// import "if-diff/if-diff.js";
// import "p-et-alia/p-d.js";

const href = 'href';
const tag = 'tag';
const prop = 'prop';

export class ForInstance extends XtallatX(hydrate(HTMLElement)) {
  static get is() {
    return "for-instance";
  }

  static get observedAttributes() {
    return super.observedAttributes.concat([href, tag, prop]);
  }

  attributeChangedCallback(n: string, ov: string, nv: string) {
    switch (n) {
      case tag:
      case href:
      case prop:
        (<any>this)['_' + n] = nv;
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

  _c = false;
  connectedCallback() {
    this.propUp([href, tag]);
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
    if (!this._c || this._disabled || this._href === undefined || this._prop === undefined || this._tag === undefined) return;
    fetch(this._href).then(resp => {
      resp.json().then(json => {
        const elementSetInfo = json as ElementSetInfo;
        const tag = elementSetInfo.tags.find(tag => tag.name === this._tag);
        if(tag === undefined) return;
        const prop = tag.properties.find(prop => prop.name === this._prop);
        if(prop === undefined) return;
        const contract = JSON.parse(prop.default as string);
        const elem = document.createElement(tag.name);
        elem.addEventListener(contract.expectedEvent.name, e=>{
          debugger;
        })
        this.appendChild(elem);
        const trigger = contract.trigger;
          if(trigger != undefined){
            const scr = document.createElement('script');
            scr.type = 'module'
            scr.innerHTML = trigger;
            document.head.appendChild(scr);
          }
        })

      });
    });
  }
}

define(ForInstance);
