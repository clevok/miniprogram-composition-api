import { IRef } from './ref';
/**
 * 计算属性
 */
export declare function useComputed<T>(callback: () => T, refs: IRef[]): IRef<T>;
