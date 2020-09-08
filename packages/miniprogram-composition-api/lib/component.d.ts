import { ISetup, AllProperty } from './shared';
export declare function defineComponent<PROPS extends {
    [key: string]: AllProperty;
}>(componentOptions: {
    props?: PROPS;
    setup?: ISetup<PROPS>;
    [key: string]: any;
} | ISetup<PROPS>): any;
