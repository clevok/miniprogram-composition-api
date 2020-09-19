import { ISetup, AllProperty } from './shared';
export declare function defineComponent<PROPS extends {
    [key: string]: AllProperty;
}, PROVIDE extends {
    [key: string]: () => any;
}, INJECT extends {
    [key: string]: () => any;
}>(componentOptions: {
    props?: PROPS;
    /** 注册 */
    provide?: PROVIDE;
    /** 注入 */
    inject?: INJECT;
    /** 静态属性,可以被覆盖,初始化显示更快 */
    data?: {
        [key: string]: any;
    };
    setup?: ISetup<PROPS, PROVIDE, INJECT>;
    [key: string]: any;
} | ISetup<any, any, any>): any;
