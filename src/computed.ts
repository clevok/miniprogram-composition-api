import { IRef, useRef } from './ref'
import { useEffect } from './watch'

/**
 * 计算属性
 */
export function useComputed<T> (callback: () => T, refs: IRef[]): IRef<T>{
	const [ ref, setRef ] = useRef(callback())

	useEffect(() => {
		setRef(callback())
	}, refs)
	return ref
}
