import { isRef, IRef } from './ref'
import { useEffect, isObserve } from './watch'
import { isPlainObject, isArray } from './utils'
import { diff } from './diff'

export function deepToRaw (x: unknown): unknown{
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
}

/**
 * Page/Component 与 watch 中转
 */
export function deepWatch(target: any, key: string, value: any) {
    const deepEffects: IRef[] = [];
    (function observerEffects(x: any) {
        /**
         * isObserve必须是在最前面
         */
        if (isObserve(x)) {
            return void deepEffects.push(x);
        }
        if (isArray(x)) {
            return void x.map((item) => observerEffects(item))
        }
        if (isPlainObject(x)) {
            return void Object.keys(x).forEach((key) => {
                observerEffects(x[key])
            })
        }
    })(value);

    if (!deepEffects.length) {
        return
    }

    return useEffect(
        () => {
            target.setData(
                diff(
                    {
                        [key]: deepToRaw(value)
                    },
                    {
                        [key]: this.data[key]
                    }
                )
            )
        },
        deepEffects
    )
}
