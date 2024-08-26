/*
 * @name: 折叠过渡动画 hook
 * @description: 优点：使用transform，不会造成重绘和回流；缺点：相邻组件不会跟随动画变化
 * @date: 2023-06-13 13:06:52
 * @path: \collapse\src\useCollapseAnimationPerformance.ts
 */
import {
  UseCollapseAnimationOptions,
  CollapseAnimation,
  Orientation,
} from "./type";

function useCollapseAnimationPerformance({
  orientation = "vertical",
  transformOrigin = "top",
  animationDuration = ".3s",
  easing = "ease-in-out",
}: UseCollapseAnimationOptions = {}): CollapseAnimation {
  const collapseAnimation = {} as CollapseAnimation;

  collapseAnimation.beforeEnter = (el) => {
    el.style.transformOrigin = getTransformOrigin(orientation, transformOrigin);
    el.style.transform = getScaleTransform(orientation, 0);
    el.style.opacity = "0";
  };

  collapseAnimation.enter = (el) => {
    requestAnimationFrame(() => {
      el.style.transition = `transform ${animationDuration} ${easing}, opacity ${animationDuration} ${easing}`;
      el.style.transform = getScaleTransform(orientation, 1);
      el.style.opacity = "1";
    });
  };

  collapseAnimation.afterEnter = (el) => {
    resetAnimationStyles(el);
  };

  collapseAnimation.beforeLeave = (el) => {
    el.style.transformOrigin = getTransformOrigin(orientation, transformOrigin);
    el.style.transition = `transform ${animationDuration} ${easing}, opacity ${animationDuration} ${easing}`;
    el.style.transform = getScaleTransform(orientation, 1);
    el.style.opacity = "1";
  };

  collapseAnimation.leave = (el) => {
    requestAnimationFrame(() => {
      el.style.transform = getScaleTransform(orientation, 0);
      el.style.opacity = "0";
    });
  };

  collapseAnimation.afterLeave = (el) => {
    el.style.display = "none";
    resetAnimationStyles(el);
  };

  function getTransformOrigin(
    orientation: Orientation,
    transformOrigin: string
  ): string {
    if (orientation === "vertical") {
      return transformOrigin === "bottom" ? "bottom" : "top";
    } else {
      return transformOrigin === "right" ? "right" : "left";
    }
  }

  function getScaleTransform(orientation: Orientation, scale: number): string {
    if (orientation === "vertical") {
      return `scaleY(${scale})`;
    } else {
      return `scaleX(${scale})`;
    }
  }

  function resetAnimationStyles(el: HTMLElement) {
    el.style.transformOrigin = "";
    el.style.transform = "";
    el.style.opacity = "";
    el.style.transition = "";
  }

  return collapseAnimation;
}

export { useCollapseAnimationPerformance };
