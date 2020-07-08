import { useRef } from '../src/reactivity/ref';
import { defineComponent } from '../src/component';

const name = useRef('along');
name.__v_change((value, old) => {
    console.log('变化', value, old)
});
name.set('555')
name.set('777')

type createEnum<B, T, D> = (params: {
    [key: B]: [T, D]
}) => {
    ENUM: {
        [key: B]: T
    },
    MAP: {
        [key: T]: D
    },
    OPTION: {
        value: T
        label: D
    }[]
    }

type EnumKye = number | string;
function createEnem<B extends EnumKye, T extends EnumKye, D>(params: {
    [key: string]: [T, D]
}): {
    ENUM: {
        [key: string]: T
    },
    MAP: {
        [key: string]: D
    },
    OPTION: {
        value: T
        label: D
    }[]
    } {
    return {
        ENUM: {},
        MAP: {},
        OPTION: []
    }
}
const a = createEnem({
    like: [ 1, '备注' ]
})

// 输出
{ 
    ENUM: {
        like: 1
    },
    MAP: {
        1: 'like'
    },
    OPTION: [
        {
            value: 1,
            label: '备注'
        }
    ]
}