"use strict";
class Todo {
    constructor(item, isCompleted) {
        this.item = item;
        this.isCompleted = isCompleted;
    }
    createList() {
        let listItem = document.createTextNode(this.item);
        let btnDelete = document.createElement('button');
        let btnCompleted = document.createElement('button');
        btnDelete.innerText = "Delete";
        btnCompleted.innerText = "Mark as completed";
        btnDelete.classList.add("btn");
        btnDelete.classList.add("btn-danger");
        btnDelete.onclick = (e) => this.delete(e);
        btnCompleted.classList.add("btn");
        btnCompleted.classList.add("btn-success");
        btnCompleted.onclick = (e) => this.complete(e);
        this.isCompleted ? (() => {
            let liDown = document.createElement('li');
            liDown.classList.add("list-group-item");
            liDown.setAttribute("id", `list_${Todo.counter++}`);
            liDown.appendChild(listItem);
            liDown.appendChild(btnDelete);
            let completedUL = document.getElementById('completedUL');
            completedUL.appendChild(liDown);
        })() : (() => {
            let liUp = document.createElement('li');
            liUp.classList.add("list-group-item");
            liUp.setAttribute("id", `list_${Todo.counter++}`);
            liUp.appendChild(listItem);
            liUp.appendChild(btnDelete);
            liUp.appendChild(btnCompleted);
            let todoUL = document.getElementById('todoUL');
            todoUL.appendChild(liUp);
        })();
    }
    addNew() {
        saved.items.push(this.item);
        saved.areCompleted.push(this.isCompleted);
        localStorage.setItem("items", JSON.stringify(saved.items));
        localStorage.setItem("areCompleted", JSON.stringify(saved.areCompleted));
        let inputForm = document.getElementById('inputForm');
        inputForm.reset();
        Todo.reclone();
        msg.innerText = `New todo: ${this.item} has been added.`;
    }
    delete(e) {
        let parentId = e.target.parentNode.id;
        let index = parseInt(parentId.split('_')[1]);
        saved.items.splice(index, 1);
        saved.areCompleted.splice(index, 1);
        localStorage.setItem("items", JSON.stringify(saved.items));
        localStorage.setItem("areCompleted", JSON.stringify(saved.areCompleted));
        Todo.reclone();
        msg.innerText = `Todo ${this.item} has been removed.`;
    }
    complete(e) {
        let parentId = e.target.parentNode.id;
        let index = parseInt(parentId.split('_')[1]);
        saved.areCompleted.splice(index, 1, !saved.areCompleted[index]);
        localStorage.setItem("areCompleted", JSON.stringify(saved.areCompleted));
        Todo.reclone();
        msg.innerText = `Todo ${this.item} is marked completed.`;
    }
    static clearAll() {
        localStorage.clear();
        saved.items = [];
        saved.areCompleted = [];
        Todo.reclone();
        msg.innerText = `All Todo items are cleared.`;
    }
    static reclone() {
        document.getElementById("todoUL").innerHTML = "";
        document.getElementById("completedUL").innerHTML = "";
        Todo.counter = 0;
        saved.items.forEach((item, index) => {
            new Todo(item, saved.areCompleted[index]).createList();
        });
    }
    static emptyMessage() {
        msg.innerHTML = `<div class="alert alert-danger">Cannot add empty item.</div>`;
    }
}
Todo.counter = 0;
let saved = {
    items: localStorage.items ? JSON.parse(localStorage.items) : [],
    areCompleted: localStorage.areCompleted ? JSON.parse(localStorage.areCompleted) : []
};
let addButton = document.getElementById('addButton');
let clearButton = document.getElementById('clearButton');
let msg = document.getElementById('message');
const startApp = (todoItem = "", isCompleted = true) => {
    var todo = new Todo(todoItem, isCompleted);
    isCompleted ? Todo.reclone() : todo.addNew();
};
startApp();
addButton.onclick = (e) => {
    e.preventDefault();
    let item = document.getElementById('todoName').value.trim();
    if (item === "") {
        Todo.emptyMessage();
    }
    else {
        startApp(item, false);
    }
};
clearButton.onclick = () => {
    Todo.clearAll();
};
