import {create, emit, connect} from './signal-slot'

class Counter {
    private _value: number = 0

  constructor() {
      create(this, 'valueChanged')
  }

  get value() {
      return this._value
  }
  
  // Slot Setter
  set value(value) { // slot
      if (value != this._value) {
          this._value = value
          emit(this, 'valueChanged', value)
      }
  }
  
  // Slot Arrow
  showDouble = () => {
      console.log(`2*${this._value} = ${2*this._value}`)
  }

  // Slot Method
  showTripple() {
      console.log(`3*${this._value} = ${3*this._value}`)
  }
  
  // Slot multiple arguments
  setParams(a: any, b: any, c: any) {
      console.log(`method with 3 params: a=${a} b=${b} c=${c}`)
  }
}

describe('test', () => {

    let _value = 0
    const changeValue = (v: number) => {
        _value = v
    }

    let _double = 0
    const setDouble = (v: number) => {
        _double = 2*v
    }

    test('changes', async () => {
        const a = new Counter()
        const b = new Counter()

        expect( connect({sender: a, signal: 'valueChanged',  receiver: b, slot: 'value'}) ).toBe(true)
        expect( connect({sender: a, signal: 'valueChanged',  receiver: changeValue}) ).toBe(true)
        expect( connect({sender: b, signal: 'valueChanged',  receiver: setDouble}) ).toBe(true)

        // Check init values
        expect( b.value ).toBe(0)
        expect( _value ) .toBe(0)
        expect( _double ).toBe(0)

        a.value = 12
        expect( b.value ).toBe(12)
        expect( _value ) .toBe(12)
        expect( _double ).toBe(24) // since b was triggered
        
        b.value = 48
        expect( b.value ).toBe(48)
        expect( _double ).toBe(96)

        a.value = 12 // does not trigger anything since same value for a
        expect( b.value ).toBe(48)
    })

})
