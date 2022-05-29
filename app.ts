type Saved = {
    states: Array<boolean>
    items: Array<string>
}

class Item {
    task: string
    state: boolean
    static counter: number = 0
    constructor(task: string, state: boolean) {
        this.task = task
        this.state = state
    }
    addNew(): void {
        const listItem = document.createTextNode(this.task)
        const btnDelete = document.createElement('button')
        const btnCompleted = document.createElement('button')
        btnDelete.innerText = "Delete"
        btnCompleted.innerText = "Mark as completed"
        btnDelete.classList.add("btn")
        btnDelete.classList.add("btn-danger")
        btnDelete.onclick = function (e) { markDelete(e) }
        btnCompleted.classList.add("btn")
        btnCompleted.classList.add("btn-success")
        btnCompleted.onclick = function (e) { markCompleted(e) }
        if (this.state) {
            const liUp = document.createElement('li')
            liUp.classList.add("list-group-item")
            liUp.setAttribute("id", `list_${Item.counter++}`)
            liUp.appendChild(listItem)
            liUp.appendChild(btnDelete)
            liUp.appendChild(btnCompleted)
            let todoUL: HTMLElement = document.getElementById('todoUL')!
            todoUL.appendChild(liUp)
        }
        else {
            const liDown = document.createElement('li')
            liDown.classList.add("list-group-item")
            liDown.setAttribute("id", `list_${Item.counter++}`)
            liDown.appendChild(listItem)
            liDown.appendChild(btnDelete)
            let completedUL: HTMLElement = document.getElementById('completedUL')!
            completedUL.appendChild(liDown)
        }
    }
    static removeAll(): void {
        document.getElementById("todoUL")!.innerHTML = "";
        document.getElementById("completedUL")!.innerHTML = "";
    }
}

const saved: Saved = { states: localStorage.states && JSON.parse(localStorage.states) || [], items: localStorage.items && JSON.parse(localStorage.items) || [] }
reclone()
let save: HTMLElement = document.getElementById('save')!
let msg: HTMLElement = document.getElementById('message')!

function reclone(): void {
    Item.removeAll()
    Item.counter = 0
    saved.items.forEach((todo: string, index: number): void => {
        new Item(todo, saved.states[index]).addNew()
    })
}

save.onclick = function (e: Event): void {
    e.preventDefault()
    let item: string = (<HTMLInputElement>document.getElementById('todoName')!).value
    saved.states.push(true)
    saved.items.push(item)
    localStorage.setItem("states", JSON.stringify(saved.states))
    localStorage.setItem("items", JSON.stringify(saved.items))
    new Item(item, true).addNew()
    let inputForm: HTMLFormElement = <HTMLFormElement>document.getElementById('inputForm')
    msg.innerText = `ToDo ${item} added successfully.`
    inputForm.reset()
}

function markCompleted(e: Event): void {
    let parentId: string = (<HTMLLIElement>(<HTMLButtonElement>e.target).parentNode).id
    let index: number = parseInt(parentId.split('_')[1])
    saved.states.splice(index, 1, !saved.states[index])
    localStorage.setItem("states", JSON.stringify(saved.states))
    reclone()
    msg.innerText = `One Todo item moved to completed.`
}

function markDelete(e: Event): void {
    let parentId: string = (<HTMLLIElement>(<HTMLButtonElement>e.target).parentNode).id
    let index: number = parseInt(parentId.split('_')[1])
    saved.states.splice(index, 1)
    saved.items.splice(index, 1)
    localStorage.setItem("states", JSON.stringify(saved.states))
    localStorage.setItem("items", JSON.stringify(saved.items))
    reclone()
    msg.innerText = `One Todo item has been deleted.`
}

function clearAll(): void {
    localStorage.clear()
    saved.items = []
    saved.states = []
    reclone()
    msg.innerText = `All Todo items have been cleared.`
}