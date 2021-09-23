import { def } from 'd-fine/def.js';
import { html } from 'trans-render/lib/html.js';
import('wc-info/wc-info-fetch.js');
import('pass-prop/p-p.js');
import('pass-down/p-d.js');
import('xtal-editor/src/xtal-editor.js');
import('ib-id/i-bid.js');
const mainTemplate = html `
<p-p observe-host vft=href to=[-href] m=1></p-p>
<p-p observe-host vft=tag to=[-tag] m=1></p-p>
<wc-info-fetch fetch -href -tag></wc-info-fetch>
<p-d vft to=[-pack] m=1></p-d>
<p-d vft=customElement to=[-value] m=1></p-d>
<p-d vft=customElement to=[-custom-element] m=1></p-d>
<p-p vft=tag to=[-text-content] m=1></p-p>
<p-p vft=tag to=[-tag] m=1></p-p>
<mark -text-content></mark>
<xtal-editor read-only -value open></xtal-editor>
<p-p from-parent-or-host observe-prop=contractProp to=[-contract-prop] m=1></p-p>
<p-p from-parent-or-host observe-prop=skipImports to=[-skip-imports] m=1></p-p>
<ag-fn -custom-element  -tag ><script nomodule>
    ({customElement, tag}) => {
        if(customElement === undefined) return;
        const events = data.events;
        if(events === undefined) return;
        const returnObj = events.map(event  => ({
            event: event,
            tag: tag,
        }));
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
<p-d on=expected-event-changed to=[-rhs] m=2 vft=expectedEvent.detail></p-d>
<p-d on=expected-event-changed to=[-iff] m=2 vft=expectedEvent.detail></p-d>
<p-d on=expected-event-changed to=details.expected care-of=[-data] m=1 vft=expectedEvent.detail></p-d>
<ref-to a={{tag}}></ref-to>
<p-d vft=deref to=[-piped-chunk] m=1></p-d>
<xt-f -piped-chunk></xt-f>
<i-bid -list tag=target-listeners></i-bid>



<details>
    <summary>Event Details</summary>
    <section class=expected>
        <h4>Expected Event Detail</h4>
        <json-viewer -data>{}</json-viewer>
    </section>
    <section>
        <h4>Actual Event Detail</h4>
        <json-viewer -data>{}</json-viewer>
    </section>
</details>
<if-diff -iff -lhs equals -rhs>
    <template>
        <div mark style="background-color: green; color: white;">Event specified by contract detected.</div>
    </template>
</if-diff>
<if-diff -iff -lhs not-equals -rhs>
    <template>
        <div err style="background-color: red; color: white;">Event specified by contract not detected.</div>
    </template>
</if-diff>
`;
def(mainTemplate, [], {}, true, {
    config: {
        tagName: 'for-instance',
        propDefaults: {
            tag: '',
            href: '',
            contractProp: ''
        }
    }
});
