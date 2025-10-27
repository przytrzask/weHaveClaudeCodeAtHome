import { cons } from "effect/List";
import { createQueue } from "./queue.ts";

function createPriorityQueue<T>() {
  const priorityQueue = createQueue<T>();
  const lowPriorityQueue = createQueue<T>();

  return {
    enqueue(item: T, isHighPriority: boolean = false) {
      return isHighPriority
        ? priorityQueue.enqueue(item)
        : lowPriorityQueue.enqueue(item);
    },
    dequeue() {
      if (priorityQueue.isEmpty()) {
        return lowPriorityQueue.dequeue();
      }
      return priorityQueue.dequeue();
    },
    peek() {
      if (priorityQueue.isEmpty()) {
        return lowPriorityQueue.peek();
      }
      return priorityQueue.peek();
    },

    isEmpty() {
      return priorityQueue.length === 0 && lowPriorityQueue.length === 0;
    },
    get length() {
      return priorityQueue.length + lowPriorityQueue.length;
    },
  };
}

const q = createPriorityQueue<string>();

q.enqueue("A fix here");
q.enqueue("A bug there");
q.enqueue("A new feature");

q.enqueue("Emergency task!", true);
console.log(q.dequeue());
console.log(q.peek());

const arr = [1, 2, 3, 4, 5];

function reverse<T>(arr: Array<T>): Array<T> {
  let res: Array<T> = [];
  for (const el of arr) {
    res.unshift(el);
  }

  return res;
}

const reversed = reverse(arr);

console.log(reversed);
