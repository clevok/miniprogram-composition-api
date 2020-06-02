import { observable, autorun, computed, isComputed } from 'mobx';

const number = observable.box(10);
const plus = computed(() => {
    console.log('计算变化');
    return number.get() > 0
});
console.log(isComputed(plus), isComputed(number));
number.set(-19);