import { useProvide } from "./reactivity/inject";

export const pageQueryKey = Symbol();

export const pageQuery = useProvide(pageQueryKey, {});

export const router = {
    go(url: string) {
        wx.navigateTo({
            url
        });
    },
    back(delta = 1) {
        wx.navigateBack({
            delta
        });
    }
}