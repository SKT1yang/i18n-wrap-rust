import { type Component } from "vue";
type ComponentModule = Record<
  string,
  {
    default: Component;
  }
>;

export { type ComponentModule };
