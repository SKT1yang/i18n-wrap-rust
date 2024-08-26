/*
 * @name: Do not edit
 * @description: Do not edit
 */

/**
 * 类名拼接前缀
 * @param prefix
 * @param className
 */
function prefixClass(prefix: string, className: string) {
  if (!prefix) {
    return className || '';
  }
  if (prefix[prefix.length - 1] === '-') {
    prefix = prefix.slice(0, prefix.length - 1);
  }
  return `${prefix}-${className}`;
}

export { prefixClass };
