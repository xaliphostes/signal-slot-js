import {create, emit, connect} from '../src'

class Task {
    value = Math.round(Math.random()*10)

    constructor(public name: string, public ms: number) {
        create(this, 'finished')
    }
    run(value?: number) {
        if (value !== undefined) {
            this.value = value
        }

        console.log(`${this.name} is running for ${this.ms}ms with value ${this.value}...`)
        setTimeout( () => emit(this, 'finished', this.value), this.ms)
    }
}

// Will be executed when task1 AND task2 are done
class CombineLatest {
    private done : Array<boolean> = []
    private names: Array<string> = []
    private total = 0

    constructor() {
        create(this, 'finished')
    }

    addTask(task: Task) {
        const n = this.done.length
        this.done.push(false)
        this.names.push(task.name)
        connect({
            sender: task, 
            signal: 'finished', 
            receiver: (v: number) => this.doneTask(n, v)
        })
    }

    private doneTask(N: number, value: number) {
        this.total += value
        this.done[N] = true
        let n = 0
        this.done.forEach( v => n += v===true?1:0)
        
        if (n === this.done.length) {
            console.log('all input tasks are done')
            this.done = this.done.map( v => false)
            emit(this, 'finished', this.total)
        }
        else {
            let n = 0
            this.done.forEach( v => n += v===false?1:0)
            console.log(`task ${this.names[N]} (with value ${value}) is done but still waiting for ${n} task${n>1?'s':''}`)
        }
    }
}

class Timer {
    constructor() {
        console.time('Elasped time')
    }
    end(value: number) {
        console.log('All done with sum =', value)
        console.timeEnd('Elasped time')
    }
}

// Create the following:
// ========================================
// task1 ---\
// task2 ------> CombineLatest --> task4
// rask3 ---/
// ========================================
//
// task4 is launched only when task1 AND task2 AND task3 are done

const task1 = new Task('A'  , 3000)
const task2 = new Task('B'   , 1000)
const task3 = new Task('C'      , 2000)
const task4 = new Task('D', 1500)

const combine = new CombineLatest
combine.addTask(task1)
combine.addTask(task2)
combine.addTask(task3)
connect({sender: combine, signal: 'finished', receiver: task4, slot: 'run'})

const timer = new Timer
connect({sender: task4, signal: 'finished', receiver: timer, slot: 'end'})

// Run the 3 tasks in parallel and trigger combine (which will call task4)
// when both are done
task1.run()
task2.run()
task3.run()
