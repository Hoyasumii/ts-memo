import { factorial } from "./factorial";

type AnyFunction = (...args: any[]) => any;

type MemoFunction = <T extends AnyFunction>(
  functionToBeMemoized: T,
  ...args: Parameters<T>
) => ReturnType<T>;

function filter<T>(data: Array<T>, action: (item: any) => boolean) {
  return data.filter(action);
}

export function createMemo(): MemoFunction {
  const context: Record<string, unknown> = {};

  return (functionToBeMemoized, ...args) => {
    const contextKey = `${
      functionToBeMemoized.name ||
      functionToBeMemoized.prototype.constructor.name
    }:${args.join(":")}`;

    if (context[contextKey]) {
      console.log("memo");
      return context[contextKey];
    }

    const returnValue = functionToBeMemoized(...args);

    context[contextKey] = returnValue;
    return returnValue;
  };
}

const memo = createMemo();

console.time("First Attempt");
console.log(memo(factorial, 10));
console.timeEnd("First Attempt");
console.time("Second Attempt");
console.log(memo(factorial, 10));
console.timeEnd("Second Attempt");
console.time("Third Attempt");
console.log(memo(factorial, 10));
console.timeEnd("Third Attempt");

const oneMillionArray = Array.from({ length: 1_000_000 }, (_, i) => i + 1);

console.time("1 Million Filter");
memo(filter, oneMillionArray, (item) => item % 2 === 0);
console.timeEnd("1 Million Filter");

console.time("1 Million Filter 2");
memo(filter, oneMillionArray, (item) => item % 2 === 0);
console.timeEnd("1 Million Filter 2");

console.time("1 Million Filter 3");
memo(filter, oneMillionArray, (item) => item % 2 === 0);
console.timeEnd("1 Million Filter 3");

