import { IRef, useRef as _useRef } from 'miniprogram-reactivity'

export function useRef<T> (value: T, { diff = true }): IRef<T>{
	return _useRef(value)
}