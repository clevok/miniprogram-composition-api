export declare class Dep {
    private deps;
    depend(callback: Function): () => void;
    notify(...arg: any[]): void;
    /** 清空监听 */
    clear(): void;
}
