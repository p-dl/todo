"use strict";
var Item = /** @class */ (function () {
    function Item(task, state) {
        this.task = task;
        this.state = state;
    }
    Item.prototype.addNew = function () {
        var listItem = document.createTextNode(this.task);
        var btnDelete = document.createElement('button');
        var btnCompleted = document.createElement('button');
        btnDelete.innerText = "Delete";
        btnCompleted.innerText = "Mark as completed";
        btnDelete.classList.add("btn");
        btnDelete.classList.add("btn-danger");
        btnDelete.onclick = function (e) { markDelete(e); };
        btnCompleted.classList.add("btn");
        btnCompleted.classList.add("btn-success");
        btnCompleted.onclick = function (e) { markCompleted(e); };
        if (this.state) {
            var liUp = document.createElement('li');
            liUp.classList.add("list-group-item");
            liUp.setAttribute("id", "list_".concat(Item.counter++));
            liUp.appendChild(listItem);
            liUp.appendChild(btnDelete);
            liUp.appendChild(btnCompleted);
            var todoUL = document.getElementById('todoUL');
            todoUL.appendChild(liUp);
        }
        else {
            var liDown = document.createElement('li');
            liDown.classList.add("list-group-item");
            liDown.setAttribute("id", "list_".concat(Item.counter++));
            liDown.appendChild(listItem);
            liDown.appendChild(btnDelete);
            var completedUL = document.getElementById('completedUL');
            completedUL.appendChild(liDown);
        }
    };
    Item.removeAll = function () {
        document.getElementById("todoUL").innerHTML = "";
        document.getElementById("completedUL").innerHTML = "";
    };
    Item.counter = 0;
    return Item;
}());
var saved = { states: localStorage.states && JSON.parse(localStorage.states) || [], items: localStorage.items && JSON.parse(localStorage.items) || [] };
reclone();
var save = document.getElementById('save');
var msg = document.getElementById('message');
function reclone() {
    Item.removeAll();
    Item.counter = 0;
    saved.items.forEach(function (todo, index) {
        new Item(todo, saved.states[index]).addNew();
    });
}
save.onclick = function (e) {
    e.preventDefault();
    var item = document.getElementById('todoName').value;
    saved.states.push(true);
    saved.items.push(item);
    localStorage.setItem("states", JSON.stringify(saved.states));
    localStorage.setItem("items", JSON.stringify(saved.items));
    new Item(item, true).addNew();
    var inputForm = document.getElementById('inputForm');
    msg.innerText = "ToDo ".concat(item, " added successfully.");
    inputForm.reset();
};
function markCompleted(e) {
    var parentId = e.target.parentNode.id;
    var index = parseInt(parentId.split('_')[1]);
    saved.states.splice(index, 1, !saved.states[index]);
    localStorage.setItem("states", JSON.stringify(saved.states));
    reclone();
    msg.innerText = "One Todo item moved to completed.";
}
function markDelete(e) {
    var parentId = e.target.parentNode.id;
    var index = parseInt(parentId.split('_')[1]);
    saved.states.splice(index, 1);
    saved.items.splice(index, 1);
    localStorage.setItem("states", JSON.stringify(saved.states));
    localStorage.setItem("items", JSON.stringify(saved.items));
    reclone();
    msg.innerText = "One Todo item has been deleted.";
}
function clearAll() {
    localStorage.clear();
    saved.items = [];
    saved.states = [];
    reclone();
    msg.innerText = "All Todo items have been cleared.";
}
