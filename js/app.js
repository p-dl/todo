"use strict";
class Item {
    constructor(task, state) {
        this.task = task;
        this.state = state;
    }
    addNew() {
        const listItem = document.createTextNode(this.task);
        const btnDelete = document.createElement('button');
        const btnCompleted = document.createElement('button');
        btnDelete.innerText = "Delete";
        btnCompleted.innerText = "Mark as completed";
        btnDelete.classList.add("btn");
        btnDelete.classList.add("btn-danger");
        btnDelete.onclick = function (e) { markDelete(e); };
        btnCompleted.classList.add("btn");
        btnCompleted.classList.add("btn-success");
        btnCompleted.onclick = function (e) { markCompleted(e); };
        if (this.state) {
            const liUp = document.createElement('li');
            liUp.classList.add("list-group-item");
            liUp.setAttribute("id", `list_${Item.counter++}`);
            liUp.appendChild(listItem);
            liUp.appendChild(btnDelete);
            liUp.appendChild(btnCompleted);
            let todoUL = document.getElementById('todoUL');
            todoUL.appendChild(liUp);
        }
        else {
            const liDown = document.createElement('li');
            liDown.classList.add("list-group-item");
            liDown.setAttribute("id", `list_${Item.counter++}`);
            liDown.appendChild(listItem);
            liDown.appendChild(btnDelete);
            let completedUL = document.getElementById('completedUL');
            completedUL.appendChild(liDown);
        }
    }
    static removeAll() {
        let element = document.getElementById("todoUL");
        while (element.firstChild) {
            element.removeChild(element.firstChild);
        }
        element = document.getElementById("completedUL");
        while (element.firstChild) {
            element.removeChild(element.firstChild);
        }
    }
}
Item.counter = 0;
const saved = { states: localStorage.states && JSON.parse(localStorage.states) || [], items: localStorage.items && JSON.parse(localStorage.items) || [] };
reclone();
function reclone() {
    Item.removeAll();
    Item.counter = 0;
    saved.items.forEach((todo, index) => {
        new Item(todo, saved.states[index]).addNew();
    });
}
let save = document.getElementById('save');
let msg = document.getElementById('message');
save.onclick = function (e) {
    e.preventDefault();
    let todoName = document.getElementById('todoName');
    const item = todoName.value.toString();
    saved.states.push(true);
    saved.items.push(item);
    localStorage.setItem("states", JSON.stringify(saved.states));
    localStorage.setItem("items", JSON.stringify(saved.items));
    new Item(item, true).addNew();
    let inputForm = document.getElementById('inputForm');
    msg.innerText = `ToDo ${item} added successfully.`;
    inputForm.reset();
};
function markCompleted(e) {
    let parent = e.target.parentNode;
    let parentId = parent.id;
    let num = parseInt(parentId.split('_')[1]);
    saved.states.splice(num, 1, !saved.states[num]);
    localStorage.setItem("states", JSON.stringify(saved.states));
    reclone();
}
function markDelete(e) {
    let parent = e.target.parentNode;
    let parentId = parent.id;
    let num = parseInt(parentId.split('_')[1]);
    saved.states.splice(num, 1);
    saved.items.splice(num, 1);
    localStorage.setItem("states", JSON.stringify(saved.states));
    localStorage.setItem("items", JSON.stringify(saved.items));
    reclone();
}
function clearAll() {
    localStorage.clear();
    saved.items = [];
    saved.states = [];
    reclone();
    msg.innerText = `Todo lists has been cleared.`;
}
