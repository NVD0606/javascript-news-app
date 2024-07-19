"use strict";

const taskInput = document.getElementById("input-task");
const addBtn = document.getElementById("btn-add");
const todoList = document.getElementById("todo-list");

/**Lấy user đàn login dưới local */
const storedUser = getFromStorage("CURRENT_USER");

/**Nếu có đăng nhập thì parse thành User không thì gán tài khoản guest */
const currentUser = storedUser
  ? parseUser(JSON.parse(storedUser))
  : {
      firstName: "guest",
      lastName: "guest",
      username: "guest",
      password: "guestguest",
    };

/**Lấy danh sách tât cả task dưới local và parse thành list Tasks*/
const todoArr = getFromStorage("TODO_ARRAY")
  ? JSON.parse(getFromStorage("TODO_ARRAY")).map(parseTask)
  : [];

/**Khai báo biến list Tasks theo user đang login */
let todoArrByUser;

/**
 * Hàm lấy mảng các Task từ mảng tất cả Task
 * @returns mảng các Task theo user
 */
function getTasksByUser() {
  return todoArr.filter((task) => task.owner === currentUser.username);
}

/**
 * Trình xử lý sự kiện click cho add button, gồm:
 * Validate input
 * Tạo Task - Lưu Task - Render Task - Reset input
 */
addBtn.addEventListener("click", (e) => {
  e.preventDefault();
  const taskValue = taskInput.value.trim();
  if (taskValue === "") {
    alert("Please enter task!!!");
    return;
  }
  const task = new Task(taskValue, currentUser.username);
  todoArr.push(task);
  renderTaskByUser();
  saveToStorage("TODO_ARRAY", todoArr);
  taskInput.value = "";
});

/**Gọi hàm render khi load trang */
renderTaskByUser();

/**
 * Hàm render danh sách Task theo user đang login
 */
function renderTaskByUser() {
  todoList.innerHTML = "";
  todoArrByUser = getTasksByUser();
  todoArrByUser.forEach((task, index) => {
    const li = document.createElement("li");
    /**Gán thuộc tính dataset.id bởi index của task trong list các Task theo user */
    li.dataset.id = index;
    if (task.isDone) li.classList.add("checked");
    const html = `${task.task} <span class ="close">x</span>`;
    li.innerHTML = html;

    todoList.appendChild(li);
  });
}

/**
 * Trình bắt sự kiện click cho danh sách các Task, gồm:
 * Đánh dấu hoán thành, và Xoá Task
 */
todoList.addEventListener("click", (e) => {
  /**Nếu target có tagName là LI (phần tử li), thì xử lý toggle isDone */
  if (e.target.tagName == "LI") {
    /**Toggle class checked */
    e.target.classList.toggle("checked");
    /**
     * Xử lý lưu lại thay đổi vào list tất cả Task:
     * Lấy ra task được chọn trong list các Task theo user (bằng thuộc tính dataset.id)
     * Tìm index của task đó trong list tất cả Task
     * Thay đổi trường isDone
     * Lưu lại list tất cả Task vào local
     */
    const selectedTask = todoArrByUser[`${e.target.dataset.id}`];
    const index = todoArr.findIndex(
      (task) =>
        task.task == selectedTask.task && task.owner == selectedTask.owner
    );
    todoArr[index].isDone = !todoArr[index].isDone;
    saveToStorage("TODO_ARRAY", todoArr);
  } else if (e.target.tagName == "SPAN") {
  /**Nếu target có tagName là SPAN (phần tử span), thì xử lý delete task */
    /**
     * Lấy ra task được chọn trong list các Task theo user (bằng thuộc tính dataset.id của node cha)
     * Tìm index của task đó trong list tất cả Task
     */
    const selectedTask = todoArrByUser[`${e.target.parentNode.dataset.id}`];
    const index = todoArr.findIndex(
      (task) =>
        task.task == selectedTask.task && task.owner == selectedTask.owner
    );
    /**Xác nhận lại việc xoá Task của người dùng */
    if (confirm("Do you really want to delete this task?")) {
      /**Xoá 1 phần tử tại index tìm thấy */
      todoArr.splice(index, 1);
      /**Render lại danh sách Task */
      renderTaskByUser();
      /**Lưu lại vào local */
      saveToStorage("TODO_ARRAY", todoArr);
    }
  }
});
