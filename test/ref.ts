import { useRef } from '../src/reactivity/ref';
import { defineComponent } from '../src/component';

const [name, setName] = useRef('along');
name.__v_change((value) => {
    console.log('变化', value)
});
name.__v_change((value) => {
    console.log('变化', value)
});
setName('555')

defineComponent({
    setup() {
        return []
    }
})