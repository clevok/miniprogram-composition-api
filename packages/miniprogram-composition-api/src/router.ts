import { useProvide } from "miniprogram-reactivity";
import { ICurrentModuleInstance } from "./instance";

export const pageQueryKey = Symbol();

export const pageQuery = useProvide(pageQueryKey, {});

export const router = {
    go(url: string) {
        wx.navigateTo({
            url
        });
    },
    /**
     * 
     * @param target - 接受number或者页面对象, 表示将退出直到显示该页面
     */
    back(target: number | ICurrentModuleInstance = 1) {
        let delta = typeof target === 'number' ? target : 1
        wx.navigateBack({
            delta
        });
    }
}