# for-instance

for-instance dreams of serving as the Swagger of web components.  Whereas Swagger rests on the OpenAPI schema, for-instance validates a "contract," specified via the [wc-info schema](https://github.com/bahrus/wc-info)

```TypeScript
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
export interface CustomEventInfo extends Info {
  detail: CustomEventDetailProperty[];
  /**
   * Event fires when this property changes
   */
  associatedPropName: string;
  testExpectedValues: { [key: string]: CustomEventInfo[] } | undefined;
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
export interface WCInfo extends Info {
  selfResolvingModulePath: string | undefined;
  attributes: AttribInfo[] | undefined;
  customEvents: CustomEventInfo[] | undefined;
  properties: PropertyInfo[] | undefined;
  testCaseNames: string[] | undefined;
}
export interface WCSuiteInfo {
  tags: WCInfo[];
}
```

Most importantly, it allows one to "prove" that the custom event signatures are accurate.