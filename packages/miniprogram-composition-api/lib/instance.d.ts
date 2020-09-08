/// <reference types="types" />
export declare type ICurrentModuleInstance = (WechatMiniprogram.Component.InstanceProperties & WechatMiniprogram.Component.InstanceMethods<Record<string, unknown>> & {
    [key: string]: any;
}) | (WechatMiniprogram.Page.InstanceProperties & WechatMiniprogram.Page.InstanceMethods<Record<string, unknown>> & {
    [key: string]: any;
});
/**
 * 要求注入的函数第一个参数是 current对象
 * @param callback
 */
export declare function overCurrentModule<T>(callback: () => T): (this: ICurrentModuleInstance, ...arg: any[]) => T;
export declare function overInCurrentModule<T>(callback: (current: ICurrentModuleInstance) => T): T;
