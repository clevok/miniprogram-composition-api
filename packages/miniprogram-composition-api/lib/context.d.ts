import { ICurrentModuleInstance } from './instance';
import { Emitter } from './mitt';
import { router } from './router';
export declare type IContext = {
    setData: (params: {
        [key: string]: any;
    }) => () => void;
    event: Emitter;
    router: typeof router;
};
export declare function createContext(target: ICurrentModuleInstance): IContext;
