import { IRef } from './ref';
/**
 * 可观测对象
 * @param value
 */
export declare function isObserve(value: any): value is IRef;
/**
 * 监听ref做出回应
 * @return {function} 丢弃监听
 */
export declare function useEffect<T>(callback: (newValue: T) => any, refs: IRef<T>[]): () => void;
