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
import('if-diff/if-diff.js');

const mainTemplate = html`
<xtal-fetch-get fetch href={{href}}></xtal-fetch-get>
<p-d-x vft val-filter="$.modules.[*].declarations[?(@.tagName=='{{tag}}')]" to=[-declarations] m=1></p-d-x>
<ag-fn -declarations><script nomodule>
    ({declarations}) =>{
        return declarations[0];
    }
</script></ag-fn>
<p-d vft to=[-data] m=3></p-d>
<mark></mark>
<json-viewer -data></json-viewer>
<p-p from-parent-or-host observe-prop=contractProp to=[-contract-prop] m=1></p-p>
<p-p from-parent-or-host observe-prop=skipImports to=[-skip-imports] m=1></p-p>
<ag-fn -data  tag='"{{tag}}"' ><script nomodule>
    ({data, tag}) => {
        if(data === undefined) return;
        const events = data.events;
        console.log({data, events, tag});
        if(events === undefined) return;
        const returnObj = events.map(event  => ({
            event: event,
            tag: tag,
        }));
        console.log(returnObj);
        return returnObj;
    }
</script></ag-fn>
<p-d vft to=[-list] m=1></p-d>
<ag-fn -data -contract-prop -skip-imports><script nomodule>
    ({data, contractProp, skipImports, self}) => {
        if(data === undefined || data.members === undefined || contractProp === undefined) return;
        const fields = data.members.filter(x=> x.kind ==='field' && !x.static && !(x.privacy==='private'));
        const propVals = {};
        for(const field of fields){
            if(field.default !== undefined){
                let val = field.default;
                if(field.type !== undefined && field.type.text !== undefined){
                    switch(field.type.text){
                        case 'boolean':
                        case 'number':
                            val = JSON.parse(val);
                            break;
                        case 'string':
                        case 'object':
                            val = eval('(' + val + ')'); //yikes
                            break;
                        case 'number':
                            val = parse
                    }
                }
                propVals[field.name] = val;
            } 

        }
        const contracts = fields.filter(x => x.name===contractProp && x.kind ==='field');
        if(contracts.length === 1){
            const defaultVal = contracts[0].default;
            if(defaultVal !== undefined){
                const defaultObj = eval('(' + defaultVal + ')');
                let trigger = defaultObj?.trigger;
                if(skipImports){
                    const split = trigger.split('\\n');
                    split.forEach((line, idx) => {
                        if (line.trim().startsWith('import ')) {
                            split[idx] = '//' + line;
                        }
                    });
                    trigger = split.join('\\n');
                }
                if(trigger !== undefined){
                    const scr = document.createElement('script');
                    scr.type = 'module';
                    scr.innerHTML = trigger;
                    document.head.appendChild(scr);
                }
                console.log(defaultObj.expectedEvent);
                console.log(self);
                self.expectedEvent = defaultObj.expectedEvent;
                self.dispatchEvent(new CustomEvent('expected-event-changed',{
                    detail: {
                        value: self.expectedEvent,
                    }
                }));
            }
        }
        return propVals;
    }
</script></ag-fn>
<p-d vft to={{tag}} prop=...></p-d>
<p-d vft=expectedEvent to=[-rhs]></p-d>
<ref-to a={{tag}}></ref-to>
<p-d vft=deref to=[-piped-chunk] m=1></p-d>
<xt-f -piped-chunk></xt-f>
<i-bid -list tag=target-listeners></i-bid>
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
<if-diff iff -lhs equals -rhs>
    <template>
        <div mark style="background-color: green; color: white;">Event specified by contract detected.</div>
    </template>
</if-diff>
<if-diff iff -lhs not_equals -rhs>
    <template>
        <div err style="background-color: red; color: white;">Event specified by contract not detected.</div>
    </template>
</if-diff>
`;
define('for-instance', mainTemplate, {
    stringProps: ['tag', 'href', 'contractProp'],
    boolProps: ['skipImports'],
    noshadow: true
} as CCProps);

const targetListenersTemplate = html`
    <p-d on={{event.name}} observe={{tag}} from=target-listeners to=details care-of=[-data] val=detail m=1></p-d>
    <p-d on={{event.name}} observe={{tag}} from=target-listeners to=[-lhs] val=detail m=2></p-d>
`;
define('target-listeners', targetListenersTemplate, {
    objProps: ['event'],
    stringProps: ['tag'],
    noshadow: true,
} as CCProps);
