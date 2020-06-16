import { IRef } from './reactivity/ref';
export declare function useComputed<T>(callback: () => T, refs: IRef[]): IRef<T>;
