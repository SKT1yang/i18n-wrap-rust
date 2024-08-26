/*
 * @name: Do not edit
 * @description: Do not edit
 * @date: 2023-05-09 09:19:36
 * @path: \glsec\domains\permission\src\views\layout\design\Iframe\app.ys
 */
import { uniqBy } from "@guolisec/utils";
import { computed, toRaw, unref } from "vue";
import { useRouter } from "vue-router";
import type { RouteRecordRaw } from "vue-router";

export function useFrameKeepAlive() {
  const router = useRouter();
  const { currentRoute } = router;
  const getFramePages = computed(() => {
    const ret =
      getAllFramePages(
        toRaw(router.getRoutes()) as unknown as RouteRecordRaw[]
      ) || [];
    return ret;
  });

  function getAllFramePages(routes: RouteRecordRaw[]): RouteRecordRaw[] {
    let res: RouteRecordRaw[] = [];
    for (const route of routes) {
      const { meta: { frameSrc } = {}, children } = route;
      if (frameSrc) {
        res.push(route);
      }
      if (children && children.length) {
        res.push(...getAllFramePages(children));
      }
    }
    res = uniqBy(res, "name");
    return res;
  }

  function showIframe(item: RouteRecordRaw) {
    return item.name === unref(currentRoute).name;
  }

  return { getFramePages, showIframe, getAllFramePages };
}
