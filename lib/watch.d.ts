import { IRef } from "./ref";
/**
 * 可观测对象
 * @param value
 */
export declare function isObserve(value: any): boolean;
/**
 * 监听ref做出回应
 */
export declare function useEffect(callback: (newValue: any) => any, refs: IRef[]): () => void;
