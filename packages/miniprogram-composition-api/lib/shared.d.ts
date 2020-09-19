import { IRef } from 'miniprogram-reactivity';
import { ComponentLifecycle, PageLifecycle, CommonLifecycle } from './lifecycle';
import { ICurrentModuleInstance } from './instance';
import { IContext } from './context';
/** 副作用, 如果是方法,返回null */
export declare const deepToRaw: (x: unknown) => any;
/**
 * Page/Component 与 watch 中转
 * @return {function} 抛弃监听
 */
export declare function deepWatch(target: any, key: string, value: any): () => void;
/**
 * 执行注册的生命周期
 */
export declare function createLifecycleMethods(lifecycle: ComponentLifecycle | PageLifecycle | CommonLifecycle, options: Object | Function | undefined): (...args: any[]) => any[];
export declare type IBindings = {
    [key: string]: any;
};
declare type IAnyObject = Record<string, any>;
declare type PropertyType = StringConstructor | NumberConstructor | BooleanConstructor | ArrayConstructor | ObjectConstructor | null;
declare type ValueType<T extends PropertyType> = T extends StringConstructor ? string : T extends NumberConstructor ? number : T extends BooleanConstructor ? boolean : T extends ArrayConstructor ? any[] : T extends ObjectConstructor ? IAnyObject : any;
declare type FullProperty<T extends PropertyType> = {
    /** 属性类型 */
    type: T;
    /** 默认值 */
    value?: ValueType<T>;
};
export declare type AllFullProperty = FullProperty<StringConstructor> | FullProperty<NumberConstructor> | FullProperty<BooleanConstructor> | FullProperty<ArrayConstructor> | FullProperty<ObjectConstructor> | FullProperty<null>;
declare type ShortProperty = StringConstructor | NumberConstructor | BooleanConstructor | ArrayConstructor | ObjectConstructor | null;
export declare type AllProperty = AllFullProperty | ShortProperty;
interface IProps {
    [keyName: string]: AllProperty;
}
declare type PropertyToData<T extends AllProperty> = T extends ShortProperty ? ValueType<T> : T extends AllFullProperty ? ValueType<T['type']> : any;
declare type PropertyOptionToData<P extends IProps> = {
    [name in keyof P]: IRef<PropertyToData<P[name]>>;
};
export declare type ISetup<P extends IProps, PROVIDE extends {
    [key: string]: () => any;
}, INJECT extends {
    [key: string]: () => any;
}> = (this: ICurrentModuleInstance, props: PropertyOptionToData<P>, context: IContext & {
    provide: ParamsCallback<PROVIDE>;
    inject: ParamsCallback<INJECT>;
}) => IBindings;
declare type ParamsCallback<P extends {
    [key: string]: () => any;
}> = {
    [name in keyof P]: ReturnType<P[name]>;
};
export declare function createDI<P extends {
    [key: string]: () => any;
}>(params: P, next: (callback: any) => any): ParamsCallback<P>;
export {};
