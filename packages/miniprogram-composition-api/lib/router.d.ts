import { ICurrentModuleInstance } from './instance';
export declare const router: {
    go(url: string, params?: {
        [key: string]: any;
    }): void;
    /**
     * 后退页面
     * @param target - 接受number或者页面对象, 表示将退出直到显示该页面
     */
    back(target?: number | ICurrentModuleInstance): void;
    /**
     * 离开页面
     * @param target - 往后退,直到离开这个页面
     */
    leave(target: ICurrentModuleInstance): void;
};
