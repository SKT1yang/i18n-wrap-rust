/*
 * @name: 折叠过渡动画 hook
 * @description: Do not edit
 * @date: 2023-06-13 16:46:14
 * @path: \collapse\src\useCollapseAnimation.ts
 */
import {
  UseCollapseAnimationOptions,
  CollapseAnimation,
  Dimension,
  Orientation,
} from "./type";
import { capitalizeFirstLetter } from "./utils";

function useCollapseAnimation({
  orientation = "vertical",
  animationDuration = ".3s",
  easing = "ease-in-out",
}: UseCollapseAnimationOptions = {}): CollapseAnimation {
  const collapseAnimation = {
    beforeEnter(el) {
      handleBefore(el);
      switchPadding("save", el);
      switchPadding("collapse", el);
    },
    enter(el) {
      handleAnimating(el);
      switchPadding("restore", el);
    },
    afterEnter(el) {
      handleAfter(el);
    },

    beforeLeave(el) {
      handleBefore(el);
      switchPadding("save", el);
      handleAnimating(el);
    },
    leave(el) {
      const dimension = getDimension(orientation);
      if (el["scroll" + capitalizeFirstLetter(dimension)] !== 0) {
        switchPadding("collapse", el);
      }
    },
    afterLeave(el) {
      handleAfter(el);
      switchPadding("restore", el);
    },
  } as CollapseAnimation;

  // 处理边距
  function switchPadding(action: "save" | "restore" | "collapse", el) {
    const keys = getPaddingKeys(orientation);
    const dimension = getDimension(orientation);
    // 缓存边距
    if (action === "save") {
      el.dataset["oldPadding" + keys[0]] = el.style["padding" + keys[0]];
      el.dataset["oldPadding" + keys[1]] = el.style["padding" + keys[1]];
    }
    // 还原边距
    if (action === "restore") {
      el.style["padding" + keys[0]] = el.dataset["oldPadding" + keys[0]];
      el.style["padding" + keys[1]] = el.dataset["oldPadding" + keys[1]];
    }
    // 折叠边距
    if (action === "collapse") {
      el.style[dimension] = "0";
      el.style["padding" + keys[0]] = "0";
      el.style["padding" + keys[1]] = "0";
    }
  }

  // 动画前置处理
  function handleBefore(el) {
    if (!el.dataset) el.dataset = {};
    const dimension = getDimension(orientation);
    el.style.transition = `${dimension} ${animationDuration} ${easing}`;
  }

  // 动画过程中置处理
  function handleAnimating(el) {
    const dimension = getDimension(orientation);
    el.dataset.oldOverflow = el.style.overflow;
    el.style[dimension] = `${
      el["scroll" + capitalizeFirstLetter(dimension)]
    }px`;
    el.style.overflow = "hidden";
  }

  // 动画后置处理
  function handleAfter(el) {
    const dimension = getDimension(orientation);
    el.style[dimension] = "";
    el.style.overflow = el.dataset.oldOverflow as string;
  }

  function getPaddingKeys(orientation: Orientation) {
    if (orientation === "horizontal") {
      return ["Left", "Right"];
    } else {
      return ["Top", "Bottom"];
    }
  }

  function getDimension(orientation: Orientation): Dimension {
    if (orientation === "horizontal") {
      return "width";
    } else {
      return "height";
    }
  }

  return collapseAnimation;
}

export { useCollapseAnimation };
