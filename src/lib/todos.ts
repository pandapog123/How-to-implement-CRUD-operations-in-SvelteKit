import { get, writable } from "svelte/store";
import { v4 as uuid } from "uuid";
import type { TodoList } from "./types";

export const todoListStore = writable<TodoList>({});
// todoListStore.subscribe(console.log);

export function checkTodo(userId: string, todoId: string) {
  if (!userId) {
    throw new Error("User must have a valid ID");
  }

  const todoList = get(todoListStore);

  const userFound = todoList[userId] !== undefined;

  if (!userFound) {
    throw new Error("User does not exist");
  }

  const todoFound = todoList[userId].find((todo) => todo.id === todoId);

  if (!todoFound) {
    throw new Error(`Todo of id "${todoId}" does not exist`);
  }

  todoListStore.update((previousTodoList) => {
    const todoIndex = previousTodoList[userId].indexOf(todoFound);

    previousTodoList[userId][todoIndex].checked =
      !previousTodoList[userId][todoIndex].checked;

    return previousTodoList;
  });
}

export function createTodo(userId: string, content: string) {
  if (!userId) {
    throw new Error("User must have a valid ID");
  }

  if (content.length < 1) {
    throw new Error("Content must be at least 1 character in length");
  }

  const todo = {
    checked: false,
    content: content,
    id: uuid(),
  };

  todoListStore.update((previousTodoList) => {
    if (!previousTodoList[userId]) {
      previousTodoList[userId] = [];
    }

    previousTodoList[userId].push(todo);

    return previousTodoList;
  });
}

export function deleteTodo(userId: string, todoId: string) {
  if (!userId) {
    throw new Error("User must have a valid ID");
  }

  const todoList = get(todoListStore);

  const userFound = todoList[userId] !== undefined;

  if (!userFound) {
    throw new Error("User does not exist");
  }

  const todoFound = todoList[userId].find((todo) => todo.id === todoId);

  if (!todoFound) {
    throw new Error(`Todo of id "${todoId}" does not exist`);
  }

  todoListStore.update((previousTodoList) => {
    previousTodoList[userId] = previousTodoList[userId].filter(
      (todo) => todo.id !== todoId
    );

    return previousTodoList;
  });
}

export function getTodos(userId: string) {
  if (!userId) {
    throw new Error("User must have a valid ID");
  }

  const result = get(todoListStore)[userId];

  if (!result) {
    todoListStore.update((previousTodoList) => {
      previousTodoList[userId] = [];

      return previousTodoList;
    });

    return [];
  }

  return result;
}
