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
    console.log(el);
    res.push(fn(el, 1, this));
  }

  return res;
};

const res = [1, 2, 3, 4, 5].map(el => el + 1);

console.log({ res });
