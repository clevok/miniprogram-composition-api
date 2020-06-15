import { Dep } from './dep'

const provides = Object.create(null)
const dep = new Dep()

// @ts-ignore
export interface InjectionKey<T> extends Symbol {}

/**
 * 注册
 * @param key 
 * @param value 
 */
export function useProvide<T> (key: InjectionKey<T> | string, value: T): void{
	// TS doesn't allow symbol as index type
	provides[key as string] = value
	dep.notify(key, value)
}

/**
 * 取消注册
 */
export function useUnProvide<T>(key: InjectionKey<T> | string): void {
    delete provides[key as string]
}

/**
 * 注入
 * @param key 
 */
export function useInject<T> (key: InjectionKey<T> | string): T | undefined
export function useInject<T> (key: InjectionKey<T> | string, defaultValue: T): T
export function useInject (key: InjectionKey<any> | string, defaultValue?: unknown): unknown{
	if (key in provides) {
		// TS doesn't allow symbol as index type
		return provides[key as string]
	}

	if (arguments.length > 1) {
		return defaultValue
	}

	/* istanbul ignore else */
	console.warn(`injection "${String(key)}" not found.`)
}

/**
 * 异步注入, 等待注册
 * @param key 
 */
export async function useInjectAsync<T> (key: InjectionKey<T> | string): Promise<T>{
	if (key in provides) {
		// TS doesn't allow symbol as index type
		return provides[key as string]
	}

	return new Promise((resolve, reject) => {
		const clearHandle = dep.depend((notifyKey, notifyValue) => {
			if (notifyKey === key) {
				clearHandle && clearHandle()
				return resolve(notifyValue)
			}
		})
	})
}
