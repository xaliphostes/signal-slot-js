# Signal-Slot library à la Qt

[Signal/Slot pattern](https://en.wikipedia.org/wiki/Signals_and_slots) implemented in TypeScript.
No dependency, small and efficient library. We try to follow the [Qt](https://doc.qt.io/qt-5/signalsandslots.html) syntax for the connection, i.e., `connect(emitter, signal, receiver, slot)`.
Only 4Ko for the mignified library.

Slot can be any method from a class, a setter, an arrow function or any function with any number of arguments.

## Installation
```
npm install
npm run build
```

## Testing
```
npm run test
```

## Running examples
All examples are in the `examples` directory. Run them using `ts-node`

## Usage
```ts
import {create, emit, connect} from 'signal-slot'

// ----------------------------------------------

class Task {
    constructor(public name: string, public ms: number) {
        create(this, 'finished')
    }
    
    run() {
        console.log(`Task ${this.name} is running for ${this.ms}ms...`)
        setTimeout( () => {
            emit(this, 'finished')
        }, this.ms) 
    }
}

// ----------------------------------------------

class CombinedLatest {
    private doneTask1 = false
    private doneTask2 = false

    constructor(private task1: Task, private task2: Task) {
        connect({sender: task1, signal: 'finished', receiver: () => this.doneTask(1)})
        connect({sender: task2, signal: 'finished', receiver: () => this.doneTask(2)})
    }

    doneTask(n: number) {
        console.log('done doing task', n)
        switch(n) {
            case 1: this.doneTask1 = true; break
            case 2: this.doneTask2 = true; break
        }
        if (this.doneTask1 && this.doneTask2) {
            console.log('doing task combined')
            this.doneTask1 = false
            this.doneTask2 = false
        }
    }
}

// ----------------------------------------------

const task1 = new Task('task 1', 500)
const task2 = new Task('task 2', 3000)
const combined = new CombinedLatest(task1, task2)

task1.run()
task2.run()
```

## License
MIT License