[![Published on webcomponents.org](https://img.shields.io/badge/webcomponents.org-published-blue.svg)](https://www.webcomponents.org/element/for-instance)

<a href="https://nodei.co/npm/for-instance/"><img src="https://nodei.co/npm/for-instance.png"></a>

<img src="https://badgen.net/bundlephobia/minzip/for-instance">

# for-instance

I, *for-instance*, dream of serving as the Swagger of web components.  Or at least cheering on such a thing from those with more clout.

Whereas Swagger rests on the OpenAPI schema, I validate a "contract," specified via the [wc-info schema](https://github.com/bahrus/wc-info), which is itself an extension of the (fledgling) VSCode [schema support for web components](https://code.visualstudio.com/updates/v1_31#_html-and-css-custom-data-support).  

My most important mission is to allow one to "prove" that the custom event signatures specified in the json file are accurate.  I believe that there's a significant missing language (or custom element?) feature in JS that affects web components. My creator's [mother tongue supports](https://www.developer.com/net/vb/article.php/1430631/Declaring-and-Raising-Events-in-Visual-Basic-6.htm) the ability to declare "custom event" signatures spawned by the UI component in a standard way.  Such support appears to be elusive currently with JS / Custom Elements.

So I attempt to compensate for this lack of support.  I do so by running tests, as specified in the html.json file.  I treat a web component as a function of its attributes / properties (and light children, soon), where the output of those functions are events, and confirm that expected events are fired matching the specified signature.  This would provide confidence that there is a [contract that consuming applications can rely on](https://martinfowler.com/articles/micro-frontends.html#Cross-applicationCommunication).

If a vendor and language-neutral way of describing a web component could be established, it would open the doors to a whole variety of applications, including browser extensions that work well with all web component libraries, visual designers, etc.  It could even be leveraged easily from web assembly.  Trying to do the same with JS reflection would require everyone conforming to a particular, static structure, a feat of cat-herding purrportions.

It seems likely such a file could be used to generate a typescript *.d.ts which could be added to the definitelyTyped repository, and maybe even approach the clarity of my creator's mother tongue.

I do not attempt to test anything beyond simple input / output mechanics.  In the case of web components, often that will be a rather trivial test -- often events are simply fired when a property changes.  Typically, in practice, that property will change due to a user action, like clicking on an internal button.  So one way to test that is simply to pass an object to the property, and confirm that the corresponding event fires. Almost guaranteed to succeed. I support that without any additional automation tooling.  More sophisticated tests could build on that, and automate user events in some way, which would trigger similar events.

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

