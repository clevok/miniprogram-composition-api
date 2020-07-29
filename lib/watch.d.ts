import { IRef } from './reactivity/ref';
export declare function useEffect<T extends any>(callback: (newValue: T, oldValue: T) => any, refs: IRef<any>[]): () => void;
