import { diff } from '../src/diff'
console.log(
    diff({
        age: 0
    }, {
		age: null
	})
)

console.log(
	diff(
		{
			list: [
				{
					name: '123'
				}
			]
        },
        {
			list: [ { name: 155 }, { name: 155 } ]
		}
	)
)
console.log(
	diff(
		{
			name: {
				name1: 155
			}
		},
		{
			name: {
				name2: 4852
			}
		}
	)
)

console.log(
    diff(
        {},
		{
			name: {
				name1: 155
			}
		}
	)
)
console.log(
    diff(
        {
            name: []
        },
		{
			name: [{
				name1: 155
			}]
		}
	)
)