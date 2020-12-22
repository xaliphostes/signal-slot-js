import {create, connect, disconnect, emit, lock, unlock, isLocked} from '../src'

class A {
    _value = 0
    constructor(public name: string) {    
        create(this, 'valueChanged')
    }
    set value(b: number) {
        if (this._value !== b) {
            console.log(this.name, ': Change the value from', this._value, 'to', b)
            this._value = b
            emit(this, "valueChanged", this._value)
        }
    }
    get value() {return this._value}
}

// ----------------------------------------------

const a = new A('a')
const b = new A('b')

const conn3 = {sender: a, signal: 'valueChanged', receiver: (v:number) => console.log('-->', v)}
const conn1 = {sender: a, signal: 'valueChanged', receiver: b, slot: 'value'}
const conn2 = {sender: b, signal: 'valueChanged', receiver: a, slot: 'value'}

connect(conn1)
connect(conn2)
connect(conn3)

a.value = 12
a.value = 12
b.value = 1

disconnect(conn1)
disconnect(conn2)
a.value = 2

lock(conn3)
a.value = 3
unlock(conn3)
a.value = 4
