import type {
  MessageInstance,
  NoticeType,
  ConfigOptions,
  ArgsProps,
  MessageType,
  TypeOpen,
} from "@guolisec/types";

import { createMessageInstance } from "./CreateMessage";
import { wrapPromiseFn } from "../utils";
// import { messageContext } from "../../bridge";

interface GlobalMessage {
  instance?: MessageInstance | null;
}
interface OpenTask {
  type: "open";
  config: ArgsProps;
  resolve: VoidFunction;
  setCloseFn: (closeFn: VoidFunction) => void;
  skipped?: boolean;
}

interface TypeTask {
  type: NoticeType;
  args: Parameters<TypeOpen>;
  resolve: VoidFunction;
  setCloseFn: (closeFn: VoidFunction) => void;
  skipped?: boolean;
}

type Task =
  | OpenTask
  | TypeTask
  | {
      type: "destroy";
      key: string;
      skipped?: boolean;
    };

const methods: NoticeType[] = [
  "success",
  "info",
  "warning",
  "error",
  "loading",
];

let message: GlobalMessage | null = null;

const act: (callback: VoidFunction) => Promise<void> | void = (
  callback: VoidFunction
) => callback();

let taskQueue: Task[] = [];

let defaultGlobalConfig: ConfigOptions = {};

// function getGlobalContext() {
//   const {
//     prefixCls: globalPrefixCls,
//     getContainer: globalGetContainer,
//     duration,
//     rtl,
//     maxCount,
//     top,
//   } = defaultGlobalConfig;
//   const mergedPrefixCls =
//     globalPrefixCls ?? messageContext.getPrefixCls("message");
//   const mergedContainer = globalGetContainer?.() || document.body;

//   return {
//     prefixCls: mergedPrefixCls,
//     container: mergedContainer,
//     duration,
//     rtl,
//     maxCount,
//     top,
//   };
// }

function flushNotice() {
  if (!message) {
    const instance = createMessageInstance();
    message = {
      instance,
    };

    // Delay render to avoid sync issue
    act(() => {
      Promise.resolve().then(() => {
        flushNotice();
      });
    });

    return;
  }

  // Notification not ready
  if (!message.instance) {
    return;
  }

  // >>> Execute task
  taskQueue.forEach((task) => {
    const { type, skipped } = task;

    // Only `skipped` when user call notice but cancel it immediately
    // and instance not ready
    if (!skipped) {
      switch (type) {
        case "open": {
          act(() => {
            const closeFn = message!.instance!.open({
              ...defaultGlobalConfig,
              ...task.config,
            });

            closeFn?.then(task.resolve);
            task.setCloseFn(closeFn);
          });
          break;
        }

        case "destroy":
          act(() => {
            message?.instance!.destroy(task.key);
          });
          break;

        // Other type open
        default: {
          act(() => {
            const closeFn = message!.instance![type](...task.args);

            closeFn?.then(task.resolve);
            task.setCloseFn(closeFn);
          });
        }
      }
    }
  });

  // Clean up
  taskQueue = [];
}

// ==============================================================================
// ==                                  Export                                  ==
// ==============================================================================
type MethodType = typeof methods[number];

function setMessageGlobalConfig(config: ConfigOptions) {
  defaultGlobalConfig = {
    ...defaultGlobalConfig,
    ...config,
  };
}

function open(config: ArgsProps): MessageType {
  const result = wrapPromiseFn((resolve) => {
    let closeFn: VoidFunction;

    const task: OpenTask = {
      type: "open",
      config,
      resolve,
      setCloseFn: (fn) => {
        closeFn = fn;
      },
      skipped: config.single === true && taskQueue.length > 0
    };
    taskQueue.push(task);

    return () => {
      if (closeFn) {
        act(() => {
          closeFn();
        });
      } else {
        task.skipped = true;
      }
    };
  });

  flushNotice();

  return result;
}

function typeOpen(type: NoticeType, args: Parameters<TypeOpen>): MessageType {
  const result = wrapPromiseFn((resolve) => {
    let closeFn: VoidFunction;
    const task: TypeTask = {
      type,
      args,
      resolve,
      setCloseFn: (fn) => {
        closeFn = fn;
      },
      skipped: args[3] === true && taskQueue.length > 0
    };

    taskQueue.push(task);

    return () => {
      if (closeFn) {
        act(() => {
          closeFn();
        });
      } else {
        task.skipped = true;
      }
    };
  });

  flushNotice();

  return result;
}

function destroy(key: string) {
  taskQueue.push({
    type: "destroy",
    key,
  });
  flushNotice();
}

const baseStaticMethods: {
  open: (config: ArgsProps) => MessageType;
  destroy: (key: string) => void;
  config: typeof setMessageGlobalConfig;
} = {
  open,
  destroy,
  config: setMessageGlobalConfig,
};

const staticMethods: typeof baseStaticMethods & Record<MethodType, TypeOpen> =
  baseStaticMethods as any;

methods.forEach((type) => {
  staticMethods[type] = (...args: Parameters<TypeOpen>) => typeOpen(type, args);
});

export { staticMethods };
