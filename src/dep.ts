export class Dep {
	private deps: Function[] = []

	depend (callback: Function) {
		this.deps.push(callback)
		return () => {
			const findIndex = this.deps.indexOf(callback)
			if (~findIndex) {
				this.deps.splice(findIndex, 1)
			}
		}
	}

	notify (...arg: any[]) {
		this.deps.forEach((dep) => {
			dep(...arg)
		})
	}

	clear () {
		this.deps = []
	}
}
