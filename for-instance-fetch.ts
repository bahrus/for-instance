import {WCInfoFetch, propActions as WCInfoFetchPropActions, str1, obj1, obj2} from 'wc-info/wc-info-fetch.js';
import {xc, PropDef, PropDefMap, PropAction} from 'xtal-element/lib/XtalCore.js';

export class ForInstanceFetch extends WCInfoFetch{
    static is = 'for-instance-fetch';
    propActions = propActions
}

export const propActions = [
    ...WCInfoFetchPropActions,

] as PropAction[];

xc.define(ForInstanceFetch);