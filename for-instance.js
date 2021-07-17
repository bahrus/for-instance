import { XtalFetchViewElement, mergeProps, define } from 'xtal-element/XtalFetchViewElement.js';
import { prependTag } from 'trans-render/prependTag.js';
//const href = 'href';
const tag = 'tag';
const contract_prop = 'contract-prop';
const skip_imports = 'skip-imports';
/**
 * Test instances of custom element for custom event signature contracts.
 * @element for-instance
 */
export class ForInstance extends XtalFetchViewElement {
    constructor() {
        super();
        this.noShadow = true;
        import('p-et-alia/p-d.js');
        import('if-diff/if-diff-then-stiff.js');
        import('@alenaksu/json-viewer/build/index.js');
    }
    get readyToInit() {
        return super.readyToInit && this.tag !== undefined && this.contractProp !== undefined;
    }
    filterInitData(data) {
        const esi = data;
        const elementInfo = esi.tags?.find(tag => tag.name === this.tag);
        if (elementInfo === undefined) {
            // reject('No Element Info Found');
            return { test: {}, elementInfo: {} };
            //TODO
        }
        const test$ = elementInfo.properties.find(prop => prop.name === this.contractProp)?.default;
        if (test$ === undefined) {
            return { test: {}, elementInfo: {} };
            //reject('No contract found');
            //TODO
        }
        const test = JSON.parse(test$);
        return { test, elementInfo };
    }
    get readyToRender() {
        if (this.viewModel === undefined)
            return false;
        let trigger = this.viewModel.test.trigger;
        if (trigger != undefined) {
            const scr = document.createElement('script');
            scr.type = 'module';
            if (this.skipImports) {
                const split = trigger.split('\n');
                split.forEach((line, idx) => {
                    if (line.trim().startsWith('import ')) {
                        split[idx] = '//' + line;
                    }
                });
                trigger = split.join('\n');
            }
            scr.innerHTML = trigger;
            document.head.appendChild(scr);
        }
        return true;
    }
    get mainTemplate() {
        return mainTemplate;
    }
    get initTransform() {
        return {
            mark: this.tag + ', for instance.',
            'json-viewer': [{ innerHTML: JSON.stringify(this.viewModel) }],
            main: ({ target }) => {
                const newElement = prependTag(target, this.tag, [, , { disabled: '2' }], {});
                this.viewModel.elementInfo.properties.forEach(prop => {
                    if (prop.default !== undefined) {
                        switch (typeof prop.default) {
                            case 'string':
                                if (typeof (prop.type) === 'string') {
                                    if (prop.type.indexOf('=>') > -1) {
                                        return;
                                    }
                                }
                                switch (prop.type) {
                                    case 'string':
                                    case 'object':
                                    case undefined:
                                        newElement[prop.name] = JSON.parse(prop.default);
                                        break;
                                    default:
                                        if (prop.type[0] === '{') { //example:   "type": "{ [key: string]: number; }",
                                            newElement[prop.name] = JSON.parse(prop.default);
                                        }
                                        else {
                                            newElement[prop.name] = prop.default;
                                        }
                                }
                                break;
                            default:
                                newElement[prop.name] = prop.default;
                        }
                    }
                });
            },
            '"': {
                'p-d': [{ on: this.viewModel.test.expectedEvent.name }],
            },
            details: {
                'section[data-lhs]': {
                    'json-viewer': [{ innerHTML: JSON.stringify(this.viewModel.test.expectedEvent.detail) }]
                }
            },
            'if-diff-then-stiff': [{ rhs: this.viewModel.test.expectedEvent.detail }]
        };
    }
}
ForInstance.is = 'for-instance';
ForInstance.attributeProps = ({ skipImports, tag, contractProp }) => {
    const ap = {
        bool: [skipImports],
        str: [tag, contractProp],
        reflect: [skipImports, tag, contract_prop]
    };
    return mergeProps(ap, XtalFetchViewElement.props);
};
define(ForInstance);
