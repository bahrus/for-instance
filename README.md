[![Published on webcomponents.org](https://img.shields.io/badge/webcomponents.org-published-blue.svg)](https://www.webcomponents.org/element/for-instance)

<a href="https://nodei.co/npm/for-instance/"><img src="https://nodei.co/npm/for-instance.png" alt="for-instance npm"></a>

<img src="https://badgen.net/bundlephobia/minzip/for-instance" alt="size">

[![Actions Status](https://github.com/bahrus/for-instance/workflows/CI/badge.svg)](https://github.com/bahrus/for-instance/actions?query=workflow%3ACI)

# INTRODUCTION

I, *for-instance*, am cheered to see the miraculous [arrival](https://custom-elements-manifest.open-wc.org/) of what I call the "[Swaggering](https://swagger.io/) of web components".

Swagger, a linchpin to making different [micro-services work together](https://swagger.io/blog/api-strategy/microservices-apis-and-swagger/), rests on the OpenAPI schema.

## [Demo](https://codepen.io/bahrus/pen/xxdrgde)

<!--
```
<custom-element-demo>
  <template>
    <for-instance 
        href=https://cdn.skypack.dev/xtal-frappe-chart@0.0.90/custom-elements.json 
        tag=xtal-frappe-chart-example1 
        contract-prop=selectedElementContract
    ></for-instance>
    <script type=module crossorigin>
        import 'https://cdn.skypack.dev/for-instance?min';
    </script> 
  </template>
</custom-element-demo>
```
-->




Likewise, work that can unite the web component community has now become a fait accompli (but continuing to improve) for micro-frontends in their purest form -- web components.  The [custom element manifest analyzer](https://custom-elements-manifest.open-wc.org/analyzer/getting-started/) can generate these JSON files automatically from the source code, based on JSDocs.  It includes support for documenting default values of properties, without which my mission would be impossible to fulfill.

So how do I, *for-instance*, fit in? 

My vocation and avocation is to provide a way of validating a "contract" between web components. I suggest a way to document the structure of custom events that a web component emits via examples, and to "prove" that the custom event signatures specified in the JSON file are accurate for relevant scenarios.

## NO COMMON EVENT PROPERTY

I believe there's a significant missing language (or custom element?) feature in JS that affects web components. My creator's [mother tongue supports](https://www.developer.com/net/vb/article.php/1430631/Declaring-and-Raising-Events-in-Visual-Basic-6.htm) the ability to declare "custom event" signatures spawned by the UI component in a standard way.  Such support appears to be elusive currently with JS / Custom Elements.

## WHAT TO DO?

So I attempt to compensate for this lack of support.  I do so by running tests, as specified in a companion json file.  I treat a web component as a function of its attributes / properties / light children / user interactions, where the output of those "functions/web components" are events.  I confirm that expected events are fired matching the specified signature.  This would provide confidence that there is a [contract that consuming applications can rely on](https://martinfowler.com/articles/micro-frontends.html#Cross-applicationCommunication).

I do not attempt to test anything beyond simple input / output mechanics.  In the case of web components, often that will be a rather trivial test -- often events are simply fired when a property changes.  Typically, in practice, that property will change due to a user action, like clicking on an internal button. 


## [SYNTAX GALORE](https://bahrus.github.io/api-viewer/index.html?npmPackage=for-instance&jsPath=for-instance.js&jsonPath=custom-elements.json)


I, *for-instance,* don't impose much, if any, requirements on the original custom element definition -- only that it adhere to whatever best practices are in place to promote self-documentation -- JSDocs with [special notation applicable](https://www.npmjs.com/package/web-component-analyzer#%E2%9E%A4-how-to-document-your-components-using-jsdoc) to web components. I don't want to impose any overhead on the payload size of the component itself.

But web components can be easily extended.

Let's take the example of, xtal-frappe-chart, with class XtalFrappeChart.  It contains no default data, so adding an instance of xtal-frappe-chart, without specifying what data to chart, doesn't do anything.  Nothing will come of nothing.

To provide some sample data, why not extend the base class?:




```TypeScript
/**
 * @element xtal-frappe-chart
 */
export class XtalFrappeChartExample1 extends XtalFrappeChart {
    data = {
        title: "My Awesome Chart",
        data: {
            labels: ["12am-3am", "3am-6am", "6am-9am", "9am-12pm",
                "12pm-3pm", "3pm-6pm", "6pm-9pm", "9pm-12am"],
            datasets: [
                {
                    name: "Some Data", "color": "light-blue",
                    values: [25, 40, 30, 35, 8, 52, 17, -4]
                },
                {
                    name: "Another Set", "color": "violet",
                    values: [25, 50, 10, 15, 18, 32, 27, 14]
                },
                {
                    name: "Yet Another", "color": "blue",
                    values: [15, 20, 3, -15, 58, 12, -17, 37]
                }
            ]
        } as TabularData,
        type: "bar",
        height: 250,
        isNavigable: true
    } as ChartOptions
}
```

Doing so results in the web component analyzer tool capturing this default value in the auto-generated json file (also kept separate - recommended file name:  xtal-frappe-chart-example1.json).  

I take this JSON file, and create an instance of xtal-frappe-chart, and assign the properties as specified by the auto generated json file.

But this still doesn't answer the question of how to document the structure of custom events the web component spawns.  

I, *for-instance*, also think that there is often a tight correlation between such events, and a read-only property associated with the event, where the value is also stored.

To support this approach, I provide an interface to add course-grained properties onto the example component.  In TypeScript notation:

```TypeScript
export interface ExpectedEvent{
    /** 
     * Name (or "type") of (custom) event 
     */
    name: string,
    /**
     * detail object passed in custom event
     */
    detail?: any,
    /**
     * (Read-only) property where detail object is stored
     */
    associatedPropName?:  string,
}

export interface Test{
    /**
     * Script needed to invoke event, including simulation of user-triggered events
     */
    trigger?: string,
    /**
     * Optional inner HTML (light children) to use
     */
    innerHTML?: string,
    /**
     * Event expected to be fired (possibly as a result of running the script specified by trigger property.)
     */
    expectedEvent: ExpectedEvent,
}
```


The above structure is quite general.  But TypeScript now provides enough hooks where specific events can be enumerated, building on top of the general structure above.

We define the contract as follows, which the [web component analyzer](https://www.npmjs.com/package/web-component-analyzer) is able to serialize perfectly into JSON:

```TypeScript
/**
 * @element xtal-frappe-chart
 */
export class XtalFrappeChartExample1 extends XtalFrappeChart {
    
    ...

    selectedElementContract: XtalFrappeChartTest<'selected-element-changed', 'selectedElement'> = {
        trigger: /* JS */`
        import 'https://unpkg.com/xtal-shell@0.0.25/$hell.js?module';
        import 'https://unpkg.com/xtal-frappe-chart@0.0.58/xtal-frappe-chart-example1.js?module';
        setTimeout(() =>{
            $hell.$0=document.querySelector('xtal-frappe-chart-example1');
            $hell.cd('div#target/div/svg/g[0]/g[2]/rect[2]');
            setTimeout(() =>{
              $hell.$0.dispatchEvent(new Event('click'));
            }, 500);
            
          }, 3000);
        `,
        expectedEvent:{
            name: 'selected-element-changed',
            detail: {
                value: {
                    values: [30, 10, 3],
                    label: "6am-9am",
                    index: 2,
                }
            },
            associatedPropName: 'selectedElement'
        }
    }
}
```

where:

```TypeScript
export interface SelectedElement {
    label: string;
    values: any[];
    index: number;
}

export interface SelectedElementEventDetail {
    value: SelectedElement
}

export interface XtalFrappeChartEventNameMap {
    'selected-element-changed': SelectedElementEventDetail;
}


export interface XtalFrappeChartIfc{
    data: ChartOptions;
    readonly selectedElement: object,
}

interface XtalFrappeChartExpectedEvent<eventName extends keyof XtalFrappeChartEventNameMap, assocPropName extends keyof XtalFrappeChartIfc> extends ExpectedEvent{
    name: eventName,
    detail?: XtalFrappeChartEventNameMap[eventName],
    associatedPropName?: assocPropName,
}
interface XtalFrappeChartTest<eventName extends keyof XtalFrappeChartEventNameMap, assocPropName extends keyof XtalFrappeChartIfc> extends Test{
    trigger?: string,
    expectedEvent: XtalFrappeChartExpectedEvent<eventName, assocPropName>,
};
```

Even if you don't use all this fanatical typing with TypeScript, but stick to JavaScript, following the structure of tests above, resulting in JSON samples, [tools](https://jvilk.com/MakeTypes/) can be utilized to convert that JSON into TypeScript.


Having created a test / example extending web component, I can now bind to it:

```html
  <for-instance 
    href=https://unpkg.com/xtal-frappe-chart@0.0.60/xtal-frappe-chart-example1.json
    contract-prop=selectedElementContract
    tag=xtal-frappe-chart
></for-instance>
```

If you view the links specified by the href attributes above, you will see the JSON contains test information.  I then run those tests, which allow the user to a)  See the actual web component display some default, sample content (if applicable), and b)  Validate any tests (if available)

If the expected event is observed, I emit a child tag:


```html
<div mark style="background-color: green; color: white;">selectedElementContract succeeded.</div>
```

If it doesn't fire, I give a failing grade:

```html
<div err style="background-color: red; color: white;">selectedElementContract failed.</div>
```


In fact, I assume, initially, the test *will* fail, so you might see the red tag appear for a bit, until I see the expected event, at which point I switch colors.  Guilty until proven innocent.



## Viewing for-instance locally

```
$ npm install
$ npm run serve
```

