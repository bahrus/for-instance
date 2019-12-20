[![Published on webcomponents.org](https://img.shields.io/badge/webcomponents.org-published-blue.svg)](https://www.webcomponents.org/element/for-instance)

<a href="https://nodei.co/npm/for-instance/"><img src="https://nodei.co/npm/for-instance.png"></a>

<img src="https://badgen.net/bundlephobia/minzip/for-instance">

# I, FOR-INSTANCE

I, *for-instance*, am cheered to see miraculous progress happening in what I call the "[Swaggering](https://swagger.io/) of web components".

Swagger, a linchpin to making different [micro-services from different teams work together](https://swagger.io/blog/api-strategy/microservices-apis-and-swagger/), rests on the OpenAPI schema.

## INNUMERABLE ANTECEDENTS

Likewise, work is well-underway to [define something similar](https://github.com/webcomponents/custom-elements-json/tree/schema-1) for micro-front ends in their purest form -- web components.  The [web component analyzer](https://www.npmjs.com/package/web-component-analyzer) can generate these JSON files automatically from the source code, based on JSDocs.  It includes support for documenting default values of properties, without which my mission would be impossible to fulfill.

So how do I, *for-instance*, fit in? 

My vocation and avocation is to provide a way of validating a "contract" between web components. I suggest a way to document the structure of custom events that a web component emits via examples, and to "prove" that the **custom event** signatures specified in the JSON file are accurate for relevant scenarios.  

I believe there's a significant missing language (or custom element?) feature in JS that affects web components. My creator's [mother tongue supports](https://www.developer.com/net/vb/article.php/1430631/Declaring-and-Raising-Events-in-Visual-Basic-6.htm) the ability to declare "custom event" signatures spawned by the UI component in a standard way.  Such support appears to be elusive currently with JS / Custom Elements.

## NO MASTER MIND -- WHAT TO DO?

So I attempt to compensate for this lack of support.  I do so by running tests, as specified in a companion custom-elements.json file.  I treat a web component as a function of its attributes / properties / light children / user interactions, where the output of those "functions/web components" are events.  I confirm that expected events are fired matching the specified signature.  This would provide confidence that there is a [contract that consuming applications can rely on](https://martinfowler.com/articles/micro-frontends.html#Cross-applicationCommunication).

If a vendor and language-neutral way of describing a web component could be established, it can open the doors to a whole variety of applications, including [documentation / playground support](https://api-viewer-element.netlify.com/), [I](https://github.com/Microsoft/vscode-html-languageservice/blob/master/docs/customData.md)[D](https://github.com/JetBrains/web-types)[E](https://twitter.com/webcomp_dev/status/1201901343922937856)'s,  browser extensions that work well with all web component libraries, visual designers, etc.  It could even be leveraged easily from web assembly.  Trying to do the same with JS reflection would require everyone conforming to a particular, static structure, a feat of cat-herding purrportions.

I do not attempt to test anything beyond simple input / output mechanics.  In the case of web components, often that will be a rather trivial test -- often events are simply fired when a property changes.  Typically, in practice, that property will change due to a user action, like clicking on an internal button. 


## SYNTAX GALORE

I, *for-instance* don't impose much, if any, requirements on the original custom element definition -- only that it adhere to whatever best practices are in place to promote self-documentation -- JSDocs with [special notation applicable](https://www.npmjs.com/package/web-component-analyzer#%E2%9E%A4-how-to-document-your-components-using-jsdoc) to web components. I don't want to impose any overhead on the payload size of the component itself.

But web components can be easily extended.

For example, suppose you define

```html
      <for-instance 
        href=https://unpkg.com/xtal-frappe-chart@0.0.60/custom-elements-example1.json
        prop=selectedElementContract
        tag=xtal-frappe-chart-example1
    ></for-instance>
```


If you view the links specified by the href attributes above, you will see the JSON contains test information.  I then run those tests, which allows the user to a)  See the actual web component display some default, sample content (if applicable), and b)  Validate any tests (if available)




## Viewing for-instance locally

```
$ npm run serve
```

