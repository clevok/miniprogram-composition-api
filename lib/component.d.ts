/// <reference types="types" />
import { ISetup } from './shared';
export declare function defineComponent(componentOptions: (WechatMiniprogram.Component.Options<Record<string, any>, Record<string, WechatMiniprogram.Component.AllProperty>, Record<string, (...args: any[]) => any>> & {
    setup?: ISetup<WechatMiniprogram.Component.AllProperty>;
}) | ISetup<WechatMiniprogram.Component.AllProperty>): any;
