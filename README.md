[![Published on webcomponents.org](https://img.shields.io/badge/webcomponents.org-published-blue.svg)](https://www.webcomponents.org/element/for-instance)

<a href="https://nodei.co/npm/for-instance/"><img src="https://nodei.co/npm/for-instance.png"></a>

<img src="https://badgen.net/bundlephobia/minzip/for-instance">

# for-instance

I, *for-instance*, am cheered to see miraculous progress happening in what I call the "Swaggering of web components".

Swagger, a linchpin to making different micro-services from different teams work together, rests on the OpenAPI schema.

Likewise, work is well-underway to [define something similar](https://github.com/webcomponents/custom-elements-json/tree/schema-1) for micro-front ends in their purest form -- web components.  The [web component analyzer](https://www.npmjs.com/package/web-component-analyzer) can generate these JSON files automatically from the source code, based on JSDocs.  It includes support for documenting default values of properties, without which my mission would be impossible to fulfill.

So how do I, *for-instance*, fit in? 

My vocation and avocation is to provide a way of validating a "contract" between web components. I, *for-instance*, allow one to document the custom events that a web component emits via examples, and to "prove" that the **custom event** signatures specified in the JSON file are accurate for the specified scenarios.  

I believe there's a significant missing language (or custom element?) feature in JS that affects web components. My creator's [mother tongue supports](https://www.developer.com/net/vb/article.php/1430631/Declaring-and-Raising-Events-in-Visual-Basic-6.htm) the ability to declare "custom event" signatures spawned by the UI component in a standard way.  Such support appears to be elusive currently with JS / Custom Elements.

So I attempt to compensate for this lack of support.  I do so by running tests, as specified in the custom-elements.json file.  I treat a web component as a function of its attributes / properties / light children / user interactions, where the output of those "functions/web components" are events.  I confirm that expected events are fired matching the specified signature.  This would provide confidence that there is a [contract that consuming applications can rely on](https://martinfowler.com/articles/micro-frontends.html#Cross-applicationCommunication).

Given a vendor and language-neutral way of describing a web component could be established, it can open the doors to a whole variety of applications, including [documentation / playground support](https://api-viewer-element.netlify.com/), [I](https://github.com/Microsoft/vscode-html-languageservice/blob/master/docs/customData.md)[D](https://github.com/JetBrains/web-types)[E](https://twitter.com/webcomp_dev/status/1201901343922937856)'s,  browser extensions that work well with all web component libraries, visual designers, etc.  It could even be leveraged easily from web assembly.  Trying to do the same with JS reflection would require everyone conforming to a particular, static structure, a feat of cat-herding purrportions.


I do not attempt to test anything beyond simple input / output mechanics.  In the case of web components, often that will be a rather trivial test -- often events are simply fired when a property changes.  Typically, in practice, that property will change due to a user action, like clicking on an internal button.  
## Syntax

```html
    <for-instance href="https://unpkg.com/xtal-frappe-chart@0.0.35/html.json"></for-instance>

    <for-instance href="https://unpkg.com/xtal-fetch@0.0.64/html.json"></for-instance>
```


If you view the links specified by the href attributes above, you will see the JSON contains test information.  I then run those tests, which allows the user to a)  See the actual web component display some default, sample content (if applicable), and b)  Validate any tests (if available)


## Demo

<!--
```
<custom-element-demo>
<template>
    <div>
        <for-instance href="https://unpkg.com/xtal-fetch@0.0.72/html.json"></for-instance>

        <for-instance href="https://unpkg.com/xtal-frappe-chart@0.0.44/custom-elements.json"></for-instance>

        <script defer src="https://cdn.jsdelivr.net/npm/es-module-shims@0.2.7/dist/es-module-shims.js"></script>
        <script type="importmap-shim">
        {
            "imports": {
                
                "xtal-element/": "https://cdn.jsdelivr.net/npm/xtal-element@0.0.82/",
                "trans-render/": "https://cdn.jsdelivr.net/npm/trans-render@0.0.131/",
                "if-diff/": "https://cdn.jsdelivr.net/npm/if-diff@0.0.36/",
                "p-et-alia/": "https://cdn.jsdelivr.net/npm/p-et-alia@0.0.44/",
                "wc-info": "https://cdn.jsdelivr.net/npm/wc-info@0.0.65/",
                "swag-tag/": "https://cdn.jsdelivr.net/npm/swag-tag@0.0.3/",
                "event-switch/": "https://cdn.jsdelivr.net/npm/event-switch@0.0.12/",
                "hypo-link/": "https://cdn.jsdelivr.net/npm/hypo-link@0.0.14/",
                "p-et-alia/": "https://cdn.jsdelivr.net/npm/p-et-alia@0.0.44/",
                "xtal-json-editor/": "https://cdn.jsdelivr.net/npm/xtal-json-editor/",
                "xtal-text-input-md/": "https://cdn.jsdelivr.net/npm/xtal-text-input-md/",
                "xtal-checkbox-input-md/": "https://cdn.jsdelivr.net/npm/xtal-checkbox-input-md/",
                "xtal-text-area-md/": "https://cdn.jsdelivr.net/npm/xtal-text-area-md/"
            }
        }
        </script>
        <script  type="module-shim">
            import 'https://cdn.jsdelivr.net/npm/for-instance@0.0.5/for-instance.js';
        </script>
    </div>
</template>
</custom-element-demo>
```
-->

## Tentative Schema

```TypeScript
export interface WCSuiteInfo {
  tags: WCInfo[];
}

export interface WCInfo extends Info {
  selfResolvingModulePath: string | undefined;
  attributes: AttribInfo[] | undefined;
  customEvents: CustomEventInfo[] | undefined;
  properties: PropertyInfo[] | undefined;
  testCaseNames: string[] | undefined;
}

export interface Info {
  name: string;
  description: string;
}

export interface AttribInfo extends Info {
  defaultValue: string | undefined;
  /**
   * key = test name
   * val = test attribute value
   */
  testValues: { [key: string]: string } | undefined;
  values: Info[] | undefined;
}

export interface PropertyInfo extends Info {
  type: string | undefined;
  defaultValue: any;
  /**
   * key = test name
   * val = test prop value
   */
  testValues: { [key: string]: any } | undefined;
}
export interface CustomEventDetailProperty extends Info {
  type: string | undefined;
  testValue: any | undefined;
}

export interface CustomEventInfo extends Info {
  detail: CustomEventDetailProperty[];
  /**
   * Event fires when this property changes
   */
  associatedPropName: string;
  testExpectedValues: { [key: string]: CustomEventInfo[] } | undefined;
}


```

## Viewing Your Element (locally)

```
$ npm run serve
```

