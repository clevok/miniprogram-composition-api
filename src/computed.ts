import { IRef, useRef } from './reactivity/ref'
import { useEffect } from './reactivity/watch'

export function useComputed<T> (callback: () => T, refs: IRef[]): IRef<T>{
	const [ ref, setRef ] = useRef(callback())

	useEffect(() => {
		setRef(callback())
	}, refs)

	return ref
}
