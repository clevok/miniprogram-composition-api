import { diff } from '../src/diff'

    diff(
        {
            name: '',
            age: [{ name: '1' }, { name: '2' }],
        },
        {
            name: '',
        }
    )
