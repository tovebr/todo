const todoHeaderInput = document.getElementById("todo-header");
const todoDeadlineInput = document.getElementById("todo-deadline");
const todoSubmitInput = document.getElementById("todo-submit");
const todosDisplay = document.getElementById("display-todos");
const doneTodosDisplay = document.getElementById("display-done-todos");
const sortDeadline = document.querySelector(".sort-deadline");
const sortCreated = document.querySelector(".sort-created");

class Todo {
  constructor(id, todoHeader, deadline, creationDate, done = false) {
    (this.id = id),
      (this.todoHeader = todoHeader),
      (this.deadline = deadline),
      (this.creationDate = creationDate),
      (this.done = done);
  }
}

let allTodos = {
  doneTodos: [],
  todos: [],
};

// TEST DATA
/* allTodos.todos.push(
  new Todo(0, "Marsvin", "2021-04-12", "2021-11-04"),
  new Todo(3, "Katt", "2021-09-12", "2021-11-10"),
  new Todo(6, "Äpple", "2021-09-08", "2021-11-18"),
  new Todo(7, "Gräslög", "2021-06-18", "2021-11-20")
); */

// Saving a new todo
todoSubmitInput.addEventListener("click", (e) => {
  e.preventDefault();

  //check that something was entered
  if (todoHeaderInput.value) {
    //save the date of creation
    const creationDate = new Date();
    // string creationdate
    const creationDateShort = `${creationDate.getFullYear()}-${
      creationDate.getMonth() + 1
    }-${creationDate.getDate()}`;

    //create id
    let id = null;
    if (allTodos.todos.length === 0) {
      id = 0;
    } else if (allTodos.todos.length === 1) {
      id = allTodos.todos[0].id + 1;
    } else {
      id =
        allTodos.todos
          .map((todo) => todo.id)
          .reduce((a, b) => (a > b ? a : b)) + 1;
    }
    //save new todo in global array
    allTodos.todos.push(
      new Todo(
        id,
        todoHeaderInput.value,
        todoDeadlineInput.value,
        creationDateShort
      )
    );
    //print new todo in browser
    printCard(allTodos.todos[allTodos.todos.length - 1]);
  }

  //empty input-fields
  todoHeaderInput.value = "";
  todoDeadlineInput.value = "";
});

// function print new todo in browser
function printCard(todo) {
  localStorage.setItem("allTodos", JSON.stringify(allTodos));

  const html = `<div id="${todo.id}" class="card">
          <div class="card-header">
            <h3>${todo.todoHeader}</h3>
          </div>
          <div class="date-container deadline">
            <p>Deadline</p>
            <p class="date-display">${todo.deadline}</p>
          </div>
          <div class="date-container">
            <p>Created</p>
            <p class="date-display">${todo.creationDate}</p>
          </div>
          <div class="card-buttons">
            <button class="btn-done">Done</button>
            <i class="fas fa-edit"></i>
            <i class="fas fa-trash"></i>
          </div>
        </div>`;

  if (todo.done) {
    doneTodosDisplay.insertAdjacentHTML("afterbegin", html);
    const cardDiv = document.getElementById(todo.id);
    cardDiv.classList.toggle("done");
    cardDiv.querySelector(".card-header").classList.toggle("done-header");
  } else {
    todosDisplay.insertAdjacentHTML("afterbegin", html);
  }
}

// Print testdata
/* allTodos.todos.forEach((e) => printCard(e)); */

//eventlistener that hears and directs clicks to right function
todosDisplay.addEventListener("click", (e) => handleClicks(e));
doneTodosDisplay.addEventListener("click", (e) => handleClicks(e));

function handleClicks(e) {
  const { target } = e;
  const element = target.parentNode.parentNode;
  const currTodoArray = element.classList.contains("done")
    ? "doneTodos"
    : "todos";

  //if edi-icon is clicked
  if (target.classList.contains("fas")) {
    editTodo([element.id, currTodoArray, target.classList.value]);
    //if done-icon is clicked
  } else if (target.classList.contains("btn-done")) {
    todoDone([element, currTodoArray]);
  }
}

function editTodo(element) {
  //function recives data on what should be edited
  const [id, currTodoArray, targetClasses] = element;

  //finds index of target
  const index = allTodos[currTodoArray].findIndex(
    (todo) => todo.id === Number(id)
  );

  // displays obj data in inputs for editing
  if (targetClasses.includes("edit")) {
    todoHeaderInput.value = allTodos[currTodoArray][index].todoHeader;
    todoDeadlineInput.value = allTodos[currTodoArray][index].deadline;
  }

  // deletes obj in browser and in array
  deleteUICard(id);
  allTodos[currTodoArray].splice(index, 1);
}

// deletes UI representation of obj
function deleteUICard(id) {
  const todo = document.getElementById(id);
  todo.parentNode.removeChild(todo);
}

// toggles done-class on obj if done-button is pressed
function todoDone(element) {
  const [uiElement, currTodoArray] = element;
  let index, clickedTodo;

  index = allTodos[currTodoArray].findIndex(
    (todo) => todo.id === Number(uiElement.id)
  );

  clickedTodo = allTodos[currTodoArray][index];

  if (currTodoArray === "todos") {
    clickedTodo.done = true;
    allTodos.doneTodos.push(clickedTodo);
    allTodos.todos.splice(index, 1);
    deleteUICard(clickedTodo.id);
  } else {
    clickedTodo.done = false;
    allTodos.todos.push(clickedTodo);
    allTodos.doneTodos.splice(index, 1);
    deleteUICard(clickedTodo.id);
  }

  printCard(clickedTodo);
}

sortDeadline.addEventListener("click", (e) => {
  e.preventDefault();
  //create sortable dates for all todos
  allTodos.todos.forEach((el) => {
    el.deadlineSortable = el.deadline.split("-").join("");
  });
  sortTodos("deadlineSortable");
});

sortCreated.addEventListener("click", (e) => {
  e.preventDefault();
  sortTodos("id");
});

function sortTodos(sortBy) {
  allTodos.todos.sort((a, b) => b[sortBy] - a[sortBy]);
  reprintTodos();
}

function reprintTodos() {
  allTodos.todos.forEach((el) => {
    deleteUICard(el.id);
    printCard(el);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  const ref = localStorage.getItem("allTodos");
  if (ref) {
    allTodos = JSON.parse(ref);
    for (const todoArr of Object.entries(allTodos)) {
      todoArr[1]?.forEach((t) => {
        printCard(t);
      });
    }
  }
});
