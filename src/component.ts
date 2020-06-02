import { isFunction } from './utils'
import { deepToValue, deepWatch } from './shared'
import { ComponentLifecycle, overCurrentComponent } from './lifecycle'

export function defineComponent (
	optionsOrSetup:
		| {
				[key: string]: any
				setup?: Function
			}
		| Function
): any {

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
			return Component(optionsOrSetup)
		}

		const { setup: setupOption, ...otherOptions } = optionsOrSetup
		setup = setupOption
		options = otherOptions
	}


	/**
     * 属性赋值
     * 在attached里调用setup是因为props原因
     * 下一个版本将props转化为ref对象,进行监听
     */
    options[ComponentLifecycle.ATTACHED] = overCurrentComponent(function () {
        const binding = setup.call(this, this.properties);

		Object.keys(binding).forEach((key) => {
			const value = binding[key]
            if (isFunction(value)) {
                this[key] = value
				return
            }

            this.setData({
                [key]: deepToValue(value)
            })

            deepWatch(this, key, value);
        })
    })

    return Component(options);
}