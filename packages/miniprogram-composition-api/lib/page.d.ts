import { ISetup } from './shared';
export declare function definePage(pageOptions: {
    /** 静态属性,可以被覆盖,初始化显示更快 */
    data?: {
        [key: string]: any;
    };
    setup?: ISetup<any>;
} | ISetup<any>): any;
