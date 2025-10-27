export function createQueue<T>() {
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

// const queue = createQueue<string>();

// queue.enqueue("make a lunch");

// queue.enqueue("pickup the kid");

// queue.enqueue("shave the face");

// queue.dequeue();

class Queue<T> {
  private queue: Array<T> = [];

  enqueue(item: T) {
    this.queue.unshift(item);
  }
  dequeue() {
    return this.queue.pop();
  }
  peek() {
    return this.queue[this.queue.length - 1];
  }

  isEmpty() {
    return this.queue.length === 0;
  }
  get length() {
    return this.queue.length;
  }
}

const queue = new Queue<string>();

queue.enqueue("make a lunch");

queue.enqueue("pickup the kid");

queue.enqueue("shave the face");

queue.dequeue();

console.log(queue.peek());
