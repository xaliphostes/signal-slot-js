import {create, emit, connect} from '../src'

// ----------------------------------------------

class Task {
    constructor(public name: string, public ms: number) {
        create(this, 'finished')
    }
    run() {
        console.log(`Task ${this.name} is running for ${this.ms}ms...`)
        setTimeout( () => emit(this, 'finished'), this.ms) 
    }
}

// ----------------------------------------------

// Will be executed when task1 AND task2 are done
class CombinedLatest {
    private doneTask1 = false
    private doneTask2 = false

    constructor(task1: Task, task2: Task) {
        create(this, 'finished')
        connect({sender: task1, signal: 'finished', receiver: () => this.doneTask(1)})
        connect({sender: task2, signal: 'finished', receiver: () => this.doneTask(2)})
        console.time('Total elapsed time')
    }

    private doneTask(n: number) {
        console.log('done doing task', n)
        switch(n) {
            case 1: this.doneTask1 = true; break
            case 2: this.doneTask2 = true; break
        }
        if (this.doneTask1 && this.doneTask2) {
            console.log('task 1 and 2 are done. Doing combined-latest');
            this.doneTask1 = false
            this.doneTask2 = false
            console.timeEnd('Total elapsed time')
            emit(this, 'finished')
        }
        else {
            if (this.doneTask1) console.log('task 1 is done but still waiting for task 2');
            else console.log('task 2 is done but still waiting for task 1')
        }
    }
}

// ----------------------------------------------

const task1 = new Task('task 1', 3000)
const task2 = new Task('task 2', 2000)
const combined = new CombinedLatest(task1, task2)

connect({sender: combined, signal: 'finished', receiver: () => console.log('All done.')})

// Run the 2 tasks in parallel and trigger combined
// when both are done
task2.run()
task1.run()
