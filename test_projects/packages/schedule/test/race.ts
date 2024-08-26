async function runAsyncFuncs<T>(funcs: (() => Promise<T>)[]): Promise<T> {
  const controller = new AbortController();
  const signal = controller.signal;

  const promises = funcs.map((func) => {
    return new Promise<T>((resolve, reject) => {
      const abortListener = () => {
        reject(new Error("Aborted"));
      };
      signal.addEventListener("abort", abortListener);
      func()
        .then((result) => {
          signal.removeEventListener("abort", abortListener);
          resolve(result);
        })
        .catch((error) => {
          signal.removeEventListener("abort", abortListener);
          reject(error);
        });
    });
  });

  const result = await Promise.race(promises);

  // Cancel any remaining promises
  controller.abort();

  return result;
}



async function func1(): Promise<string> {
  await new Promise(resolve => setTimeout(resolve, 1000));
	console.log('func1')
  return "Result from func1";
}

async function func2(): Promise<string> {
  await new Promise(resolve => setTimeout(resolve, 2000));
	console.log('func2')
  return "Result from func2";
}

async function func3(): Promise<string> {
  await new Promise(resolve => setTimeout(resolve, 3000));
	console.log('func3')
  return "Result from func3";
}

async function main() {
  const result = await runAsyncFuncs([func1, func2, func3]);
  console.log(result);
}

main();
