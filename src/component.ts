import { isFunction, wrapFun } from './utils'
import { deepToRaw, deepWatch } from './shared'
import { ComponentLifecycle, overCurrentComponent } from './lifecycle'

export function defineComponent (
	optionsOrSetup:
		| {
				[key: string]: any
				setup?: Function
			}
		| Function
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

	/**
     * 属性赋值
     * 在attached里调用setup是因为props原因
     * 下一个版本将props转化为ref对象,进行监听
     */
	options[ComponentLifecycle.ATTACHED] = wrapFun(
		options[ComponentLifecycle.ATTACHED],
        overCurrentComponent(function () {
			setup.call(this, setupFun, this.properties)
		})
	)

	return Component(options)
}


/**
 * 绑定函数
 * @param callback 回调
 * @param props props内容
 */
export function setup (callback: Function, props: unknown){
	const binding = callback.call(this, props)

	Object.keys(binding).forEach((key) => {
		const value = binding[key]
		if (isFunction(value)) {
			this[key] = value
			return
		}

		this.setData({
			[key]: deepToRaw(value)
		})

		deepWatch(this, key, value)
	})
}
