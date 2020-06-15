import { ICurrentModuleInstance, IContext } from "./instance";
import { setData } from "./shared";
import { mitt } from "./mitt";

export function createContext(target: ICurrentModuleInstance): IContext {
    return Object.assign({
        setData: setData.bind(target),
    }, mitt())
}