export const { isArray } = Array

export function getType (x: unknown): string{
	return Object.prototype.toString.call(x).slice(8, -1)
}

export function isObject (x: unknown): x is object{
	return x !== null && typeof x === 'object'
}

export function isFunction (x: unknown): x is Function{
	return typeof x === 'function'
}

export function isPlainObject (x: unknown): x is Record<string, unknown>{
	return x !== null && getType(x) === 'Object'
}

export function wrapFun (afterFun: Function, beforeFun: Function){
	return function (){
		try {
			beforeFun && beforeFun.apply(this, arguments)
		} finally {
			afterFun && afterFun.apply(this, arguments)
		}
	}
}

export function createShortName (name: string){
	return `__${name}__`
}
