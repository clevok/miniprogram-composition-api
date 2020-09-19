export declare type Parameters<T extends (...args: any) => any> = T extends (...args: infer P) => any ? P : never;
export declare type ReturnType<T extends (...args: any) => any> = T extends (...args: any) => infer R ? R : any;
