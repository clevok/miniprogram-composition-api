import { ICurrentModuleInstance } from './instance'

const routerParams = {
	store: {},
	take (key) {
		let value = this.store[key] || {}
		this.store[key] = null

		return value
	},
	set (key, value) {
		this.store[key] = value
	}
}

export const router = {
	go (url: string, params: { [key: string]: any } = {}) {
		wx.navigateTo({
			url
		})
	},

	/**
     * 后退页面
     * @param target - 接受number或者页面对象, 表示将退出直到显示该页面
     */
	back (target: number | ICurrentModuleInstance = 1) {
		let delta = typeof target === 'number' ? target : 1
		wx.navigateBack({
			delta
		})
	},

	/**
     * 离开页面
     * @param target - 往后退,直到离开这个页面
     */
	leave (target: ICurrentModuleInstance) {}
}
