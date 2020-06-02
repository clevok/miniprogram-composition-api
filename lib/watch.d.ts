import { IRef } from "./ref";
/**
 * 监听ref做出回应
 */
export declare function watch(callback: (newValue: any) => any, refs: IRef[]): () => void;
