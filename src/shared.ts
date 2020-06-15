import { isRef, IRef } from './reactivity/ref'
import { useEffect, isObserve } from './reactivity/watch'
import { isPlainObject, isArray, isFunction } from './utils'
import { diff } from './diff'
import { overCloneDeep } from './over'
import { overCurrentModule, ICurrentModuleInstance, IContext } from './instance'

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
	target: ICurrentModuleInstance,
	callback: Function,
    props: unknown = {},
    context: IContext
) {
    const binds = callback.call(target, props, context);
    if (binds instanceof Promise) {
        return console.error(`
            setup返回值不支持promise
        `)
    }
    return context.setData(binds);
})
