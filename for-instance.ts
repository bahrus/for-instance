import { define } from "trans-render/define.js";
import { XtallatX } from "xtal-element/xtal-latx.js";
import {hydrate, disabled} from 'trans-render/hydrate.js';
import {WCSuiteInfo} from 'wc-info/types.d.js';

const href = 'href';
export class ForInstance extends XtallatX(hydrate(HTMLElement)){
    static get is(){return 'for-instance';}

    static get observedAttributes(){
        return super.observedAttributes.concat([href]);
    }

    attributeChangedCallback(n: string, ov: string, nv: string){
        switch(n){
            case href:
                this._href = nv;
                break;
        }
        this.onPropsChange();
    }

    _href: string | null = null;
    get href() {
      return this._href;
    }
    set href(nv) {
      this.attr("href", nv!);
    }

    

    _c = false;
    connectedCallback(){
        this._c = true;
        this.onPropsChange();
    }

    onPropsChange(){
        if(!this._c || this._disabled || !this._href) return; 
        fetch(this._href).then(resp =>{
            resp.json().then(json =>{
                const wcSuiteInfo = json as WCSuiteInfo;
                wcSuiteInfo.tags.forEach(tag => {
                    if(tag.selfResolvingModulePath) import(tag.selfResolvingModulePath);
                    if(tag.testCaseNames !== undefined){
                        tag.testCaseNames.forEach(testCaseName =>{
                            const tagInstance = document.createElement(tag.name);
                            if(tag.attributes !== undefined){
                                tag.attributes.forEach(attrib =>{
                                    if(attrib.testValues !== undefined){
                                        if(attrib.testValues[testCaseName] !== undefined){
                                            tagInstance.setAttribute(attrib.name, attrib.testValues[testCaseName])
                                        }
                                    }
                                })
                            }
                            if(tag.properties !== undefined){
                                tag.properties.forEach(prop =>{
                                    if(prop.testValues !== undefined){
                                        const propTestVal = prop.testValues[testCaseName];
                                        if(propTestVal !== undefined){
                                            (<any>tagInstance)[prop.name] = propTestVal;
                                        }
                                    }
                                })
                            }
                            this.appendChild(tagInstance);
                        });
                    }else{
                        const tagInstance = document.createElement(tag.name);
                        this.appendChild(tagInstance);
                    }
                    
                })
                
            })
        })
    }
}

define(ForInstance);