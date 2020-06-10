import { isRef, IRef } from './ref'
import { useEffect, isObserve } from './watch'
import { isPlainObject, isArray, isFunction } from './utils'
import { diff } from './diff'
import { overCloneDeep } from './over'
import { overCurrentModule, CurrentModuleInstance } from './instance'


export const deepToRaw = overCloneDeep(function (x: unknown){
	if (isRef(x)) {
		return x.value
	}
	if (isArray(x)) {
		return x.map((item) => deepToRaw(item))
	}
	if (isPlainObject(x)) {
		const obj: { [key: string]: unknown } = {}
		Object.keys(x).forEach((key) => {
			obj[key] = deepToRaw(x[key])
		})
		return obj
	}

	return x
})

/**
 * Page/Component 与 watch 中转
 * @return {function} 抛弃监听
 */
export function deepWatch (target: any, key: string, value: any){
	/**
     * 提取可被响应的数据
     */
	const deepEffects: IRef[] = []
	;(function observerEffects (x: any){
		/**
         * isObserve必须是在最前面,因为会被isPlainObject解析
         */
		if (isObserve(x)) {
			return void deepEffects.push(x)
		}
		if (isArray(x)) {
			return void x.map((item) => observerEffects(item))
		}
		if (isPlainObject(x)) {
			return void Object.keys(x).forEach((key) => {
				observerEffects(x[key])
			})
		}
	})(value)

	if (!deepEffects.length) {
		return
	}

	return useEffect(() => {
		target.setData(
			diff(
				{
					[key]: deepToRaw(value)
				},
				{
					[key]: target.data[key]
				}
			)
		)
	}, deepEffects)
}

/**
 * 
 * 绑定函数, 基于target对象绑定实例
 * @param target - 页面/组件 实例
 * @param callback - 执行方法
 * @param props - props内容
 * @return {function} - 停止内部所有依赖的监听
 */
export const setup = overCurrentModule(function (
	target: CurrentModuleInstance,
	callback: Function,
	props: unknown = {}
){
	const binding = callback.call(target, props)
	const stopHandels = Object.keys(binding).map((key) => {
		const value = binding[key]

		if (isFunction(value)) {
			target[key] = value
			return
		}

		target.setData({
			[key]: deepToRaw(value)
		})

		return deepWatch(target, key, value)
	})

	return () => {
		stopHandels.forEach((stopHandle) => {
			stopHandle && stopHandle()
		})
	}
})
