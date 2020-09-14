/**
 *
 * 创建单例共享空间, 用于实现单例依赖注入
 *
 * 和 export 定义区别在于, 这个示例是在执行期间被执行, 在页面都被销毁后才一起销毁, 只示例一次,
 * 支持传参数,如果传了参数,那么参数不同,将会渲染不同的实例!!!
 */
export declare function useConstate<F extends (...args: any[]) => any>(fun: F, ...args: Parameters<F>): ReturnType<F>;
