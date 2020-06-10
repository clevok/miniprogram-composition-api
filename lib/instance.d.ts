/// <reference types="types" />
export declare type IBindings = Record<string, any> | void;
export declare type IContext = any;
export declare type ISetup<Props extends Record<string, any>> = (this: void, props: Props, context: IContext) => IBindings;
export declare type CurrentModuleInstance = (WechatMiniprogram.Component.InstanceProperties & WechatMiniprogram.Component.InstanceMethods<Record<string, unknown>> & {
    [key: string]: any;
}) | (WechatMiniprogram.Page.InstanceProperties & WechatMiniprogram.Page.InstanceMethods<Record<string, unknown>> & {
    [key: string]: any;
});
export declare function getCurrentInstance(): CurrentModuleInstance | null;
/**
 * 接受第一个参数是 current对象
 * @param callback
 */
export declare function overCurrentModule<T extends Function>(callback: T): T;
