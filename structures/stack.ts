// STACK is a collection of item where LIFO
//
//

export function createStack<T>() {
  const queue: Array<T> = [];

  return {
    push(item: T) {
      queue.push(item);
    },
    pop() {
      return queue.pop();
    },
    get length() {
      return queue.length;
    },

    peek() {
      return queue[queue.length - 1];
    },
    isEmpty() {
      return queue.length === 0;
    },
  };
}
