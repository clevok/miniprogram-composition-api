import { IRef } from './reactivity/ref';
export declare function useEffect<T>(callback: (newValue: T, oldValue: T) => any, refs: IRef<T>[]): () => void;
