import { clone } from '@jsmini/clone';

export function overCloneDeep<T extends Function> (callback: T): T{
	// @ts-ignore
	return function (){
		return clone(callback.apply(this, arguments))
	}
}
