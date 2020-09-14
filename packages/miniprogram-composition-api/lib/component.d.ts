import { ISetup, AllProperty } from './shared';
export declare function defineComponent<PROPS extends {
    [key: string]: AllProperty;
}>(componentOptions: {
    props?: PROPS;
    setup?: ISetup<PROPS>;
    /** 静态属性,可以被覆盖,初始化显示更快 */
    data?: {
        [key: string]: any;
    };
    [key: string]: any;
} | ISetup<PROPS>): any;
