"use strict";
class Task {
  constructor(task, owner, isDone = false) {
    this.task = task;
    this.owner = owner;
    this.isDone = isDone;
  }
}

function parseTask(taskData) {
  return new Task(taskData.task, taskData.owner, taskData.isDone);
}
