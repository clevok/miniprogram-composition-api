import { cloneDeep } from 'lodash'

export function overCloneDeep<T extends Function> (callback: T): T{
	// @ts-ignore
	return function (){
		return cloneDeep(callback.apply(this, arguments))
	}
}
