import { isEqual } from '@jsmini/isequal'
import { clone } from '@jsmini/clone';
console.log(
	isEqual(
		[
			1,
			2,
			{
				name: {
					sex: [ { de: 1 } ]
				}
			},
			4,
			{
				name: {
					sex: [ { de: 1 } ]
				}
			}
		],
		[
			1,
			2,
			{
				name: {
					sex: [ { de: 2 } ]
				}
			},
			4,
			{
				name: {
					sex: [ { de: 1 } ]
				}
			}
		]
	)
)

var a = [
    1,
    2,
    {
        name: {
            sex: [{ de: 2 }]
        }
    },
    4,
    {
        name: {
            sex: [{ de: 1 }]
        }
    }
];
var b = clone(a); 
// @ts-ignore
a[2].name.sex2 = 4;
console.log(a);
console.log(b);