import { isFunction } from './utils'
import { deepToRaw, deepWatch } from './shared'
import { PageLifecycle, overCurrentPage } from './lifecycle'

export function definePage (
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
	let setup: Function

	/**
     * 构建componets基本参数
     */
	let options: Object

	if (isFunction(optionsOrSetup)) {
		setup = optionsOrSetup
		options = {}
	} else {
		if (optionsOrSetup.setup === void 0) {
			return Page(optionsOrSetup)
		}

		const { setup: setupOption, ...otherOptions } = optionsOrSetup
		setup = setupOption
		options = otherOptions
	}

	options[PageLifecycle.ON_LOAD] = overCurrentPage(function (props){
		const binding = setup.call(this, props)

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
	})

	return Page(options)
}
