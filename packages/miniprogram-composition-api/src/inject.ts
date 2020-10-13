import { clone } from '@jsmini/clone'
import { isEqual } from '@jsmini/isequal'

import { overInCurrentModule, ICurrentModuleInstance } from './instance'
import { ExtendLefecycle } from './lifecycle'
import { Parameters, ReturnType } from './interface'

/**
 *
 * create new (function block) if not init that
 */
export function useProvide<T extends (...args: any[]) => any> (
	callback: T,
	...args: Parameters<T>
): ReturnType<T>{
	const that = this

	return overInCurrentModule((current) => {
		current = current ? current : that

		if (!current) {
			throw new Error('useProvide 缺少 页面实例, 或者你想 useProvide.call(this)?')
		}

		if (!current[ExtendLefecycle.LOC_INJECT]) {
			current[ExtendLefecycle.LOC_INJECT] = []
		}

		let targetInject = current[ExtendLefecycle.LOC_INJECT]
		let findFunctionIndex = targetInject.findIndex((target) => {
			return target.function_target === callback
		})
		if (!~findFunctionIndex) {
			targetInject.unshift({
				function_target: callback,
				caches: []
			})
			findFunctionIndex = 0
		}

		let findFunctionResultIndex = targetInject[
			findFunctionIndex
		].caches.findIndex((cache) => {
			return isEqual(cache[0], args)
		})

		if (!~findFunctionResultIndex) {
			targetInject[findFunctionIndex].caches.unshift([ clone(args), callback(...args) ])
			findFunctionResultIndex = 0
		}

		return targetInject[findFunctionIndex].caches[findFunctionResultIndex][1]
	})
}

/**
 *
 * find and use (function block) if created
 * if not find, run useProvide
 */
export function useInject<T extends (...args: any[]) => any> (
	callback: T,
	...args: Parameters<T>
): ReturnType<T>{
	const that = this
	const CANT_FIND_KEY = Symbol()

	/** find (function block) */
	function getProvide (target: ICurrentModuleInstance): typeof CANT_FIND_KEY | ReturnType<T>{
		if (!target) {
			return CANT_FIND_KEY
		}

		/** if not find parent, return app */
		function getParent (target: ICurrentModuleInstance){
			const app = getApp() as ICurrentModuleInstance

			if (target === app) {
				return null
			}

			return target[ExtendLefecycle.PARENT] || app
		}

		const targetInject = target[ExtendLefecycle.LOC_INJECT] || []
		if (!targetInject.length) {
			return getProvide(getParent(target))
		}

		const findFunctionIndex = targetInject.findIndex((target) => {
			return target.function_target === callback
		})

		if (!~findFunctionIndex) {
			return getProvide(getParent(target))
		}

		const findFunctionResultIndex = targetInject[
			findFunctionIndex
		].caches.findIndex((cache) => {
			return isEqual(cache[0], args)
		})

		if (!~findFunctionResultIndex) {
			return getProvide(getParent(target))
		}

		return targetInject[findFunctionIndex].caches[findFunctionResultIndex][1]
	}

	return overInCurrentModule((current) => {
		current = current ? current : that

		if (!current) {
			throw new Error('useInject 缺少 页面实例, 或者你想 useInject.call(this)?')
		}

		const runResult = getProvide(current)
		if (runResult !== CANT_FIND_KEY) {
			return runResult
		}

		return useProvide.call(current, callback, ...args)
	})
}
