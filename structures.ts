function createQueue<T>() {
  const queue: Array<T> = [];

  return {
    enqueue(item: T) {
      queue.unshift(item);
    },
    dequeue() {
      return queue.pop();
    },
    peek() {
      return queue[queue.length - 1];
    },

    isEmpty() {
      return queue.length === 0;
    },
    get length() {
      return queue.length;
    },
  };
}

type Foo = {
  taskId: number;
};

const queue = createQueue<string>();

queue.enqueue("make a lunch");

queue.enqueue("pickup the kid");

queue.enqueue("shave the face");

queue.dequeue();

console.log(queue.peek());

console.log({ length: queue.length });
