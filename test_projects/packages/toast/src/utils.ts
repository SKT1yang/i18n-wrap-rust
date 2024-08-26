import type { CSSProperties } from "@guolisec/types";
import type { NotificationPlacement } from "./notification/interface";

const DEFAULT_OFFSET = 24;
// const DEFAULT_DURATION = 4.5;

/**
 * Promise化消息函数
 * @param openFn 消息函数
 * @returns 包装后函数
 */
function wrapPromiseFn(openFn: (resolve: VoidFunction) => VoidFunction) {
  let closeFn: VoidFunction;

  const closePromise = new Promise<boolean>((resolve) => {
    closeFn = openFn(() => {
      resolve(true);
    });
  });

  const result: any = () => {
    closeFn?.();
  };

  result.then = (filled: VoidFunction, rejected: VoidFunction) =>
    closePromise.then(filled, rejected);
  result.promise = closePromise;

  return result;
}

function uuid() {
  const s: (string | number)[] = [];
  const hexDigits = "0123456789abcdef";
  for (let i = 0; i < 36; i++) {
    s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
  }
  s[14] = "4"; // bits 12-15 of the time_hi_and_version field to 0010
  s[19] = hexDigits.substr((s[19] as number & 0x3) | 0x8, 1); // bits 6-7 of the clock_seq_hi_and_reserved to 01
  s[8] = s[13] = s[18] = s[23] = "-";

  const uuid = s.join("");
  return uuid;
}

const kebabCase = (str) => {
  const regex = new RegExp(/[A-Z]/g);
  return str.replace(regex, (v) => `-${v.toLowerCase()}`);
};

function CSSPropertiesToString(style: CSSProperties) {
  const finalResult = Object.keys(style).reduce((accumulator, key) => {
    // transform the key from camelCase to kebab-case
    const cssKey = kebabCase(key);
    // remove ' in value

    const cssValue = (
      typeof style[key] === "number" ? String(style[key]) : style[key]
    ).replace("'", "");
    // build the result
    // you can break the line, add indent for it if you need
    return `${accumulator}${cssKey}:${cssValue};`;
  }, "");

  return finalResult;
}

function getPlacementStyle(
  placement: NotificationPlacement,
  top: string,
  bottom: string
) {
  let style: CSSProperties;

  switch (placement) {
    case "top":
      style = {
        left: "50%",
        transform: "translateX(-50%)",
        right: "auto",
        top,
        bottom: "auto",
      };
      break;

    case "topLeft":
      style = {
        left: 0,
        top,
        bottom: "auto",
      };
      break;

    case "topRight":
      style = {
        right: 0,
        top,
        bottom: "auto",
      };
      break;

    case "bottom":
      style = {
        left: "50%",
        transform: "translateX(-50%)",
        right: "auto",
        top: "auto",
        bottom,
      };
      break;

    case "bottomLeft":
      style = {
        left: 0,
        top: "auto",
        bottom,
      };
      break;

    default:
      style = {
        right: 0,
        top: "auto",
        bottom,
      };
      break;
  }
  return style;
}

function getStyle(
  placement: NotificationPlacement,
  top = `${DEFAULT_OFFSET}px`,
  bottom = `${DEFAULT_OFFSET}px`
) {
  return getPlacementStyle(placement, top, bottom);
}

/* istanbul ignore next */
function hasClass(el: Element, cls: string) {
  if (!el || !cls) return false;
  if (cls.indexOf(" ") !== -1)
    throw new Error("className should not contain space.");
  if (el.classList) {
    return el.classList.contains(cls);
  } else {
    return (" " + el.className + " ").indexOf(" " + cls + " ") > -1;
  }
}

/* istanbul ignore next */
function addClass(el: Element, cls: string) {
  if (!el) return;
  let curClass = el.className;
  const classes = (cls || "").split(" ");

  for (let i = 0, j = classes.length; i < j; i++) {
    const clsName = classes[i];
    if (!clsName) continue;

    if (el.classList) {
      el.classList.add(clsName);
    } else if (!hasClass(el, clsName)) {
      curClass += " " + clsName;
    }
  }
  if (!el.classList) {
    el.className = curClass;
  }
}

/* istanbul ignore next */
function removeClass(el: Element, cls: string) {
  if (!el || !cls) return;
  const classes = cls.split(" ");
  let curClass = " " + el.className + " ";

  for (let i = 0, j = classes.length; i < j; i++) {
    const clsName = classes[i];
    if (!clsName) continue;

    if (el.classList) {
      el.classList.remove(clsName);
    } else if (hasClass(el, clsName)) {
      curClass = curClass.replace(" " + clsName + " ", " ");
    }
  }
  if (!el.classList) {
    el.className = trim(curClass);
  }
}

function trim(string: string) {
  return (string || "").replace(/^[\s\uFEFF]+|[\s\uFEFF]+$/g, "");
}

export {
  wrapPromiseFn,
  uuid,
  CSSPropertiesToString,
  getPlacementStyle,
  getStyle,
  hasClass,
  addClass,
  removeClass,
};
