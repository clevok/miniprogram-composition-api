import { isFunction, wrapFuns } from './utils'
import { PageLifecycle, conductHook, ExtendLefecycle, CommonLifecycle } from './lifecycle'
import { createContext } from './context'
import {
	createDI,
	createLifecycleMethods,
	createSingleCallbackResultLifecycle,
	ISetup
} from './shared'
import { ICurrentModuleInstance, overCurrentModule } from './instance'
import { useInject, useProvide } from './inject'

export function definePage<
	PROVIDE extends {
		[key: string]: () => any
	},
	INJECT extends {
		[key: string]: () => any
	}
> (
	pageOptions:
		| {
				/** 注册服务 */
				provide?: PROVIDE
				/** 注入 */
				inject?: INJECT
				/** 静态属性,可以被覆盖,初始化显示更快 */
				data?: {
					[key: string]: any
				}
				setup?: ISetup<any, PROVIDE, INJECT>
			}
		| ISetup<any, any, any>
): any{
	let setupFun: Function

	let options: {
		methods?: {
			[key: string]: (...args: any[]) => any
		}
		[key: string]: any
	}

	if (isFunction(pageOptions)) {
		setupFun = pageOptions
		options = {}
	} else {
		if (pageOptions.setup === void 0) {
			return Page(pageOptions)
		}

		const { setup: setupOption, ...otherOptions } = pageOptions
		setupFun = setupOption
		options = otherOptions
	}

	/** 绑定上下文 */
	options['$'] = function (
		this: ICurrentModuleInstance,
		{ detail }: { detail: ICurrentModuleInstance }
	){
		detail[ExtendLefecycle.PARENT] = this
	}

	options[PageLifecycle.ON_LOAD] = overCurrentModule(
		wrapFuns(
			function (this: ICurrentModuleInstance){
				typeof this.triggerEvent === 'function' &&
					this.triggerEvent('component', this)
			},
			function (params){
				const context = createContext(this)
				const inject = createDI(options.inject, useInject)
				const provide = createDI(options.provide, useProvide)
				const binds = setupFun.call(
					this,
					params,
					Object.assign(context, { inject, provide })
				)
				if (binds instanceof Promise) {
					return console.error(`
                setup不支持返回promise
            `)
				}
				context.setData(binds)
			},
			createLifecycleMethods(CommonLifecycle.ON_LOAD, options[PageLifecycle.ON_LOAD])
		)
	)

	options[PageLifecycle.ON_READY] = createLifecycleMethods(
		CommonLifecycle.ON_READY,
		options[PageLifecycle.ON_READY]
	)

	options[PageLifecycle.ON_UNLOAD] = wrapFuns(function (){
		conductHook(this, ExtendLefecycle.EFFECT, [])
	}, createLifecycleMethods(CommonLifecycle.ON_UN_LOAD, options[PageLifecycle.ON_UNLOAD]))

	options[PageLifecycle.ON_SHOW] = createLifecycleMethods(
		PageLifecycle.ON_SHOW,
		options[PageLifecycle.ON_SHOW]
	)

	options[PageLifecycle.ON_HIDE] = createLifecycleMethods(
		PageLifecycle.ON_HIDE,
		options[PageLifecycle.ON_HIDE]
	)

	options[PageLifecycle.ON_RESIZE] = createLifecycleMethods(
		PageLifecycle.ON_RESIZE,
		options[PageLifecycle.ON_RESIZE]
	)

	options[PageLifecycle.ON_TAB_ITEM_TAP] = createLifecycleMethods(
		PageLifecycle.ON_TAB_ITEM_TAP,
		options[PageLifecycle.ON_TAB_ITEM_TAP]
	)

	options[PageLifecycle.ON_PULL_DOWN_REFRESH] = createLifecycleMethods(
		PageLifecycle.ON_PULL_DOWN_REFRESH,
		options[PageLifecycle.ON_PULL_DOWN_REFRESH]
	)

	options[PageLifecycle.ON_REACH_BOTTOM] = createLifecycleMethods(
		PageLifecycle.ON_REACH_BOTTOM,
		options[PageLifecycle.ON_REACH_BOTTOM]
	)

	options[PageLifecycle.ON_PAGE_SCROLL] = createLifecycleMethods(
		PageLifecycle.ON_PAGE_SCROLL,
		options[PageLifecycle.ON_PAGE_SCROLL]
	)

	options[PageLifecycle.ON_ADD_TO_FAVORITES] = createSingleCallbackResultLifecycle(
		PageLifecycle.ON_ADD_TO_FAVORITES,
		options[PageLifecycle.ON_ADD_TO_FAVORITES]
	)

	options[PageLifecycle.ON_SHARE_APP_MESSAGE] = createSingleCallbackResultLifecycle(
		PageLifecycle.ON_SHARE_APP_MESSAGE,
		options[PageLifecycle.ON_SHARE_APP_MESSAGE]
	)

	options[PageLifecycle.ON_SHARE_TIME_LINE] = createSingleCallbackResultLifecycle(
		PageLifecycle.ON_SHARE_TIME_LINE,
		options[PageLifecycle.ON_SHARE_TIME_LINE]
	)

	return Page(options)
}
