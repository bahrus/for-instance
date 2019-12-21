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
    /**]
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