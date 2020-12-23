# Signal-Slot library "à la" Qt

[Signal/Slot pattern](https://en.wikipedia.org/wiki/Signals_and_slots) implemented in TypeScript.

- No dependency, small (only **4ko** in mignified mode) and efficient library.

- We try to follow the [Qt](https://doc.qt.io/qt-5/signalsandslots.html) syntax for the connection, i.e., `connect(sender, signal, receiver, slot)`.

- Slot can be any method from a class, a setter, an arrow function or any function with any number of arguments.

- Allows to `connect/disconnect` and `lock/unlock` connections

## Installation
```
npm i signal-slot-js
```
or from the sources
```
git checkout git@github.com:xaliphostes/signal-slot-js.git
npm install
npm run build
```

## Testing
Require `node` version > 11
```
npm run test
```

## Running examples
All examples are in the `examples` directory. Run them using `ts-node`

## Usage
The following example shows how to implement the [combineLatest](https://www.learnrxjs.io/learn-rxjs/operators/combination/combinelatest) from [RxJS](https://github.com/ReactiveX/rxjs).

It will create the following:
```
  task1 ---\
            ---> CombineLatest --> task3
  rask2 ---/
```
`task3` is launched only when `task1` **AND** `task2` are done.
```ts
import {create, emit, connect} from 'signal-slot'

// ----------------------------------------------

class Task {
    constructor(public name: string, public ms: number) {
        // Create a signal for this class
        create(this, 'finished')
    }
    
    run() {
        console.log(`Task ${this.name} is running for ${this.ms}ms...`)
        // Emit a signal
        setTimeout( () => emit(this, 'finished'), this.ms)
    }
}

// ----------------------------------------------

// Will be executed when task1 AND task2 are done
class CombineLatest {
    private doneTask1 = false
    private doneTask2 = false

    constructor(private task1: Task, private task2: Task) {
        // Create a signal for this class
        create(this, 'done')
        // Perform two connections
        connect({sender: task1, signal: 'finished', receiver: () => this.doneTask(1)})
        connect({sender: task2, signal: 'finished', receiver: () => this.doneTask(2)})
    }

    private doneTask(n: number) {
        console.log('done doing task', n)
        switch(n) {
            case 1: this.doneTask1 = true; break
            case 2: this.doneTask2 = true; break
        }
        if (this.doneTask1 && this.doneTask2) {
            console.log('doing task combine')
            this.doneTask1 = false
            this.doneTask2 = false
            // Emit a signal
            emit(this, 'done')
        }
    }
}

// ----------------------------------------------

const task1   = new Task('task 1', 500)
const task2   = new Task('task 2', 3000)
const combine = new CombineLatest(task1, task2)

// Perform a connection
connect({
    sender: combine, 
    signal: 'done', 
    receiver: () => console.log('All done!')
})

// Run the 2 tasks in parallel and trigger combine
// when both are done
task1.run()
task2.run()
```

## License
MIT License