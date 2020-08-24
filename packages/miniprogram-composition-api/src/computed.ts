import { IRef, useRef } from 'miniprogram-reactivity'
import { useEffect } from './watch'

export function useComputed<T> (callback: () => T, refs: IRef<any>[]): IRef<T>{
	const ref = useRef(callback())
	useEffect(() => {
		ref.set(callback())
	}, refs)

	return ref
}