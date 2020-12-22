const signals = require('../build/signal-slot')

class A {
    constructor(name) {
        this._name = name
        this._value = 0
        signals.create(this, 'valueChanged')
    }
    set value(b) {
        if (this._value !== b) {
            console.log(this._name, ': Change the value from', this._value, 'to', b)
            this._value = b
            signals.emit(this, "valueChanged", this._value)
        }
    }
    get value() {return this._value}
}

// ----------------------------------------------

const a = new A('a')
const b = new A('b')

const conn1 = {sender: a, signal: 'valueChanged', receiver: b, slot: 'value'}
const conn2 = {sender: b, signal: 'valueChanged', receiver: a, slot: 'value'}
const conn3 = {sender: a, signal: 'valueChanged', receiver: v => console.log(v)}

signals.connect(conn1)
signals.connect(conn2)
signals.connect(conn3)

a.value = 12
a.value = 12
b.value = 1

signals.disconnect(conn1)
signals.disconnect(conn2)
a.value = 2

console.log( signals.isLocked(conn3) )
signals.lock(conn3)
console.log( signals.isLocked(conn3) )
a.value = 3
signals.unlock(conn3)
a.value = 4
