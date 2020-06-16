import { ICurrentModuleInstance } from './instance';
import { Emitter } from './mitt';
export declare type IContext = {
    setData: (params: {
        [key: string]: any;
    }) => () => void;
} & {
    event: Emitter;
};
export declare function createContext(target: ICurrentModuleInstance): IContext;
