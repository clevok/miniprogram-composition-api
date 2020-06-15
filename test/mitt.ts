import {mitt} from '../src/mitt';

const _miit = mitt();
_miit.on('type', (value) => {
    console.log('on', value);
});

const handle = _miit.once('type', (value) => {
    console.log('once', value);
})

_miit.emit('type', 'along')
_miit.emit('type', 'along2')