//import {xc, PropDefMap, PropDef} from 'xtal-element/lib/XtalCore.js';
import {html} from 'xtal-element/lib/html.js';
import('pass-prop/p-p.js');
import('xtal-fetch/xtal-fetch-get.js');
import('pass-down/p-d-x.js');
import {define} from 'carbon-copy/c-c.js';
import {CCProps} from 'carbon-copy/types.d.js';
import('@alenaksu/json-viewer/build/index.js');
import('aggregator-fn/ag-fn.js');
import('ref-to/ref-to.js');
import('xt-f/xt-f.js');
import('ib-id/i-bid.js');

const mainTemplate = html`
<xtal-fetch-get fetch href={{href}}></xtal-fetch-get>
<p-d-x vft=result val-filter="$.modules.[*].declarations[?(@.tagName=='{{tag}}')]" to=[-declarations] m=1></p-d-x>
<ag-fn -declarations><script nomodule>
    ({declarations}) =>{
        return declarations[0];
    }
</script></ag-fn>
<p-d vft=value to=[-data] m=2></p-d>
<mark></mark>
<json-viewer -data></json-viewer>
<p-p from-parent-or-host observe-prop=contractProp to=[-contract-prop] m=1></p-p>
<ag-fn -data -contract-prop><script nomodule>
    ({data, contractProp}) => {
        console.log({data, contractProp});
        if(data === undefined || data.members === undefined || contractProp === undefined) return;
        const fields = data.members.filter(x=> x.kind ==='field' && !x.static);
        const propVals = {};
        for(const field of fields){
            if(field.default !== undefined){
                let val = field.default;
                if(field.type !== undefined && field.type.text !== undefined){
                    switch(field.type.text){
                        case 'boolean':
                            val = val === 'true';
                            break;
                        case 'object':
                            val = eval('(' + val + ')'); //yikes
                            break;
                    }
                }
                propVals[field.name] = val;
            } 

        }
        console.log({propVals});
        const contract = fields.filter(x => x.name===contractProp && x.kind ==='field');
        console.log(contract);
        console.log(contract[0].default);
    }
</script></ag-fn>
<ref-to a={{tag}}></ref-to>
<p-d vft=deref to=[-piped-chunk] m=1></p-d>
<xt-f -piped-chunk></xt-f>
<i-bid -list><p-d></p-d></i-bid>
<!-- <p-d from=main to=details care-of=[-data] val=detail m=1></p-d>
<p-d from=main to=[-lhs] val=detail m=2></p-d>  -->


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
`;
define('for-instance', mainTemplate, {
    stringProps: ['tag', 'href', 'contractProp'],
    boolProps: ['skipImports']
} as CCProps);

// /** */
// export class ForInstance extends HTMLElement{
//     static is = 'for-instance';

// }
// const baseProp: PropDef = {
//     dry: true,
//     async: true,
// }
// const strProp1: PropDef = {
//     ...baseProp,
//     type: String,
// }
// const boolProp1: PropDef = {
//     ...baseProp,
//     type: Boolean,
// }
// const propDefs: PropDefMap<ForInstance> = {
//     tag: strProp1,
//     href: strProp1,
//     contractProp: strProp1,
//     skipImports: boolProp1,
// };
//xc.define(ForInstance);
//export interface ForInstance extends ForInstanceProps{}