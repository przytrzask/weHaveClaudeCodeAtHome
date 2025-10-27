const tail = <T extends any>(arr: Array<T>) => {
  return arr.slice(1);
};

const first = <T extends any>(arr: Array<T>) => {
  return arr[0];
};

const arr = [1, 2, 3];

const last = tail(arr);

const firstElement = first(arr);

function map<T, O>(arr: T[], fn: (el: T) => O) {
  const res = [];

  for (const el of arr) {
    res.push(fn(el));
  }

  return res;
}

function reduce<T, O>(arr: Array<T>, fn: (acc: O, el: T) => O, initial: O): O {
  let value = initial;

  for (const el of arr) {
    value = fn(value, el);
  }

  return value;
}

function mapRecursive<T, O>(arr: T[], fn: (el: T) => O): Array<O> {
  const firstEl = first(arr);
  const rest = tail(arr);

  if (!firstEl) {
    return [];
  }

  return [fn(firstEl), ...mapRecursive(rest, fn)];
}

const mapped = map([1, 2, 3], el => el * 2);
const mappedRecursive = mapRecursive([1, 2, 3], el => el * 2);

const sum = reduce([1, 2, 3], (sum, el) => sum + el, 0);

Array.prototype.map = function <T, O>(
  this: Array<T>,
  fn: (el: T, index: number, array: Array<T>) => O
): Array<O> {
  const res = [];
  for (const el of this) {
    res.push(fn(el, 1, this));
  }

  return res;
};

const res = [1, 2, 3, 4, 5].map(el => el + 1);

const forEach = <T>(arr: T[], fn: (el: T, idx: number) => void) => {
  for (const [index, el] of arr.entries()) {
    fn(el, index);
  }
};

forEach([1, 2, 3, 4], (el, idx) => console.log(idx));

const myMap = <T, O>(arr: T[], fn: (el: T, idx: number) => O) => {
  let resultArray: Array<O> = [];

  forEach(arr, (el, idx) => resultArray.push(fn(el, idx)));
  return resultArray;
};

// const res2 = myMap([1, 2, 3, 4], el => el + 3);

const myReduce = <T, O>(arr: T[], fn: (acc: O, curr: T) => O, initial: O) => {
  let value = initial;

  myMap(arr, el => {
    value = fn(value, el);
  });

  return value;
};

const result3 = myReduce([1, 2, 3, 4], (acc, el) => acc + el, 0);

// const debounce = <T extends Array<any>, O>(
//   fn: (...args: T) => O,
//   delay: number
// ) => {
//   let timeout: NodeJS.Timeout;
//   return (...args: T) => {
//     clearTimeout(timeout);
//     timeout = setTimeout(() => fn(...args), delay);
//   };
// };

// const log = (name: string) => name;

// const makeLog = debounce(log, 10000);
//

Array.prototype.myForEach = function <T, O>(
  this: T[],
  cb: (e: T, idx: number) => O
) {
  for (const [index, el] of this.entries()) {
    cb(el, index);
  }
};

Array.prototype.myMap = function <T, O>(
  this: T[],
  cb: (el: T, idx: number) => O
): O[] {
  const res: O[] = [];

  this.myForEach((el, idx) => res.push(cb(el, idx)));

  return res;
};

Array.prototype.myReduce = function <T, O>(
  this: T[],
  cb: (acc: O, el: T, idx: number) => O,
  initialValue: O
) {
  let value = initialValue;

  this.myForEach((el, idx) => {
    value = cb(value, el, idx);
  });

  return value;
};

declare global {
  interface Array<T> {
    myForEach(cb: (el: T, idx: number) => void): void;
    myMap<O>(cb: (el: T, idx: number) => O): O[];
    myReduce<O>(cb: (acc: O, el: T, idx: number) => O, initialValue: O): O;
  }
}

[1, 2, 3].myForEach(el => console.log({ el }));

const test1 = [1, 2, 3].myMap(el => el * 2).myMap(el => el * 2);

console.log(test1);
//
const test2 = [1, 2, 3].myReduce((acc, val) => {
  return acc + val;
}, 0);

console.log(test2);

const debounce = <Args extends any[], O>(
  fn: (...args: Args) => O,
  timeout: number
) => {
  let timeoutId: ReturnType<typeof setTimeout>;

  console.log(this);

  return function (this: any, ...args: Args) {
    console.log("this is:", this);
    clearTimeout(timeoutId);
    const context = this; // `this` comes from call site!
    timeoutId = setTimeout(() => fn.apply(context, args), timeout);
  };
};

const bounced = debounce(() => console.log("ff"), 1000);

// bounced();

const obj = {
  name: "John",
  greet: debounce(function () {
    console.log(this.name);
  }, 300),
};

// obj.greet();
//
//
//
function throttle<T extends (...args: any[]) => any>(cb: T, timeout: number) {
  let lastExecution: null | number = null;
  return function (this: any, ...args: Parameters<T>) {
    if (lastExecution === null || Date.now() - lastExecution > timeout) {
      lastExecution = new Date().getTime();
      cb.apply(this, args);
    }
  };
}

const throttled = throttle(() => console.log("nanna"), 2000);
