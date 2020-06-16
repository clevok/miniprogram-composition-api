export { useRef, isRef, IRef, ISetRef, IUseRef } from './reactivity/ref'

export { defineComponent } from './component'

export { definePage } from './page'

export {
	onLoad,
	onShow,
	onHide,
	onUnload,
	onPullDownRefresh,
	onShareAppMessage,
	onReachBottom,
	onPageScroll,

    onAttached,
	onReady,
	onDetached,
} from './lifecycle'

export { useProvide, useInject, useInjectAsync } from './reactivity/inject'

export { useEffect } from './watch'

export { useComputed } from './computed'