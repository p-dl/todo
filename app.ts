class Item {
    task: string
    state: boolean
    static counter: number = 0
    constructor(task: string, state: boolean) {
        this.task = task
        this.state = state
        const listItem = document.createTextNode(task)
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

        if (state) {
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
}

const saved = { states: localStorage.states && JSON.parse(localStorage.states) || [], items: localStorage.items && JSON.parse(localStorage.items) || [] }
saved.items.forEach((todo: string, index: number) => {
    new Item(todo, saved.states[index])
});

let save: HTMLElement = document.getElementById('save')!
save.onclick = function (e: Event) {
    e.preventDefault()
    let todoName: HTMLInputElement = <HTMLInputElement>document.getElementById('todoName')
    const item: string = todoName.value
    saved.states.push(true)
    saved.items.push(item)
    localStorage.setItem("states", JSON.stringify(saved.states))
    localStorage.setItem("items", JSON.stringify(saved.items))
    new Item(item, true)
    let inputForm: HTMLFormElement = <HTMLFormElement>document.getElementById('inputForm')
    let msg = document.getElementById('message')!
    msg.innerHTML = `<div class="alert alert-success">ToDo ${item} added successfully.</div>`
    inputForm.reset()
}

const markCompleted = (e: Event) => {
    let parent = (e.target as HTMLButtonElement).parentNode
    let parentId = (parent as HTMLDataListElement).id
    let num: number = parseInt(parentId.split('_')[1])
    saved.states.splice(num, 1, !saved.states[num])
    localStorage.setItem("states", JSON.stringify(saved.states))
    location.reload()
}

const markDelete = (e: Event) => {
    let parent = (e.target as HTMLButtonElement).parentNode
    let parentId = (parent as HTMLDataListElement).id
    let num: number = parseInt(parentId.split('_')[1])
    saved.states.splice(num, 1)
    saved.items.splice(num, 1)
    localStorage.setItem("states", JSON.stringify(saved.states))
    localStorage.setItem("items", JSON.stringify(saved.items))
    location.reload()
}

const clearAll = () => {
    localStorage.clear()
    location.reload()
}