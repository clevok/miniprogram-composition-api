import { ISetup } from './shared';
export declare function definePage<PROVIDE extends {
    [key: string]: () => any;
}, INJECT extends {
    [key: string]: () => any;
}>(pageOptions: {
    /** 注册服务 */
    provide?: PROVIDE;
    /** 注入 */
    inject?: INJECT;
    /** 静态属性,可以被覆盖,初始化显示更快 */
    data?: {
        [key: string]: any;
    };
    setup?: ISetup<any, PROVIDE, INJECT>;
} | ISetup<any, any, any>): any;
