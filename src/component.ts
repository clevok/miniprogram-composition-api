import { isFunction, wrapFun, wrapFuns, createShortName } from './utils'
import { ComponentLifecycle, setup, runLifecycle, PageLifecycle } from './lifecycle'

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

	/** setup 回调句柄, 用于清除监听 */
	let __setup_handle: Function

	function createLifecycle (lifecycle: ComponentLifecycle, ...funs: Function[]){
		return wrapFuns(
			...funs,
			function (){
				return runLifecycle(this, lifecycle)
			},
			options[lifecycle]
		)
	}

	/**
     * 通过合并方法的方式, 调用setup
     * 在attached里调用setup是因为props原因
     * 下一个版本将props转化为ref对象,进行监听
     */
	options[
		ComponentLifecycle.ATTACHED
	] = createLifecycle(ComponentLifecycle.ATTACHED, function (){
		__setup_handle = setup(this, setupFun, this.properties)
	})

	options[ComponentLifecycle.READY] = createLifecycle(ComponentLifecycle.READY)

	options[
		ComponentLifecycle.DETACHED
	] = createLifecycle(ComponentLifecycle.DETACHED, function (){
		__setup_handle && __setup_handle()
	})

	return Component(options)
}


/**
 * 装饰原有声明周期
 * @param lifecycle - 页面属性
 * @param lifeMethod - 原页面的方法指向
 * @return {function} - 新方法, 用于指向所有的注入的声明周期以及原有方法
 */
function createLifecycle (
	lifecycle: ComponentLifecycle | PageLifecycle,
	lifeMethod: Function | undefined
): (...args: any[]) => any[]{
	/**
     * this - 实例
     */
	return function (...args: any[]){
        const injectLifes = this[createShortName(lifecycle)] || [];

        if (lifeMethod) {
            injectLifes.push(lifeMethod)
        }

		return injectLifes.map(
			(life: Function | undefined) => life && life.apply(this, ...args)
		)
	}
}
