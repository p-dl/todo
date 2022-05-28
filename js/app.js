"use strict";
class Item {
    constructor(task, state) {
        this.task = task;
        this.state = state;
        const listItem = document.createTextNode(task);
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
        if (state) {
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
}
Item.counter = 0;
const saved = { states: localStorage.states && JSON.parse(localStorage.states) || [], items: localStorage.items && JSON.parse(localStorage.items) || [] };
saved.items.forEach((todo, index) => {
    new Item(todo, saved.states[index]);
});
let save = document.getElementById('save');
save.onclick = function (e) {
    e.preventDefault();
    let todoName = document.getElementById('todoName');
    const item = todoName.value;
    saved.states.push(true);
    saved.items.push(item);
    localStorage.setItem("states", JSON.stringify(saved.states));
    localStorage.setItem("items", JSON.stringify(saved.items));
    new Item(item, true);
    let inputForm = document.getElementById('inputForm');
    let msg = document.getElementById('message');
    msg.innerHTML = `<div class="alert alert-success">ToDo ${item} added successfully.</div>`;
    inputForm.reset();
};
const markCompleted = (e) => {
    let parent = e.target.parentNode;
    let parentId = parent.id;
    let num = parseInt(parentId.split('_')[1]);
    saved.states.splice(num, 1, !saved.states[num]);
    localStorage.setItem("states", JSON.stringify(saved.states));
    location.reload();
};
const markDelete = (e) => {
    let parent = e.target.parentNode;
    let parentId = parent.id;
    let num = parseInt(parentId.split('_')[1]);
    saved.states.splice(num, 1);
    saved.items.splice(num, 1);
    localStorage.setItem("states", JSON.stringify(saved.states));
    localStorage.setItem("items", JSON.stringify(saved.items));
    location.reload();
};
const clearAll = () => {
    localStorage.clear();
    location.reload();
};
