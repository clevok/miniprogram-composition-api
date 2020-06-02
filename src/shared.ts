import { isRef, IRef } from './ref'
import { useEffect } from './watch'
import { isPlainObject, isArray } from './utils'
import { diff } from './diff'

export function deepToValue (x: unknown): unknown{
	if (isRef(x)) {
		return x.value
	}
	if (isArray(x)) {
		return x.map((item) => deepToValue(item))
	}
	if (isPlainObject(x)) {
		const obj: { [key: string]: unknown } = {}
		Object.keys(x).forEach((key) => {
			obj[key] = deepToValue(x[key])
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
        if (isArray(x)) {
            return void x.map((item) => observerEffects(item))
        }
        if (isPlainObject(x)) {
            return void Object.keys(x).forEach((key) => {
                observerEffects(x[key])
            })
        }
        if (isRef(x)) {
            return void deepEffects.push(x);
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
                        [key]: deepToValue(value)
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
