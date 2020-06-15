/// <reference types="types" />
export declare type IBindings = Record<string, any> | void;
import { Emitter } from './mitt';
export declare type IContext = {
    setData: () => void;
} & Emitter;
export declare type ISetup<Props extends Record<string, any>> = (this: ICurrentModuleInstance, props: Props, context: IContext) => IBindings;
export declare function getContext(): void;
export declare type ICurrentModuleInstance = (WechatMiniprogram.Component.InstanceProperties & WechatMiniprogram.Component.InstanceMethods<Record<string, unknown>> & {
    [key: string]: any;
}) | (WechatMiniprogram.Page.InstanceProperties & WechatMiniprogram.Page.InstanceMethods<Record<string, unknown>> & {
    [key: string]: any;
});
/**
 * 要求注入的函数第一个参数是 current对象
 * @param callback
 */
export declare function overCurrentModule<T extends Function>(callback: T): T;
export declare function overInCurrentModule(callback: (current: ICurrentModuleInstance) => void): void;
