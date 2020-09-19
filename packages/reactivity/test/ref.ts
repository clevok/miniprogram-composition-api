import { useEffect, useRef } from '../src/index'

const age = useRef(0)
useEffect(() => {
    console.log(age.value)
}, [age])
age.set(1)