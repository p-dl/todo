type Saved = {
    items: Array<string>
    areCompleted: Array<boolean>
}
interface Item {
    item: string
    isCompleted: boolean
    createList(): void
    addNew(item: String): void
    delete(e: Event): void
    complete(e: Event): void
}

let msg: HTMLElement = document.getElementById('message')!

class Todo implements Item {
    item: string
    isCompleted: boolean
    static counter: number = 0
    constructor(item: string, isCompleted: boolean) {
        this.item = item
        this.isCompleted = isCompleted
    }
    createList(): void {
        let listItem = document.createTextNode(this.item)
        let btnDelete = document.createElement('button')
        let btnCompleted = document.createElement('button')
        btnDelete.innerText = "Delete"
        btnCompleted.innerText = "Mark as completed"
        btnDelete.classList.add("btn")
        btnDelete.classList.add("btn-danger")
        btnDelete.onclick = (e) => this.delete(e)
        btnCompleted.classList.add("btn")
        btnCompleted.classList.add("btn-success")
        btnCompleted.onclick = (e) => this.complete(e)
        if (!this.isCompleted) {
            let liUp = document.createElement('li')
            liUp.classList.add("list-group-item")
            liUp.setAttribute("id", `list_${Todo.counter++}`)
            liUp.appendChild(listItem)
            liUp.appendChild(btnDelete)
            liUp.appendChild(btnCompleted)
            let todoUL: HTMLElement = document.getElementById('todoUL')!
            todoUL.appendChild(liUp)
        }
        else {
            let liDown = document.createElement('li')
            liDown.classList.add("list-group-item")
            liDown.setAttribute("id", `list_${Todo.counter++}`)
            liDown.appendChild(listItem)
            liDown.appendChild(btnDelete)
            let completedUL: HTMLElement = document.getElementById('completedUL')!
            completedUL.appendChild(liDown)
        }
    }
    addNew(): void {
        saved.items.push(this.item)
        saved.areCompleted.push(false)
        localStorage.setItem("items", JSON.stringify(saved.items))
        localStorage.setItem("areCompleted", JSON.stringify(saved.areCompleted))
        let inputForm: HTMLFormElement = <HTMLFormElement>document.getElementById('inputForm')
        inputForm.reset()
        Todo.reclone()
        msg.innerText = `New todo: ${this.item} has been added.`
    }
    delete(e: Event): void {
        let parentId: string = (<HTMLLIElement>(<HTMLButtonElement>e.target).parentNode).id
        let index: number = parseInt(parentId.split('_')[1])
        saved.items.splice(index, 1)
        saved.areCompleted.splice(index, 1)
        localStorage.setItem("items", JSON.stringify(saved.items))
        localStorage.setItem("areCompleted", JSON.stringify(saved.areCompleted))
        Todo.reclone()
        msg.innerText = `Todo ${this.item} has been removed.`
    }
    complete(e: Event): void {
        let parentId: string = (<HTMLLIElement>(<HTMLButtonElement>e.target).parentNode).id
        let index: number = parseInt(parentId.split('_')[1])
        saved.areCompleted.splice(index, 1, !saved.areCompleted[index])
        localStorage.setItem("areCompleted", JSON.stringify(saved.areCompleted))
        Todo.reclone()
        msg.innerText = `Todo ${this.item} is marked completed.`
    }
    static clearAll(): void {
        localStorage.clear()
        saved.items = []
        saved.areCompleted = []
        Todo.reclone()
        msg.innerText = `All Todo items are cleared.`
    }
    static reclone(): void {
        document.getElementById("todoUL")!.innerHTML = ""
        document.getElementById("completedUL")!.innerHTML = ""
        Todo.counter = 0
        saved.items.forEach((item: string, index: number) => {
            new Todo(item, saved.areCompleted[index]).createList()
        })
    }
}

let saved: Saved = { items: localStorage.items && JSON.parse(localStorage.items) || [], areCompleted: localStorage.areCompleted && JSON.parse(localStorage.areCompleted) || [] }
let addButton: HTMLElement = document.getElementById('addButton')!
let clearButton: HTMLElement = document.getElementById('clearButton')!
addButton.onclick = (e: Event) => {
    e.preventDefault()
    let item: string = (<HTMLInputElement>document.getElementById('todoName')!).value
    if (item === "") {
        msg.innerHTML = `<div class="alert alert-danger">Cannot add empty item.</div>`
    } else {
        new Todo(item, false).addNew()
    }
}
clearButton.onclick = () => {
    Todo.clearAll()
}