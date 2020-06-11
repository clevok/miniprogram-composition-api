import { createShortName } from './utils'
import { ICurrentModuleInstance, getCurrentInstance } from './instance'

export const enum ComponentLifecycle {
	CREATED = 'created',
	ATTACHED = 'attached',
	READY = 'ready',
	DETACHED = 'detached'
}

export const enum PageLifecycle {
	ON_LOAD = 'onLoad',
	ON_SHOW = 'onShow',
	ON_READY = 'onReady',
	ON_HIDE = 'onHide',
	ON_UNLOAD = 'onUnload',
	ON_PULL_DOWN_REFRESH = 'onPullDownRefresh',
	ON_REACH_BOTTOM = 'onReachBottom',
	ON_PAGE_SCROLL = 'onPageScroll',
	ON_SHARE_APP_MESSAGE = 'onShareAppMessage',
	ON_RESIZE = 'onResize',
	ON_TAB_ITEM_TAP = 'onTabItemTap'
}

/**
 *
 * 装饰原有声明周期, 执行被注入的 this对象内声明周期方法
 * @param lifecycle - 页面属性
 * @param options - 页面构造对象
 * @return {function} - 新方法, 用于指向所有的注入的声明周期以及原有方法
 */
export function createLifecycle (
	lifecycle: ComponentLifecycle | PageLifecycle,
	options: Object
): (...args: any[]) => any[]{
	/** 保持原有的生命周期方法链接 */
	const lifeMethod = options[lifecycle]

	/**
     * this - 实例
     */
	return function (...args: any[]){
		const injectLifes = this[createShortName(lifecycle)] || []

		if (lifeMethod) {
			injectLifes.push(lifeMethod)
		}

		return injectLifes.map(
			(life: Function | undefined) => life && life.apply(this, ...args)
		)
	}
}

function injectLifecyle (
	target: ICurrentModuleInstance,
	lifecycle: ComponentLifecycle | PageLifecycle,
	callback: Function
){
	const life = createShortName(lifecycle)
	if (target[life] === void 0) {
		target[life] = []
	}

	target[life].push(callback)
}

function createCurrentModuleLife (lifecycle: ComponentLifecycle | PageLifecycle){
	return function (callback: Function){
		if (getCurrentInstance()) {
			injectLifecyle(getCurrentInstance(), lifecycle, callback)
		}
	}
}

/** 实例初始化 */
export const attached = createCurrentModuleLife(ComponentLifecycle.ATTACHED)

/** 装载完成 */
export const ready = createCurrentModuleLife(ComponentLifecycle.READY)

/** 卸载 */
export const detached = createCurrentModuleLife(ComponentLifecycle.DETACHED)

/** 页面加载 */
export const onLoad = createCurrentModuleLife(PageLifecycle.ON_LOAD)

/** 页面显示 */
export const onShow = createCurrentModuleLife(PageLifecycle.ON_SHOW)

/** 页面隐藏 */
export const onHide = createCurrentModuleLife(PageLifecycle.ON_HIDE)

/** 页面卸载 */
export const onUnload = createCurrentModuleLife(PageLifecycle.ON_UNLOAD)

/** 下拉刷新 */
export const onPullDownRefresh = createCurrentModuleLife(PageLifecycle.ON_PULL_DOWN_REFRESH)

/** 滚动到底部 */
export const onReachBottom = createCurrentModuleLife(PageLifecycle.ON_REACH_BOTTOM)

/** 转发 */
export const onShareAppMessage = createCurrentModuleLife(PageLifecycle.ON_SHARE_APP_MESSAGE)

/** 页面滚动 */
export const onPageScroll = createCurrentModuleLife(PageLifecycle.ON_PAGE_SCROLL)
