import { define } from 'trans-render/define.js';
import {XtalViewElement} from 'xtal-element/xtal-view-element.js';
import {ElementSetInfo} from 'api-viewer-element/src/lib/types.js';
import {createTemplate} from 'xtal-element/utils.js';

const mainTemplate = createTemplate(/* html */`
<mark></mark>
`);
const href = 'href';
const tag = 'tag';
const contract_prop = 'contract-prop';
const skip_imports = 'skip-imports';
export class ForInstance2 extends XtalViewElement<ElementSetInfo>{
    static get is() {
        return 'for-instance2';
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

    async init(){
        return new Promise<ElementSetInfo>(resolve =>{
            fetch(this._href!).then(resp =>{
                resp.json().then(data =>{
                    resolve(data as ElementSetInfo);
                })
            })
        })
    }

    async update(){
        this.innerHTML = '';
        return this.init();
    }

    get readyToInit(){
        return this._href !== undefined;
    }
}
define(ForInstance2);