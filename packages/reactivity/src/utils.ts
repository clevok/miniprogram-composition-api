export function isFunction (x: unknown): x is Function{
	return typeof x === 'function'
}

export function isObject (x: unknown): x is object{
	return x !== null && typeof x === 'object'
}