# for-instance

for-instance dreams of serving as the Swagger of web components.  Or at least start the ball rolling on such a thing.

Whereas Swagger rests on the OpenAPI schema, for-instance validates a "contract," specified via the [wc-info schema](https://github.com/bahrus/wc-info), which is itself an extension of the (fledgling) VSCode [schema support for web components](https://code.visualstudio.com/updates/v1_31#_html-and-css-custom-data-support).  

for-instance's first mission is to allow one to "prove" that the custom event signatures are accurate.  It does this by running tests, as specified in the html.json file.  It treats a web component as a function of its attributes / properties, and confirms that expected events are fired matching the specified signature.  This would provide confidence that there is a [contract that consuming applications can rely on](https://martinfowler.com/articles/micro-frontends.html#Cross-applicationCommunication).

If a vendor and language-neutral way of describing a web component could be established, it would open the doors to a whole variety of applications, including browser extensions that work well with all web component libraries, visual designers, etc.


## Syntax

```html
    <for-instance href="https://unpkg.com/xtal-frappe-chart@0.0.35/html.json"></for-instance>

    <for-instance href="https://unpkg.com/xtal-fetch@0.0.64/html.json"></for-instance>
```

If you view the links specified by the href attributes above, you will see the JSON contains test information.  for-instance runs those tests, which allows the user to a)  See the actual web component display some default, sample content, and b)  Validate any tests (if available)

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

