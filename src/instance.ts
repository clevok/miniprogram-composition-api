export type IBindings = Record<string, any> | void

export type IContext = any

export type ISetup<Props extends Record<string, any>> = (
	this: void,
	props: Props,
	context: IContext
) => IBindings

/**
 * 执行期间的页面
 */
let currentModule: CurrentModuleInstance | null = null

export type CurrentModuleInstance =
	| WechatMiniprogram.Component.InstanceProperties &
			WechatMiniprogram.Component.InstanceMethods<Record<string, unknown>> & {
				[key: string]: any
			}
	| WechatMiniprogram.Page.InstanceProperties &
			WechatMiniprogram.Page.InstanceMethods<Record<string, unknown>> & {
				[key: string]: any
			}

export function getCurrentInstance (): CurrentModuleInstance | null{
	return currentModule
}

/**
 * 接受第一个参数是 current对象
 * @param callback 
 */
export function overCurrentModule<T extends Function> (callback: T): T{
	// @ts-ignore
	return function (target: CurrentModuleInstance, ...arg: any[]){
		currentModule = target

		const reuslt = callback.call(target, target, ...arg)

		currentModule = null

		return reuslt
	}
}
