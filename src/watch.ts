import { IRef } from './reactivity/ref'
import { useEffect as _useEffect } from './reactivity/watch'
import { overInCurrentModule } from './instance'
import { injectHook, ExtendLefecycle } from './lifecycle'

export function useEffect<T> (callback: (newValue: T) => any, refs: IRef<T>[]): () => void{
	const stopHandle = _useEffect(callback, refs)

	return overInCurrentModule(
		(currentInstance) => {
			injectHook(currentInstance, ExtendLefecycle.EFFECT, stopHandle)
			return stopHandle
		},
		() => {
			return stopHandle
		}
	)
}
