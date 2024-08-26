/*
 * @name: Do not edit
 * @description: Do not edit
 * @date: 2023-02-16 19:34:47
 * @path: \permission\src\utils\index.ts
 */

function treeDataTranslate<T extends Record<string, any> & { children?: T[] }>(
  plain: T[],
  pid
) {
  const children = plain.filter((item) => item.pid === pid);
  if (children.length === 0) {
    return undefined;
  }
  children.forEach((item) => {
    item.children = treeDataTranslate(plain, item.id);
  });
  // 排序
  children.sort((a, b) => {
    // 兼容处理
    let orderLeft = (a?.meta?.orderNo ?? a.orderNo) || 999;
    let orderRight = (b?.meta?.orderNo ?? b.orderNo) || 999;
    return orderLeft - orderRight;
  });
  return children;
}

function pathValidator(_rule, value: string) {
  if (!value) {
    return Promise.resolve();
  }
  if (value.replace(/\/[a-z|-]+/g, '') === '') {
    return Promise.resolve();
  } else {
    return Promise.reject('请输入正确格式的路径');
  }
}

export { treeDataTranslate, pathValidator };
