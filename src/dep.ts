export class Dep {

    private deps: Function[] = []

	/* 收集监听 */
	depend (callback: Function) {
        this.deps.push(callback)
        return () => {
            const findIndex = this.deps.indexOf(callback);
            if (~findIndex) {
                this.deps.splice(findIndex, 1);
            }
        }
	}

	/* 执行监听 */
	notify (...arg: any[]) {
		this.deps.forEach((dep) => {
			dep(...arg)
		})
    }

    /** 清空监听 */
    clear() {
        this.deps = [];
    }
}
