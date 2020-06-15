export type IBindings = Record<string, any> | void
import { Emitter } from './mitt'

export type IContext = {
	setData: () => void
} & Emitter

export type ISetup<Props extends Record<string, any>> = (
	this: ICurrentModuleInstance,
	props: Props,
	context: IContext
) => IBindings

export function getContext (){}

let currentModule: ICurrentModuleInstance | null = null

export type ICurrentModuleInstance =
	| (WechatMiniprogram.Component.InstanceProperties &
			WechatMiniprogram.Component.InstanceMethods<Record<string, unknown>> & {
				[key: string]: any
			})
	| (WechatMiniprogram.Page.InstanceProperties &
			WechatMiniprogram.Page.InstanceMethods<Record<string, unknown>> & {
				[key: string]: any
			})

/**
 * 要求注入的函数第一个参数是 current对象
 * @param callback
 */
export function overCurrentModule<T extends Function> (callback: T): T{
	// @ts-ignore
	return function (target: ICurrentModuleInstance, ...arg: any[]){
		currentModule = target

		const reuslt = callback.call(target, target, ...arg)

		currentModule = null

		return reuslt
	}
}

export function overInCurrentModule (callback: (current: ICurrentModuleInstance) => void){
	if (currentModule) {
		callback(currentModule)
	}
	callback = null
}
