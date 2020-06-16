/// <reference types="types" />
import { ISetup } from './shared';
export declare function definePage(pageOptions: (WechatMiniprogram.Page.Options<Record<string, any>, Record<string, any>> & {
    setup?: ISetup<WechatMiniprogram.Component.AllProperty>;
}) | ISetup<WechatMiniprogram.Component.AllProperty>): any;
