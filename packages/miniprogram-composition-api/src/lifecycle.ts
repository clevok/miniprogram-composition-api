import { createShortName } from './utils'
import { ICurrentModuleInstance, overInCurrentModule } from './instance'

export const enum AppLifecycle {
	ON_LAUNCH = 'onLaunch',
	ON_SHOW = 'onShow',
	ON_HIDE = 'onHide',
	ON_ERROR = 'onError',
	ON_PAGE_NOT_FOUND = 'onPageNotFound',
	ON_THEME_CHANGE = 'onThemeChange'
}

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
	ON_TAB_ITEM_TAP = 'onTabItemTap',
    ON_ADD_TO_FAVORITES = 'onAddToFavorites',
    ON_SHARE_TIME_LINE = 'onShareTimeline'
}

export const enum CommonLifecycle {
	ON_LOAD = 'onLoad',
	ON_UN_LOAD = 'onUnload',
	ON_READY = 'onReady'
}

export const enum ExtendLefecycle {
	/** 副作用 */
	EFFECT = 'effect',
	/** props代理 */
	WATCH_PROPERTY = '__watchProperty__',
	/** 父实例 */
	PARENT = '__parent__',
	/** 依赖实例容器 */
	LOC_INJECT = '__loc_inject__'
}

/**注入hooks */
export function injectHook (
	currentInstance: ICurrentModuleInstance,
	lifecycle: PageLifecycle | ComponentLifecycle | ExtendLefecycle | CommonLifecycle,
	hook: Function
){
	const hiddenField = createShortName(lifecycle)
	if (currentInstance[hiddenField] === undefined) {
		currentInstance[hiddenField] = []
	}

	currentInstance[hiddenField].push(hook)
}

/**执行hooks */
export function conductHook (
	currentInstance: ICurrentModuleInstance,
	lifecycle: PageLifecycle | ComponentLifecycle | ExtendLefecycle | CommonLifecycle,
	params: any[]
){
	const hiddenField = createShortName(lifecycle)
	const injectLifes: Function[] = currentInstance[hiddenField] || []

	return injectLifes.map(
		(life) => typeof life === 'function' && life.apply(currentInstance, params)
	)
}

function createCurrentModuleHook<T extends Function> (
	lifecycle: ComponentLifecycle | PageLifecycle | CommonLifecycle
){
	return function (callback: T){
		overInCurrentModule((currentInstance) => {
			currentInstance && injectHook(currentInstance, lifecycle, callback)
		})
	}
}

/** 实例被加载, Page.onLoad, Components.attached, App.onLaunch */
export const onLoad = createCurrentModuleHook(CommonLifecycle.ON_LOAD)

/** 实例装载完成, Page.onReady, Components.ready, App.onLaunch */
export const onReady = createCurrentModuleHook(CommonLifecycle.ON_READY)

/** 实例被销毁, Page.onUnLoad, Components.destory */
export const onUnLoad = createCurrentModuleHook(CommonLifecycle.ON_UN_LOAD)

/** 页面显示, Page.onShow, App.onShow */
export const onShow = createCurrentModuleHook(PageLifecycle.ON_SHOW)

/** 页面隐藏 Page.onHide, App.onHide */
export const onHide = createCurrentModuleHook(PageLifecycle.ON_HIDE)

/** 下拉刷新 */
export const onPullDownRefresh = createCurrentModuleHook(PageLifecycle.ON_PULL_DOWN_REFRESH)

/** 滚动到底部 */
export const onReachBottom = createCurrentModuleHook(PageLifecycle.ON_REACH_BOTTOM)

/** 页面滚动 */
export const onPageScroll = createCurrentModuleHook(PageLifecycle.ON_PAGE_SCROLL)

/** tab页面点击时触发 */
export const onTabItemTap = createCurrentModuleHook<
	(
		e: {
			index: string
			pagePath: string
			text: string
		}
	) => any
>(PageLifecycle.ON_TAB_ITEM_TAP)

/** 用户点击右上角收藏 */
export const onAddToFavorites = createCurrentModuleHook<
	(
		e: { webviewUrl?: string }
	) => {
		title?: string
		imageUrl?: string
		query?: string
	}
>(PageLifecycle.ON_ADD_TO_FAVORITES)

/** 转发 */
export const onShareAppMessage = createCurrentModuleHook<
	(
		e: { from: 'button' | 'menu'; target: any; webViewUrl?: string }
	) => {
		title?: string
		path?: string
		imageUrl?: string
	}
>(PageLifecycle.ON_SHARE_APP_MESSAGE)
