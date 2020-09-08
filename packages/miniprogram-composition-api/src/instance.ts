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
export function overCurrentModule<T> (callback: () => T){
	return function (this: ICurrentModuleInstance, ...arg: any[]): T{
		currentModule = this

		const reuslt = callback.apply(this, arg)

		currentModule = null

		return reuslt
	}
}

export function overInCurrentModule<T> (
	callback: (current: ICurrentModuleInstance) => T
): T {
	return callback(currentModule)
}