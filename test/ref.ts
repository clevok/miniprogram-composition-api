import { useRef } from '../src/ref';

const [name, setName] = useRef('along');
name.__v_change((value) => {
    console.log('变化', value)
});
name.__v_change((value) => {
    console.log('变化', value)
});
setName('555')
