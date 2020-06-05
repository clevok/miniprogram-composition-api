export declare function defineComponent(optionsOrSetup: {
    [key: string]: any;
    setup?: Function;
} | Function): any;
/**
 *
 * 绑定函数, 基于target对象绑定实例
 * @param target - 页面/组件 实例
 * @param callback - 执行方法
 * @param props - props内容
 * @return {function} - 停止内部所有依赖的监听
 */
export declare function setup(target: any, callback: Function, props?: unknown): () => void;
