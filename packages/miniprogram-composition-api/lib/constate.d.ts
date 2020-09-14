/**
 *
 * 创建单例共享空间, 用于实现单例依赖注入, 第一阶段api,可能要废弃
 * 所有自定义组件/页面共享数据, 当被依赖的页面/组件都被销毁时,重新加载第一遍会被执行一次
 * 请在setup期间调用!!
 */
export declare function createConstate<RESULT>(callback: (this: void) => RESULT): () => RESULT;
