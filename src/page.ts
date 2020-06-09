import { isFunction, wrapFun, createShortName, wrapFuns, runFun } from './utils'
import { PageLifecycle, setup, runLifecycle } from './lifecycle'

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
			return Page(optionsOrSetup)
		}

		const { setup: setupOption, ...otherOptions } = optionsOrSetup
		setupFun = setupOption
		options = otherOptions
	}

	function createLifecycle (lifecycle: PageLifecycle, ...funs: Function[]){
		return wrapFuns(
			...funs,
			function (){
				runLifecycle(this, lifecycle)
			},
			options[lifecycle]
		)
	}

	/** setup 回调句柄, 用于清除监听 */
	let __setup_handle: Function

	options[PageLifecycle.ON_LOAD] = createLifecycle(PageLifecycle.ON_LOAD, function (){
		__setup_handle = setup(this, setupFun, {})
	})

	options[PageLifecycle.ON_SHOW] = createLifecycle(PageLifecycle.ON_SHOW)

	options[PageLifecycle.ON_READY] = createLifecycle(PageLifecycle.ON_READY)

	options[PageLifecycle.ON_HIDE] = createLifecycle(PageLifecycle.ON_HIDE)

	options[PageLifecycle.ON_UNLOAD] = createLifecycle(PageLifecycle.ON_UNLOAD, function (){
		__setup_handle && __setup_handle()
	})

	options[PageLifecycle.ON_PULL_DOWN_REFRESH] = createLifecycle(
		PageLifecycle.ON_PULL_DOWN_REFRESH
	)

	options[PageLifecycle.ON_REACH_BOTTOM] = createLifecycle(PageLifecycle.ON_HIDE)

	options[PageLifecycle.ON_PAGE_SCROLL] = createLifecycle(PageLifecycle.ON_PAGE_SCROLL)

	options[PageLifecycle.ON_SHARE_APP_MESSAGE] = function (params: any){
		const life = createShortName(PageLifecycle.ON_SHARE_APP_MESSAGE)
		if (this[life] && this[life].length) {
			if (isFunction(this[life][0])) {
				return this[life][0].call(this, params)
			}
		}

		return runFun.call(this, options[PageLifecycle.ON_SHARE_APP_MESSAGE], params)
	}

	return Page(options)
}
