//import {ElementInfo} from 'api-viewer-element/src/lib/types.js';
import { WCInfoFetchProps } from 'wc-info/types.d.js';
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
     * Script needed to invoke evoke, including simulation of user-triggered events
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

export interface ForInstanceViewModel{
    test: Test,
    elementInfo: ElementInfo
}

export interface ForInstanceListenersProps{
    event: Event,
    tag: string,
}

export interface ForInstanceProps extends HTMLElement{
  
  /**
   * Name of tag to test / showcase.
   * @attr
   */
  tag: string | undefined;

   /**
   * Name of property that specifies contract.
   * @attr contract-prop
   */
   contractProp: string | undefined;

   /**
   * If test page contains needed imports, skip any imports contained in test script.
   * @attr skip-imports
   */
   skipImports: boolean | undefined;

   href: string,
}

export interface ForInstanceFetchProps extends WCInfoFetchProps{
    /**
   * Name of property that specifies contract.
   * @attr contract-prop
   */
   contractProp: string | undefined;
}