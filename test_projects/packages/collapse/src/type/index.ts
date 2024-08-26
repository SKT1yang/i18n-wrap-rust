/*
 * @name: Do not edit
 * @description: Do not edit
 * @date: 2023-06-13 13:07:35
 * @path: \collapse\src\type\index.ts
 */
interface CollapseAnimation {
  beforeEnter: (el: HTMLElementWithDataset) => void;
  enter: (el: HTMLElementWithDataset) => void;
  afterEnter: (el: HTMLElementWithDataset) => void;
  beforeLeave: (el: HTMLElementWithDataset) => void;
  leave: (el: HTMLElementWithDataset) => void;
  afterLeave: (el: HTMLElementWithDataset) => void;
}

type Dimension = "width" | "height";

type Orientation = "vertical" | "horizontal";

type TransformOrigin = "top" | "bottom" | "left" | "right";

type UseCollapseAnimationOptions = {
  orientation?: Orientation;
  transformOrigin?: TransformOrigin;
  animationDuration?: string;
  easing?: string;
};

interface Dataset {
  [key: string]: string | undefined;
}

interface HTMLElementWithDataset extends HTMLElement {
  dataset: Dataset;
}

export {
  type Dimension,
  type Orientation,
  type TransformOrigin,
  type CollapseAnimation,
  type UseCollapseAnimationOptions,
  type HTMLElementWithDataset,
};
