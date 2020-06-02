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

export type PageInstance = WechatMiniprogram.Page.InstanceProperties &
	WechatMiniprogram.Page.InstanceMethods<Record<string, unknown>>

export type ComponentInstance = WechatMiniprogram.Component.InstanceProperties &
	WechatMiniprogram.Component.InstanceMethods<Record<string, unknown>>

/**
 * 执行期间的页面
 */
export let currentPage: PageInstance | null = null

/**
 * 执行期间的组件
 */
export let currentComponent: ComponentInstance | null = null

export function setCurrentPage (page: PageInstance | null): void{
	currentPage = page
}
export function overCurrentPage (callback){
	return function (){
		setCurrentPage(this)

		callback.call(this)

		setCurrentPage(null)
	}
}


export function setCurrentComponent (component: ComponentInstance | null): void{
	currentComponent = component
}

export function overCurrentComponent (callback){
	return function (){
		setCurrentComponent(this)

		callback.call(this)

		setCurrentComponent(null)
	}
}

/**
 * 实例初始化
 */
export function attached() {
    
}

/**
 * 装载完成
 */
export function ready() {

}

/**
 * 卸载
 */
export function detached() {

}

/**
 * 页面加载
 */
export function onLoad() {
    
}

/**
 * 页面显示
 */
export function onShow() {
    
}

/**
 * 页面隐藏
 */
export function onHide() {
    
}

/**
 * 页面卸载
 */
export function onUnload() {
    
}

/**
 * 下拉刷新
 */
export function onPullDownRefresh() {
    
}

/**
 * 滚动到底部
 */
export function onReachBottom() {
    
}

/**
 * 转发
 */
export function onShareAppMessage() {
    
}