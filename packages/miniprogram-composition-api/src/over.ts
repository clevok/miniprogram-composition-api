import cloneDeep from 'lodash/cloneDeep'

export function overCloneDeep<T extends Function> (callback: T): T{
	// @ts-ignore
	return function (...args: any[]){
		return cloneDeep(callback.apply(this, args))
	}
}
