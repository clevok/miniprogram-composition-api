import { IRef } from './core/ref';
export declare function useComputed<T>(callback: () => T, refs: IRef[]): IRef<T>;
