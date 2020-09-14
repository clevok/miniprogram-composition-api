import { useRef, useConstate } from '../src/index'

const useUserModal = function (params: { name: string }) {
    const name = useRef(params.name)
    const changeName = (_name: string) => {
        name.set(_name)
    }

    return {
        name,
        changeName,
    }
}

const demo = useConstate(useUserModal, {
    name: 'demo',
})

const demo2 = useConstate(useUserModal, {
    name: 'demo',
})

const demo3 = useConstate(useUserModal, {
    name: 'demo3',
})


demo2.changeName('changedemo2')

console.log(demo.name.value, demo2.name.value, demo3.name.value)
