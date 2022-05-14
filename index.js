const todoSection = document.querySelector(".todo-list-container");
const div = document.querySelector(".todo-list");
const addTodo = document.querySelector(".add-todo");
const checkbox = document.querySelector("input[type=checkbox]");
const img2 = document.querySelector(".todo-list > img");
const all = document.querySelector(".all-btn");
const completedBtn = document.querySelector(".completed-btn");
const activeBtn = document.querySelector(".active-btn");
const itemsLeft = document.querySelector(".items-left");
const toggletheme = document.querySelector(".theme");
const clearCompletedBtn = document.querySelector(".clear-btn");

document.addEventListener("DOMContentLoaded", () => {
  const todos = getTodos();
  console.log(todos);
  for (const todo of todos) {
    addNewTodo(todo);
    todoSection.appendChild(divContainer);
  }
  countItemsleft();
});

// getting the todos from the local storage if there are any and if there arn't then initialzing it with empty array so that i can spread it in todosArray
const prevtodo = JSON.parse(localStorage.getItem("myTodo"));
const isprevtodo = prevtodo ? [...prevtodo] : [];
const todosArray = [...isprevtodo];

console.log(todosArray);

// making some elements global so that they can be accessed in other functions
let divContainer;
let input;

function addNewTodo(textContent) {
  // Creating elements
  divContainer = document.createElement("div");
  const span = document.createElement("span");
  const input = document.createElement("input");
  const label = document.createElement("label");
  const img = document.createElement("img");

  const id = uid();

  // adding attributes
  divContainer.classList.add("todo-list");
  divContainer.id = "drag";
  divContainer.draggable = true;
  span.classList.add("circle-checkbox");
  input.type = "checkbox";
  input.id = id;
  label.htmlFor = id;
  img.classList.add("delete-todo");
  img.src = "./images/icon-cross.svg";
  label.textContent = textContent;

  // removing the element from the DOM and deleting the todo from the local storage
  img.addEventListener("click", (e) => {
    console.log("deleted");
    e.target.parentElement.remove();
    for (let i = 0; i < todosArray.length; i++) {
      if (todosArray[i] === label.textContent) {
        todosArray.splice(i, 1);
      }
    }
    saveTodos();
    countItemsleft();
  });
  input.addEventListener("change", countItemsleft);

  // drag event
  divContainer.addEventListener("dragover", dragOver);
  divContainer.addEventListener("dragenter", dragEnter);
  divContainer.addEventListener("dragleave", dragLeave);

  divContainer.addEventListener("dragend", (e) => {
    const removeClassList = document.querySelectorAll(".todo-list");
    removeClassList.forEach((item) => {
      item.classList.remove("over");
    });
  });

  new Sortable(todoSection);
  // appending to div container
  divContainer.appendChild(span);
  divContainer.appendChild(input);
  divContainer.appendChild(label);
  divContainer.appendChild(img);
}

// unique id
function uid() {
  const head = Date.now().toString(36);
  const tail = Math.random().toString(36).substr(2);
  return head + tail;
}

// get todos from local storage
function getTodos() {
  const todosString = localStorage.getItem("myTodo");
  return JSON.parse(todosString);
}
function newTodo() {
  const todos = getTodos();
  const id = uid();
  addNewTodo(todos.at(-1));
}

function saveTodos() {
  return localStorage.setItem("myTodo", JSON.stringify(todosArray));
}

// Adding a new todo
const todoInput = document.querySelector(".add-todo");
todoInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    todosArray.push(addTodo.value.trim());
    saveTodos();
    newTodo();
    addTodo.value = "";
    countItemsleft();
    todoSection.appendChild(divContainer);
  }
});

// items left
function countItemsleft() {
  let count = 0;
  document.querySelectorAll(".todo-list").forEach((todo) => {
    if (!todo.querySelector("input").checked) {
      count += 1;
    }
  });
  itemsLeft.textContent = `${count} items left`;
}
function clearCompleted() {
  document.querySelectorAll(".todo-list").forEach((todo) => {
    if (todo.querySelector("input").checked) {
      for (let i = 0; i < todosArray.length; i++) {
        if (todosArray[i] === todo.querySelector("label").textContent) {
          todosArray.splice(i, 1);
        }
      }
      saveTodos();
      todo.remove();
    }
  });
}

function showCompleted() {
  showAll();
  document.querySelectorAll(".todo-list").forEach((todo) => {
    if (!todo.querySelector("input").checked) {
      todo.style.display = "none";
    }
  });
}
function showActive() {
  showAll();
  document.querySelectorAll(".todo-list").forEach((todo) => {
    if (todo.querySelector("input").checked) {
      todo.style.display = "none";
    }
  });
}
function showAll() {
  document.querySelectorAll(".todo-list").forEach((todo) => {
    todo.style.display = "flex";
  });
}

// button addEventListener
completedBtn.addEventListener("click", showCompleted);
activeBtn.addEventListener("click", showActive);
all.addEventListener("click", showAll);
clearCompletedBtn.addEventListener("click", clearCompleted);

// toggle theme
function toggleThemefunc() {
  document.body.classList.toggle("lightmode");
}
toggletheme.addEventListener("click", toggleThemefunc);

// Drag functionalities

function dragOver(e) {
  e.preventDefault();
}

function dragEnter() {
  this.classList.add("over");
}
function dragLeave() {
  this.classList.remove("over");
}
