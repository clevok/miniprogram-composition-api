import { IRef, useRef } from './reactivity/ref'
import { useEffect } from './watch';

export function useComputed<T> (callback: () => T, refs: IRef[]): IRef<T>{
	const ref = useRef(callback())
	useEffect(() => {
		ref.set(callback())
	}, refs)

	return ref
}
