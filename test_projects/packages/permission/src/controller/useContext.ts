/*
 * @name: Do not edit
 * @description: Do not edit
 * @date: 2023-06-16 14:20:22
 * @path: \permission\src\controller\useContext.ts
 */
import { provideContext, injectContext } from "@guolisec/utils";

interface PageLoginContext {
  copyright: boolean;
  license: boolean;
  usbKey: boolean;
}

function provideLoginContext(context: Partial<PageLoginContext>) {
  return provideContext("permission::login", context || {});
}

function injectLoginContext(): Partial<PageLoginContext> {
  return injectContext("permission::login", {
    copyright: true,
    license: false,
    usbKey: true,
  });
}

export { provideLoginContext, injectLoginContext };
