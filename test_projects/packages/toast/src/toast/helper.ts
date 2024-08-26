function getBaseStyle(prefixCls = 'toast') {
  // 完整的自定义前缀
  return `
  /******************** 基础样式 *******************/
  
  .${prefixCls}-container {
    /* 位置 */
    position: fixed;
    z-index: 99999;
    /* 盒子 */
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    /* 文字 */
    color: var(--color-text, rgba(0, 0, 0, .88));
    font-size: 14px;
    line-height: 1.6;
    list-style: none;
    /* 其他 */
    transition: all 0.4s cubic-bezier(0.215, 0.61, 0.355, 1);
  
    margin-inline-end: 24px;
  }
  
  .${prefixCls} {
    /* 位置 */
    position: relative;
    /* 盒子 */
    padding: 20px 24px;
    align-items: center;
    max-width: calc(100vw - 48px);
    margin-bottom: 16px;
    margin-inline-start: auto;
    border-radius: 8px;
    overflow: hidden;
    /* 修饰 */
    box-shadow: 0 6px 16px 0 rgb(0 0 0 / 8%), 0 3px 6px -4px rgb(0 0 0 / 12%), 0 9px 28px 8px rgb(0 0 0 / 5%);
    background: var(--color-bg-elevated, #ffffff);
    /* 文字 */
    line-height: 1.6;
    word-wrap: break-word;
    /* 其他 */
   
  }
  
  .${prefixCls}-icon-close {
    /* 位置 */
    position: absolute;
    top: 17px;
    z-index: 1010;
    /* 盒子 */
    display: block;
    width: 22px;
    height: 22px;
    padding: 0;
    border: 0;
    /* 修饰 */
    color: var(--color-text, rgba(0, 0, 0, .45));
    text-align: center;
    text-transform: none;
    text-rendering: auto;
    text-decoration: none;
    line-height: 22px;
    inset-inline-end: 17px;
    line-height: 1;
    background: 0 0;
    /* 文字 */
    font-weight: 600;
    font-size: 16px;
    font-style: normal;
    /* 其他 */
    border-radius: 4px;
    outline: 0;
    cursor: pointer;
    transition: color .2s, background-color .2s;
  }
  
  .${prefixCls}-icon-close:hover {
    color: rgba(0, 0, 0, .88);
    background-color: rgba(0, 0, 0, .06);
    text-decoration: none;
  }
  
  .${prefixCls}-header {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
  }
  
  .${prefixCls}-header .${prefixCls}-icon {
    display: inline-flex;
    align-items: center;
    font-style: normal;
    line-height: 0;
    text-align: center;
    text-transform: none;
    vertical-align: -0.125em;
    text-rendering: optimizeLegibility;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    color: #faad14;
    flex: none;
    margin-inline-end: 8px;
    font-size: var(--font-size-icon, 16px);
  }

  .${prefixCls}-header .${prefixCls}-icon img {
    width: 20px;
    height: 20px;
  }
  
  .${prefixCls}-topic {
    color: var(--color-text, rgba(0, 0, 0, .88));
    font-size: var(--font-size-s-m, 14px);
    line-height: 1.5;
  }
  
  .${prefixCls}-content {
    margin-inline-start: 34px;
  }
  
  .${prefixCls}-footer {
    text-align: end;
    background: 0 0;
    margin-top: 12px;
  }
  
  .${prefixCls}-footer button {
    box-shadow: 0 2px 0 rgb(0 0 0 / 2%);
    font-size: 14px;
    height: 32px;
    padding: 4px 15px;
    border-radius: 6px;
    outline: none;
    position: relative;
    display: inline-block;
    font-weight: 400;
    white-space: nowrap;
    text-align: center;
    background-image: none;
    border: 1px solid transparent;
    cursor: pointer;
    transition: all .2s cubic-bezier(.645, .045, .355, 1);
    user-select: none;
    touch-action: manipulation;
    line-height: 1.6;
  
    border-color: #d9d9d9;
  }
  
  .${prefixCls}-close-btn {
    background-color: #fff;
    color: var(--color-text, rgba(0, 0, 0, .88));
  
  }
  
  .${prefixCls}-close-btn:hover,
  .${prefixCls}-close-btn:active {
    color: #4096ff;
    border-color: #4096ff;
  }
  
  .${prefixCls}-confirm-btn {
    color: #fff;
    background-color: #1677ff;
    box-shadow: 0 2px 0 rgb(5 145 255 / 10%);
  }
  
  .${prefixCls}-confirm-btn:hover {
    background-color: #4096ff;
  }
  
  .${prefixCls}-confirm-btn:active {
    background-color: #0958d9;
  }

  /* loading动画 */
  .toastIconLoadingCircle {
    display: inline-block;
    -webkit-animation: loadingCircle 1s infinite linear;
    animation: toastIconLoadingCircle 1s linear infinite;
  }

  @keyframes toastIconLoadingCircle {
    100% {
      -webkit-transform: rotate(360deg);
      transform: rotate(360deg);
    }
  }
  `;
}

function getCustomContainerStyle(
  styleText: string,
  containerElementCls: string
) {
  return `
  .${containerElementCls} {
    ${styleText}
  }
  `;
}

function getCustomToastStyle(
  styleText: string,
  containerElementCls: string,
  toastElementCls: string
) {
  const parentPrefix = `.${containerElementCls} .${toastElementCls}`;
  return `
  ${parentPrefix} {
    ${styleText}
  }
  `;
}

function getCustomIconCloseStyle(
  styleText: string,
  prefixCls = 'toast',
  containerElementCls: string,
  toastElementCls: string
) {
  const parentPrefix = `.${containerElementCls} .${toastElementCls}`;
  return `
  ${parentPrefix} .${prefixCls}-icon-close {
    ${styleText}
  }
  `;
}

function getCustomHeaderStyle(
  styleText: string,
  prefixCls = 'toast',
  containerElementCls: string,
  toastElementCls: string
) {
  const parentPrefix = `.${containerElementCls} .${toastElementCls}`;
  return `
  ${parentPrefix} .${prefixCls}-header {
    ${styleText}
  }
  `;
}

function getCustomIconStyle(
  styleText: string,
  prefixCls = 'toast',
  containerElementCls: string,
  toastElementCls: string
) {
  const parentPrefix = `.${containerElementCls} .${toastElementCls}`;
  return `
  ${parentPrefix} .${prefixCls}-icon {
    ${styleText}
  }
  `;
}

function getCustomTopicStyle(
  styleText: string,
  prefixCls = 'toast',
  containerElementCls: string,
  toastElementCls: string
) {
  const parentPrefix = `.${containerElementCls} .${toastElementCls}`;
  return `
  ${parentPrefix} .${prefixCls}-topic {
    ${styleText}
  }
  `;
}

function getCustomContentStyle(
  styleText: string,
  prefixCls = 'toast',
  containerElementCls: string,
  toastElementCls: string
) {
  const parentPrefix = `.${containerElementCls} .${toastElementCls}`;
  return `
  ${parentPrefix} .${prefixCls}-content {
    ${styleText}
  }
  `;
}

function getCustomFooterStyle(
  styleText: string,
  prefixCls = 'toast',
  containerElementCls: string,
  toastElementCls: string
) {
  const parentPrefix = `.${containerElementCls} .${toastElementCls}`;
  return `
  ${parentPrefix} .${prefixCls}-footer {
    ${styleText}
  }
  `;
}

function getCustomCloseBtnStyle(
  styleText: string,
  prefixCls = 'toast',
  containerElementCls: string,
  toastElementCls: string
) {
  const parentPrefix = `.${containerElementCls} .${toastElementCls}`;
  return `
  ${parentPrefix} .${prefixCls}-close-btn {
    ${styleText}
  }
  `;
}

function getCustomConfirmBtnStyle(
  styleText: string,
  prefixCls = 'toast',
  containerElementCls: string,
  toastElementCls: string
) {
  const parentPrefix = `.${containerElementCls} .${toastElementCls}`;
  return `
  ${parentPrefix} .${prefixCls}-confirm-btn {
    ${styleText}
  }
  `;
}

type Dataset = {
  id: string;
  type: string;
};

function closest(
  target: HTMLElement,
  containerElement: Element
): Dataset | null {
  if (target.dataset && target.dataset.id && target.dataset.type) {
    return target.dataset as Dataset;
  } else {
    if (target.parentNode === containerElement) {
      return null;
    } else {
      return closest(target.parentNode as HTMLElement, containerElement);
    }
  }
}

function getContainerElementCls(prefixCls = 'toast', scopeCls: string) {
  return window.Boolean(scopeCls)
    ? `${prefixCls}-container-${scopeCls}`
    : `${prefixCls}-container`;
}

function getToastElementCls(prefixCls = 'toast', scopeCls: string) {
  return window.Boolean(scopeCls) ? `${prefixCls}-${scopeCls}` : `${prefixCls}`;
}

function getIconHTML(icon: string | undefined) {
  if (!icon) {
    return '';
  }
  if (icon.includes('</svg>')) {
    return `<div class="toast-icon">
              ${icon}
            </div>`;
  }

  if (icon.includes('/')) {
    return `<div class="toast-icon">
              <img src="${icon}" alt="toast-icon" />
            </div>`;
  }
  return `<div class="toast-icon">
            <span class="${icon}"></span>
          </div>`;
}

export {
  getBaseStyle,
  getCustomContainerStyle,
  getCustomToastStyle,
  getCustomIconCloseStyle,
  getCustomHeaderStyle,
  getCustomIconStyle,
  getCustomTopicStyle,
  getCustomContentStyle,
  getCustomFooterStyle,
  getCustomCloseBtnStyle,
  getCustomConfirmBtnStyle,
  closest,
  getContainerElementCls,
  getToastElementCls,
  getIconHTML,
};
