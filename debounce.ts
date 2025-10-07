import { Effect, Duration, } from "effect";

import { type DurationInput } from "effect/Duration";



const debounce = <A extends any[],O>(fn: (...args: A)=> O, time: number) => {
  let timeout: NodeJS.Timeout;
  return (...args: A) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => fn(...args), time);
  };
};



const debounce2 = <A extends any[],O>(fn: (...args: A)=> O, duration: DurationInput) => {

let timeout: NodeJS.Timeout;

return (...args: A) => {
  clearTimeout(timeout);
  timeout = setTimeout(() => fn(...args), Duration.toMillis(duration));
};


}




const testFn = (a: number, b: number) => {
  console.log("testFn", a, b);
};



debounce(testFn, 1000)(1, 2);
debounce2(testFn, "1 second")(1, 2);






