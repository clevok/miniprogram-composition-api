export declare const isArray: (arg: any) => arg is any[];
export declare function getType(x: unknown): string;
export declare function isObject(x: unknown): x is object;
export declare function isFunction(x: unknown): x is Function;
export declare function isPlainObject(x: unknown): x is Record<string, unknown>;
export declare function wrapFun(afterFun: Function, beforeFun: Function): () => void;
export declare function wrapFuns(...args: Function[]): (...params: any[]) => void;
export declare function createShortName(name: string): string;
export declare function runFun(callback: any, params: any): void;
