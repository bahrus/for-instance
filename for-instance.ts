import { define } from "trans-render/define.js";
import { XtallatX } from "xtal-element/xtal-latx.js";
import {hydrate} from 'trans-render/hydrate.js';


export class ForInstance extends XtallatX(hydrate(HTMLElement)){
    static get is(){return 'for-instance';}

    _href: string | null = null;
    get href() {
      return this._href;
    }
    set href(nv) {
      this.attr("href", nv!);
    }
}

define(ForInstance);