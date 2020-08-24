export { useRef, isRef, IRef, useProvide, useInject } from 'miniprogram-reactivity'

export { defineComponent } from './component'

export { definePage } from './page'

export { router } from './router'

export {
	onMounted,
	onReady,
	onUnmounted,

    onShow,
	onHide,
	onPullDownRefresh,
	onShareAppMessage,
	onReachBottom,
	onPageScroll,
} from './lifecycle'

export { useEffect } from './watch'

export { useComputed } from './computed'

export { createContext } from './context'