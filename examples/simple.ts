import {create, connect, emit} from '../src'
 
class T {
    constructor(public name: string) {
        create(this, 'finished')
        connect({sender: this, signal: 'finished', receiver: this, slot: 'done'})
    }
    start(sender?: T) {
        console.log(`${this.name} is starting from sender ${sender?sender.name:'-none-'}`)
        setTimeout( () => emit(this, 'finished', this), 500) 
    }
    done()  {
        console.log(this.name, 'is done')
    }
}
 
const a = new T('A')
const b = new T('B')
connect({sender: a, signal: 'finished', receiver: b, slot: 'start'})
connect({sender: b, signal: 'finished', receiver: (sender: T) => console.log('All done after '+sender.name)})
a.start()

/*
Will display:
-------------
A is starting from sender -none-
A is done
B is starting from sender A
B is done
All done after B
*/