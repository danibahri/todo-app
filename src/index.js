document.addEventListener("DOMContentLoaded", function () {
  const todos = [];
  const RENDER_EVENT = "render-todo";
  const submitForm = document.getElementById("form");

  function generateId() {
    return +new Date();
  }

  function generateTodoObject(id, task, timestamp, isCompleted) {
    return {
      id,
      task,
      timestamp,
      isCompleted,
    };
  }

  function addTodo() {
    const textTodo = document.getElementById("title").value;
    const timestamp = document.getElementById("date").value;
    // console.log("Todo Text:", textTodo);
    // console.log("Timestamp:", timestamp);

    const generateID = generateId();
    const todoObject = generateTodoObject(
      generateID,
      textTodo,
      timestamp,
      false
    );
    todos.push(todoObject);
    document.dispatchEvent(new Event(RENDER_EVENT));
  }

  function makeTodo(todoObject) {
    const textTitle = document.createElement("h2");
    textTitle.innerText = todoObject.task;

    const timeStamp = document.createElement("p");
    timeStamp.innerText = todoObject.timestamp;

    const textContainer = document.createElement("div");
    textContainer.classList.add("inner");
    textContainer.append(textTitle, timeStamp);

    const container = document.createElement("div");
    container.classList.add("item", "shadow");
    container.append(textContainer);
    container.setAttribute("id", `todo-${todoObject.id}`);

    function findTodo(todoId) {
      for (const todo of todos) {
        if (todo.id === todoId) return todo;
      }
      return null;
    }

    function addTaskToCompleted(todoId) {
      // const todoItem = todos.find((item) => item.id === todoId);
      // if (todoItem) {
      //   todoItem.isCompleted = true;
      //   document.dispatchEvent(new Event(RENDER_EVENT));
      // }

      const todoIndex = findTodo(todoId);
      if (todoIndex == null) return;
      todoIndex.isCompleted = true;
      document.dispatchEvent(new Event(RENDER_EVENT));
    }

    function undoTaskFromCompleted(todoId) {
      const todoIndex = findTodo(todoId);
      if (todoIndex == null) return;
      todoIndex.isCompleted = false;
      document.dispatchEvent(new Event(RENDER_EVENT));
    }

    function removeTaskFromCompleted(todoId) {
      const todoIndex = findTodo(todoId);
      if (todoIndex == null) return;
      todos.splice(todos.indexOf(todoIndex), 1);
      document.dispatchEvent(new Event(RENDER_EVENT));
    }

    if (todoObject.isCompleted) {
      const undoButton = document.createElement("button");
      undoButton.classList.add("undo-button");

      undoButton.addEventListener("click", function () {
        undoTaskFromCompleted(todoObject.id);
      });

      const trashButton = document.createElement("button");
      trashButton.classList.add("trash-button");

      trashButton.addEventListener("click", function () {
        removeTaskFromCompleted(todoObject.id);
      });

      container.append(undoButton, trashButton);
    } else {
      const checkButton = document.createElement("button");
      checkButton.classList.add("check-button");

      checkButton.addEventListener("click", function () {
        addTaskToCompleted(todoObject.id);
      });

      container.append(checkButton);
    }

    return container;
  }

  document.addEventListener(RENDER_EVENT, function () {
    console.log("Todos:", todos);
    const uncompletedTODOList = document.getElementById("todos");
    uncompletedTODOList.innerHTML = "";

    const completeTODOList = document.getElementById("completed-todos");
    completeTODOList.innerHTML = "";

    for (const todoItem of todos) {
      const todoElement = makeTodo(todoItem);
      if (!todoItem.isCompleted) {
        uncompletedTODOList.append(todoElement);
      } else {
        completeTODOList.append(todoElement);
      }
    }
  });

  submitForm.addEventListener("submit", function (event) {
    event.preventDefault();
    addTodo();
  });
});
