import type {
  MessageInstance,
  NoticeType,
  ArgsProps,
  MessageType,
  TypeOpen,
  ToastCSSProperties,
} from "@guolisec/types";

import CreateToastInstance from "../toast/Toast";
import { wrapPromiseFn, getStyle, CSSPropertiesToString } from "../utils";

function createMessageInstance() {
  const toastInstance = CreateToastInstance({
    prefixCls: "toast",
    scopeCls: "message",
    topic: "",
    customStyle: `
      @keyframes MessageMoveIn {
        0% {
          transform: translateY(-100%);
          opacity: 0;
        }
        100% {
          transform: translateY(0);
          opacity: 1;
        }
      }
    
      @keyframes MessageMoveOut {
        0% {
          transform: translateY(0);
          opacity: 1;
        }
        100% {
          transform: translateY(-50%);
          opacity: 0;
        }
      }
      .toast-message.show {
        animation: MessageMoveIn 0.4s cubic-bezier(0.215, 0.61, 0.355, 1);
      }

      .toast-message.hide {
        animation: MessageMoveOut 0.4s cubic-bezier(0.215, 0.61, 0.355, 1);
        opacity: 0;
      }
    `,
  });

  // >>> Open
  const open = (config: ArgsProps): MessageType => {
    if (!toastInstance) {
      console.warn("tosat 实例不存在！");
      const fakeResult: any = () => {};
      fakeResult.then = () => {};
      return fakeResult;
    }

    const {
      content,
      icon,
      type,
      key,
      className,
      onClose,
      style,
      duration,
      onClick,
      single
    } = config;

    const mergedKey = Boolean(key) ? String(key) : "";
    return wrapPromiseFn((resolve) => {
      const idCls = toastInstance.open({
        prefixCls: "toast",
        scopeCls: "message",
        duration: duration !== undefined ? duration * 1000 : 3000,
        key: mergedKey,
        icon: getTypeIcon(icon, type),
        topic: content,
        className,
        single,
        customContainerStyle: getCustomContainerStyleString(style), // placement: 'top'
        customToastStyle: "padding: 10px 12px;",
        customHeaderStyle: "padding: 0px 0px;",
        showCloseBtn: false,
        showCloseIcon: false,
        showOkBtn: false,
        onOk: (closeFn, e: MouseEvent) => {
          closeFn();
          onClick?.(e);
          resolve();
        },
        onClose: () => {
          onClose?.();
          resolve();
        },
      });

      // Return close function
      return () => {
        toastInstance.close(idCls);
      };
    });
  };

  // >>> destroy
  const destroy = (key?: string) => {
    if (key) {
      toastInstance.close(key);
    } else {
      toastInstance.clear();
    }
  };

  const clone = {
    open,
    destroy,
  } as MessageInstance;

  const keys: NoticeType[] = ["info", "success", "warning", "error", "loading"];
  keys.forEach((type) => {
    const typeOpen: TypeOpen = (jointContent, duration, onClose, single) => {
      let config: ArgsProps;
      if (
        jointContent &&
        typeof jointContent === "object" &&
        "content" in jointContent
      ) {
        config = jointContent;
      } else {
        config = {
          content: jointContent,
        };
      }

      // Params
      let mergedDuration: number | undefined;
      let mergedOnClose: VoidFunction | undefined;
      if (typeof duration === "function") {
        mergedOnClose = duration;
      } else {
        mergedDuration = duration;
        mergedOnClose = onClose;
      }

      const mergedConfig = {
        onClose: mergedOnClose,
        duration: mergedDuration,
        ...config,
        type,
        single,
      };

      return open(mergedConfig);
    };

    clone[type] = typeOpen;
  });

  return clone;
}

function getTypeIcon(icon: string | undefined, type: NoticeType | undefined) {
  if (icon) {
    return icon;
  }

  switch (type) {
    case "success":
      return `<svg viewBox="64 64 896 896" fill="#52c41a" focusable="false" data-icon="check-circle" width="1em" height="1em" aria-hidden="true"><path d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm193.5 301.7l-210.6 292a31.8 31.8 0 01-51.7 0L318.5 484.9c-3.8-5.3 0-12.7 6.5-12.7h46.9c10.2 0 19.9 4.9 25.9 13.3l71.2 98.8 157.2-218c6-8.3 15.6-13.3 25.9-13.3H699c6.5 0 10.3 7.4 6.5 12.7z"></path></svg>`;

    case "info":
      return `<svg viewBox="64 64 896 896" fill="#1677ff" focusable="false" data-icon="info-circle" width="1em" height="1em" aria-hidden="true"><path d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm32 664c0 4.4-3.6 8-8 8h-48c-4.4 0-8-3.6-8-8V456c0-4.4 3.6-8 8-8h48c4.4 0 8 3.6 8 8v272zm-32-344a48.01 48.01 0 010-96 48.01 48.01 0 010 96z"></path></svg>`;

    case "error":
      return `<svg viewBox="64 64 896 896" fill="#ff4d4f" focusable="false" data-icon="close-circle" width="1em" height="1em" aria-hidden="true"><path d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm165.4 618.2l-66-.3L512 563.4l-99.3 118.4-66.1.3c-4.4 0-8-3.5-8-8 0-1.9.7-3.7 1.9-5.2l130.1-155L340.5 359a8.32 8.32 0 01-1.9-5.2c0-4.4 3.6-8 8-8l66.1.3L512 464.6l99.3-118.4 66-.3c4.4 0 8 3.5 8 8 0 1.9-.7 3.7-1.9 5.2L553.5 514l130 155c1.2 1.5 1.9 3.3 1.9 5.2 0 4.4-3.6 8-8 8z"></path></svg>`;

    case "warning":
      return `<svg viewBox="64 64 896 896" fill="#faad14" focusable="false" data-icon="exclamation-circle" width="1em" height="1em" aria-hidden="true"><path d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm-32 232c0-4.4 3.6-8 8-8h48c4.4 0 8 3.6 8 8v272c0 4.4-3.6 8-8 8h-48c-4.4 0-8-3.6-8-8V296zm32 440a48.01 48.01 0 010-96 48.01 48.01 0 010 96z"></path></svg>`;

    case "loading":
      return `<svg viewBox="64 64 896 896" fill="#1677ff" class="toastIconLoadingCircle" focusable="false" data-icon="check-circle" width="1em" height="1em" aria-hidden="true"><path d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm193.5 301.7l-210.6 292a31.8 31.8 0 01-51.7 0L318.5 484.9c-3.8-5.3 0-12.7 6.5-12.7h46.9c10.2 0 19.9 4.9 25.9 13.3l71.2 98.8 157.2-218c6-8.3 15.6-13.3 25.9-13.3H699c6.5 0 10.3 7.4 6.5 12.7z"></path></svg>`;

    default:
      return "";
  }
}

function getCustomContainerStyleString(style?: ToastCSSProperties) {
  const styleObject = Object.assign(
    {},
    getStyle("top"),
    typeof style === "object" ? style : {}
  );
  return typeof style === "string"
    ? CSSPropertiesToString(styleObject) + style
    : CSSPropertiesToString(styleObject);
}

export { createMessageInstance };
