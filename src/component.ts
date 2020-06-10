import { isFunction, wrapFuns, createShortName } from './utils'
import { ComponentLifecycle, createLifecycle } from './lifecycle'
import { setup } from './shared'
import { ISetup } from './instance'

export function defineComponent (
	optionsOrSetup:
		| WechatMiniprogram.Component.Options<
				Record<string, any>,
				Record<string, WechatMiniprogram.Component.AllProperty>,
				Record<string, (...args: any[]) => any>
			> & {
				setup?: ISetup<WechatMiniprogram.Component.AllProperty>
			}
		| ISetup<WechatMiniprogram.Component.AllProperty>
): any{
	/**
     * setup, 将在onLoad执行
     */
	let setupFun: Function

	/**
     * 构建componets基本参数
     */
	let options: Object

	if (isFunction(optionsOrSetup)) {
		setupFun = optionsOrSetup
		options = {}
	} else {
		if (optionsOrSetup.setup === void 0) {
			return Component(optionsOrSetup)
		}

		const { setup: setupOption, ...otherOptions } = optionsOrSetup
		setupFun = setupOption
		options = otherOptions
	}

	/** setup 回调句柄, 用于清除监听 */
	let __setup_handle: Function

	/**
     * TODO
     * 通过合并方法的方式, 调用setup
     * 在attached里调用setup是因为props原因
     * 下一个版本将props转化为ref对象,进行监听
     */
	options[ComponentLifecycle.ATTACHED] = wrapFuns(function (){
		__setup_handle = setup(this, setupFun, this.properties)
	}, createLifecycle(ComponentLifecycle.ATTACHED, options))

	options[ComponentLifecycle.READY] = createLifecycle(ComponentLifecycle.READY, options)

	options[ComponentLifecycle.DETACHED] = wrapFuns(function (){
		__setup_handle && __setup_handle()
	}, createLifecycle(ComponentLifecycle.DETACHED, options))

	return Component(options)
}
