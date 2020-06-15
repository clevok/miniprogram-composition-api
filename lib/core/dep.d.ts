export declare class Dep {
    private deps;
    depend(callback: Function): () => void;
    notify(...arg: any[]): void;
    clear(): void;
}
