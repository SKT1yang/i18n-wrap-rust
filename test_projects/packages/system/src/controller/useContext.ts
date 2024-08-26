/*
 * @name: Do not edit
 * @description: Do not edit
 * @date: 2023-06-16 14:20:22
 * @path: \permission\src\controller\useContext.ts
 */
import { provideContext, injectContext } from "@guolisec/utils";

interface PageSystemInfoContext {
  warning: boolean;
}

function provideSystemInfoContext(context: Partial<PageSystemInfoContext>) {
  return provideContext("system::info", context || {});
}

function injectSystemInfoContext(): Partial<PageSystemInfoContext> {
  return injectContext("system::info", {
    warning: true,
  });
}

export { provideSystemInfoContext, injectSystemInfoContext };
