
export type Parameters<T extends (...args: any) => any> = T extends (
    ...args: infer P
) => any
    ? P
    : never
export type ReturnType<T extends (...args: any) => any> = T extends (
    ...args: any
) => infer R
    ? R
    : any