import {
	ComponentLifecycle,
	PageLifecycle,
	conductHook,
	ExtendLefecycle,
	CommonLifecycle
} from './lifecycle'
import { isFunction, wrapFuns } from './utils'
import { ICurrentModuleInstance, overCurrentModule } from './instance'
import { createContext } from './context'
import {
	createLifecycleMethods,
	createSingleCallbackResultLifecycle,
	ISetup,
	AllProperty,
	createDI
} from './shared'
import { useInject, useProvide } from './inject'
import { useRef, IRef } from 'miniprogram-reactivity'

export function defineComponent<
	PROPS extends {
		[key: string]: AllProperty
	},
	PROVIDE extends {
		[key: string]: () => any
	},
	INJECT extends {
		[key: string]: () => any
	}
> (
	componentOptions:
		| {
				props?: PROPS
				/** 注册 */
				provide?: PROVIDE
				/** 注入 */
				inject?: INJECT
				/** 静态属性,可以被覆盖,初始化显示更快 */
				data?: {
					[key: string]: any
				}
				setup?: ISetup<PROPS, PROVIDE, INJECT>
				[key: string]: any
			}
		| ISetup<any, any, any>
): any{
	let setupFun: Function
	let options: {
		methods?: {
			[key: string]: (...args: any[]) => any
		}
		properties?: {
			[key: string]: AllProperty
		}
		[key: string]: any
	}

	if (isFunction(componentOptions)) {
		setupFun = componentOptions
		options = {}
	} else {
		componentOptions.properties =
			componentOptions.props || componentOptions.properties || {}

		if (componentOptions.setup === void 0) {
			return Component(componentOptions)
		}

		const { setup: setupOption, ...otherOptions } = componentOptions
		setupFun = setupOption
		options = otherOptions
	}

	options.methods = options.methods || {}

	options.properties &&
		Object.keys(options.properties).forEach((KEY) => {
			let prop = options.properties[KEY]
			let proxy_prop
			if (typeof prop === 'function' || prop === null) {
				proxy_prop = {
					type: prop,
					value: null
				}
			} else {
				proxy_prop = prop
			}

			proxy_prop.observer = function (this: ICurrentModuleInstance, newValue){
				const sortName = ExtendLefecycle.WATCH_PROPERTY

				this[sortName] && this[sortName][KEY] && this[sortName][KEY](newValue)
			}

			options.properties[KEY] = proxy_prop
		})

	function createProxyProperty (this: ICurrentModuleInstance){
		const proxy: {
			[key: string]: IRef<any>
		} = {}

		options.properties &&
			Object.keys(options.properties).forEach((KEY) => {
				proxy[KEY] = useRef(this.properties[KEY])

				if (!this[ExtendLefecycle.WATCH_PROPERTY]) {
					this[ExtendLefecycle.WATCH_PROPERTY] = {}
				}
				this[ExtendLefecycle.WATCH_PROPERTY][KEY] = function (value){
					proxy[KEY].set(value)
				}
			})

		return proxy
	}

	/** 子组件通知 */
	options.methods['$'] = function (
		this: ICurrentModuleInstance,
		{ detail: child }: { detail: ICurrentModuleInstance }
	){
		child[ExtendLefecycle.PARENT] = this
	}

	/**
     *
     * TODO 下一个版本将props转化为ref对象,进行监听
     */
	options[ComponentLifecycle.ATTACHED] = overCurrentModule(
		wrapFuns(
			function (this: ICurrentModuleInstance){
				this.triggerEvent('component', this)
			},
			function (this: ICurrentModuleInstance){
				const context = createContext(this)
				const inject = createDI(options.inject, useInject)
				const provide = createDI(options.provide, useProvide)
				const props = createProxyProperty.call(this)
				const binds = setupFun.call(
					this,
					props,
					Object.assign(context, { inject, provide })
				)
				if (binds instanceof Promise) {
					return console.error(`
                setup返回值不支持promise
            `)
				}

				const calcKeys = Object.keys(binds).filter(function (val){
					return Object.keys(props).indexOf(val) > -1
				})

				if (calcKeys.length) {
					console.error(`注意!${calcKeys}已存在props中,setup期间返回同名属性,将会触发props值改变`)
				}

				context.setData(binds)
			},
			createLifecycleMethods(
				CommonLifecycle.ON_LOAD,
				options[ComponentLifecycle.ATTACHED]
			)
		)
	)

	options[ComponentLifecycle.READY] = createLifecycleMethods(
		CommonLifecycle.ON_READY,
		options[ComponentLifecycle.READY]
	)

	options[ComponentLifecycle.DETACHED] = wrapFuns(function (){
		conductHook(this, ExtendLefecycle.EFFECT, [])
	}, createLifecycleMethods(CommonLifecycle.ON_UN_LOAD, options[ComponentLifecycle.DETACHED]))

	options.methods[PageLifecycle.ON_SHOW] = createLifecycleMethods(
		PageLifecycle.ON_SHOW,
		options.methods[PageLifecycle.ON_SHOW]
	)

	options.methods[PageLifecycle.ON_HIDE] = createLifecycleMethods(
		PageLifecycle.ON_HIDE,
		options.methods[PageLifecycle.ON_HIDE]
	)

	options.methods[PageLifecycle.ON_RESIZE] = createLifecycleMethods(
		PageLifecycle.ON_RESIZE,
		options.methods[PageLifecycle.ON_RESIZE]
	)

	options.methods[PageLifecycle.ON_TAB_ITEM_TAP] = createLifecycleMethods(
		PageLifecycle.ON_TAB_ITEM_TAP,
		options.methods[PageLifecycle.ON_TAB_ITEM_TAP]
	)

	options.methods[PageLifecycle.ON_PULL_DOWN_REFRESH] = createLifecycleMethods(
		PageLifecycle.ON_PULL_DOWN_REFRESH,
		options.methods[PageLifecycle.ON_PULL_DOWN_REFRESH]
	)

	options.methods[PageLifecycle.ON_REACH_BOTTOM] = createLifecycleMethods(
		PageLifecycle.ON_REACH_BOTTOM,
		options.methods[PageLifecycle.ON_REACH_BOTTOM]
	)

	options.methods[PageLifecycle.ON_PAGE_SCROLL] = createLifecycleMethods(
		PageLifecycle.ON_PAGE_SCROLL,
		options.methods[PageLifecycle.ON_PAGE_SCROLL]
	)

	options.methods[PageLifecycle.ON_ADD_TO_FAVORITES] = createSingleCallbackResultLifecycle(
		PageLifecycle.ON_ADD_TO_FAVORITES,
		options.methods[PageLifecycle.ON_ADD_TO_FAVORITES]
	)

	options.methods[PageLifecycle.ON_SHARE_APP_MESSAGE] = createSingleCallbackResultLifecycle(
		PageLifecycle.ON_SHARE_APP_MESSAGE,
		options.methods[PageLifecycle.ON_SHARE_APP_MESSAGE]
	)

	options.methods[PageLifecycle.ON_SHARE_TIME_LINE] = createSingleCallbackResultLifecycle(
		PageLifecycle.ON_SHARE_TIME_LINE,
		options.methods[PageLifecycle.ON_SHARE_TIME_LINE]
	)

	return Component(options)
}
