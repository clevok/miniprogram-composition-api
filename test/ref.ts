import { useRef } from '../src/reactivity/ref';
import { defineComponent } from '../src/component';

const name = useRef('along');
name.__v_change((value, old) => {
    console.log('变化', value, old)
});
name.set('555')
name.set('777')

