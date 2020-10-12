import { diff } from '../src/diff'

console.log(
	diff(
		{
			arr: [
				1,
				2,
                45,
                111
			]
		},
		{
			arr: [
				1,
				2,
				3,
			]
		}
	)
)
