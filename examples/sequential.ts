import {create, emit, connect} from '../src'

/*
 * Running sequential circular tasks
 */

class Task {
    constructor(readonly name: string, private ms: number = 1000) {
        create(this, 'finished')
    }
    run() {
        console.log(`Task ${this.name} is running for ${this.ms}ms`)
        setTimeout( () => {
            emit(this, 'finished')
        }, this.ms)
    }
}

class TaskRunner extends Task {
    private startTask: Task

    constructor() {
        super('Runner')
        // task1 -> task2 -> task3 -> task1 -> etc...
        const task1 = new Task('task 1', 1500)
        const task2 = new Task('task 2', 500)
        const task3 = new Task('task 3', 1000)

        connect({sender: task1, signal: 'finished', receiver: task2, slot: 'run'})
        connect({sender: task2, signal: 'finished', receiver: task3, slot: 'run'})
        connect({sender: task3, signal: 'finished', receiver: () => {
            console.timeEnd('Elapsed time')
            console.time('Elapsed time')
        }})
        connect({sender: task3, signal: 'finished', receiver: task1, slot: 'run'}) // circular

        this.startTask = task1
    }

    run() {
        console.time('Elapsed time')
        this.startTask.run()
    }
}

// ----------------------------------------------

const runner = new TaskRunner()
runner.run()
