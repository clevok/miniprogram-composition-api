import { IRef } from 'miniprogram-reactivity';
export declare function useComputed<T>(callback: () => T, refs: IRef<any>[]): IRef<T>;
