import { IRef, useRef } from './core/ref'
import { useEffect } from './core/watch'

export function useComputed<T> (callback: () => T, refs: IRef[]): IRef<T>{
	const [ ref, setRef ] = useRef(callback())

	useEffect(() => {
		setRef(callback())
	}, refs)

	return ref
}
