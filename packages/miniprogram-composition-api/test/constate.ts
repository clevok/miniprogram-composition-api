import { useRef, createConstate } from '../src/index'

const useUserModal = createConstate(function (params: { name: string }) {
    const name = useRef(params.name)
    const changeName = (_name: string) => {
        name.set(_name)
    }

    return {
        name,
        changeName,
    }
})

const demo = useUserModal({
    name: 'demo',
})

const demo2 = useUserModal({
    name: 'demo',
})

const demo3 = useUserModal({
    name: 'demo3',
})

const demo4 = useUserModal({
    name: 'demo3',
})

demo2.changeName('changedemo2')

console.log(demo.name.value, demo2.name.value, demo3.name.value, demo4)
