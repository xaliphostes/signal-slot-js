import {create, emit, connect} from '../src'

class Task {
    constructor(public name: string, public ms: number) {
        create(this, 'finished')
    }
    run() {
        console.log(`${this.name} is running for ${this.ms}ms...`)
        setTimeout( () => emit(this, 'finished'), this.ms) 
    }
}

// Will be executed when task1 AND task2 are done
class CombineLatest {
    private doneTask1 = false
    private doneTask2 = false

    constructor(task1: Task, task2: Task) {
        create(this, 'finished')
        connect({sender: task1, signal: 'finished', receiver: () => this.doneTask(1)})
        connect({sender: task2, signal: 'finished', receiver: () => this.doneTask(2)})
    }

    private doneTask(n: number) {
        switch(n) {
            case 1: this.doneTask1 = true; break
            case 2: this.doneTask2 = true; break
        }
        if (this.doneTask1 && this.doneTask2) {
            console.log('task 1 AND 2 are done')
            this.doneTask1 = false
            this.doneTask2 = false
            emit(this, 'finished')
        }
        else {
            const done   = this.doneTask1 ? 1 : 2
            console.log(`task ${done} is done but still waiting for task ${3-done}`)
        }
    }
}

// Create the following:
// ========================================
// task1 ---\
//           --> CombineLatest --> task3
// rask2 ---/
// ========================================
//
// task3 is launched only when task1 AND task2 are done

const task1 = new Task('task 1', 3000)
const task2 = new Task('task 2', 2000)
const task3 = new Task('task 3', 1000)
const combined = new CombineLatest(task1, task2)

connect({sender: combined, signal: 'finished', receiver: task3, slot: 'run'})

// Run the 2 tasks in parallel and trigger combined (which will call task3)
// when both are done
task2.run()
task1.run()
