import {
  getBaseStyle,
  closest,
  getIconHTML,
  getContainerElementCls,
  getToastElementCls,
  getCustomContainerStyle,
  getCustomToastStyle,
  getCustomHeaderStyle,
  getCustomContentStyle,
  getCustomFooterStyle,
  getCustomCloseBtnStyle,
  getCustomConfirmBtnStyle,
  getCustomIconCloseStyle,
  getCustomIconStyle,
  getCustomTopicStyle,
} from "./helper";
import { uuid, addClass, removeClass } from "../utils";
import { TimeoutHandle } from "@guolisec/types";

type Options = {
  /* 容器配置 */
  prefixCls: string;
  scopeCls: string;
  customContainerStyle?: string;
  customToastStyle?: string;
  customIconCloseStyle?: string;
  customHeaderStyle?: string;
  customIconStyle?: string;
  customTopicStyle?: string;
  customContentStyle?: string;
  customFooterStyle?: string;
  customCloseBtnStyle?: string;
  customConfirmBtnStyle?: string;
  customStyle?: string;
} & ToastOptions;

type ToastOptions = {
  topic: string;
  duration?: number;
  icon?: string;
  content?: string;
  key?: string;
  className?: string;
  showCloseIcon?: boolean;
  showOkBtn?: boolean;
  showCloseBtn?: boolean;
  single?: boolean;
  onOk?: (closeFn: () => void, e: MouseEvent) => void;
  onClose?: () => void;
};

type ToastStatusSnapshot = {
  idCls: string;
  timer?: TimeoutHandle | null;
} & ToastOptions;

class Toast {
  // 容器唯一标识
  containerUuid: string | undefined = undefined;
  // 当前存活的toast队列
  private toastAliveList: ToastStatusSnapshot[] = [];
  // 信号对象实例，会在toastList为空时自动移除,存在说明 事件代理 函数已绑定，反之，未绑定
  private abortController: AbortController | null = null;

  private options: Options = {
    /* 容器配置 */
    prefixCls: "toast",
    scopeCls: "message",
    customContainerStyle: ``,
    customToastStyle: ``,
    customIconCloseStyle: ``,
    customHeaderStyle: ``,
    customIconStyle: ``,
    customTopicStyle: ``,
    customContentStyle: ``,
    customFooterStyle: ``,
    customCloseBtnStyle: ``,
    customConfirmBtnStyle: ``,
    customStyle: ``,
    /* toast项配置 创建完需重置  */
    topic: "",
    duration: 3000, // 自动关闭的延时，单位秒。设为 0 时不自动关闭，默认3s
    onOk: () => {},
    onClose: () => {},
    showCloseIcon: true,
    showOkBtn: true,
    showCloseBtn: true,
    single: false,
    icon: "",
    key: "",
    className: "",
    content: "",
  };

  constructor(options: Options) {
    this.containerUuid = uuid();
    this._setOptions(options);
  }

  /**
   * Display the toast
   * @public
   */
  open(options?: Options) {
    options && this._setOptions(options);
    return this._buildElement();
  }

  /**
   * Hide the toast
   * @public
   */
  close(key: string) {
    if (!key) return;
    return this._removeElement(key);
  }

  clear() {
    const toastContainerElement = document.querySelector(
      `.${this._getContainerElementIdCls()}`
    );
    if (toastContainerElement && toastContainerElement.parentNode) {
      for (let index = 0; index < this.toastAliveList.length; index++) {
        const toastStatusSnapshot = this.toastAliveList[index];
        // 如果有定时器，取消定时器
        if (
          toastStatusSnapshot &&
          toastStatusSnapshot.duration &&
          toastStatusSnapshot.duration > 0 &&
          toastStatusSnapshot.timer
        ) {
          clearTimeout(toastStatusSnapshot.timer);
        }
      }
      this.abortController && this.abortController.abort();
      toastContainerElement.parentNode.removeChild(toastContainerElement);
      const styleId = `${this.options.prefixCls}-${this.containerUuid}`;
      const styleDom = document.querySelector(`[data-toast-hash="${styleId}"]`);
      if (styleDom && styleDom.parentNode) {
        styleDom.parentNode.removeChild(styleDom);
      }
      this.toastAliveList = [];
      this.abortController = null;
    }
  }

  private _setOptions(options: Options) {
    Object.assign(this.options, options);
  }

  /**
   * Build the Toast element
   * @returns {Element}
   * @private
   */
  private _buildElement() {
    // 确保配置存在
    if (!this.options) {
      throw "Toast is not initialized";
    }
    // 挂载容器,此时已经挂在body，并渲染好了
    const containerElement = this._buildContainerElement();
    console.log(this.options.single)
    if (
      this.options.single === true &&
      containerElement.childNodes.length > 0
    ) {
      return;
    }
    // 挂载样式
    this._buildStyleElement();
    const { toastElement, currenAliveToast } = this._getToastElement();
    // 挂载当前toast
    containerElement.appendChild(toastElement);

    // 为 containerElement 添加可被移除的事件监听器
    if (this.abortController === null) {
      this.abortController = new AbortController();
      const handleClick = (e: MouseEvent) => {
        const dataset = closest(e.target as HTMLElement, containerElement);
        if (dataset) {
          const targetToastAlive = this.toastAliveList.find((toastAlive) => {
            return (toastAlive.idCls = dataset.id);
          });
          switch (dataset.type) {
            case "close": {
              if (targetToastAlive) {
                this._removeElement(targetToastAlive.idCls);
                if (typeof targetToastAlive.onClose === "function") {
                  targetToastAlive.onClose();
                }
              }
              break;
            }
            case "ok": {
              if (targetToastAlive) {
                const closeFn = () => {
                  this._removeElement(targetToastAlive.idCls);
                };
                if (typeof targetToastAlive.onOk === "function") {
                  targetToastAlive.onOk(closeFn, e);
                }
              }
              break;
            }
          }
        }
      };
      containerElement.addEventListener("click", handleClick, {
        signal: this.abortController.signal,
      });
    }

    //
    if (
      currenAliveToast.duration !== undefined &&
      currenAliveToast.duration > 0
    ) {
      currenAliveToast.timer = setTimeout(() => {
        this._removeElement(currenAliveToast.idCls);
      }, currenAliveToast.duration);
    }

    // 渲染结束
    return currenAliveToast.idCls;
  }

  private _buildContainerElement() {
    if (!this.containerUuid) {
      console.warn("容器元素唯一标识不存在");
    }
    // 唯一标识
    const idCls = this._getContainerElementIdCls();

    // 已创建
    const existContainerElement = document.querySelector(`.${idCls}`);
    if (existContainerElement) {
      return existContainerElement;
    }

    // 创建容器元素
    const commonCls = `${this.options.prefixCls}-container`;
    const scopeCls = `${this.options.prefixCls}-container-${this.options.scopeCls}`;
    const containerElement = document.createElement("div");
    containerElement.className = `${commonCls} ${scopeCls} ${idCls}`;

    // 插入到文档
    document.body.appendChild(containerElement);

    return containerElement;
  }

  private _getContainerElementIdCls() {
    return window.Boolean(this.options.scopeCls)
      ? `${this.options.prefixCls}-container-${this.options.scopeCls}-${this.containerUuid}`
      : `${this.options.prefixCls}-container-${this.containerUuid}`;
  }

  private _buildStyleElement() {
    if (!this.containerUuid) {
      console.warn("容器元素唯一标识不存在");
    }
    const id = `${this.options.prefixCls}-${this.containerUuid}`;

    let style = document.querySelector(`[data-toast-hash="${id}"]`);
    if (!style) {
      style = document.createElement("style");
      style.setAttribute("data-toast-hash", id);
      const containerElementCls = getContainerElementCls(
        this.options.prefixCls,
        this.options.scopeCls
      );
      const toastElementCls = getToastElementCls(
        this.options.prefixCls,
        this.options.scopeCls
      );
      const baseStyle = getBaseStyle(this.options.prefixCls);
      const customContainerStyle = getCustomContainerStyle(
        this.options.customContainerStyle || "",
        containerElementCls
      );
      const customToastStyle = getCustomToastStyle(
        this.options.customToastStyle || "",
        containerElementCls,
        toastElementCls
      );
      const customIconCloseStyle = getCustomIconCloseStyle(
        this.options.customIconCloseStyle || "",
        this.options.prefixCls,
        containerElementCls,
        toastElementCls
      );
      const customHeaderStyle = getCustomHeaderStyle(
        this.options.customHeaderStyle || "",
        this.options.prefixCls,
        containerElementCls,
        toastElementCls
      );
      const customIconStyle = getCustomIconStyle(
        this.options.customIconStyle || "",
        this.options.prefixCls,
        containerElementCls,
        toastElementCls
      );
      const customTopicStyle = getCustomTopicStyle(
        this.options.customTopicStyle || "",
        this.options.prefixCls,
        containerElementCls,
        toastElementCls
      );
      const customContentStyle = getCustomContentStyle(
        this.options.customContentStyle || "",
        this.options.prefixCls,
        containerElementCls,
        toastElementCls
      );
      const customFooterStyle = getCustomFooterStyle(
        this.options.customFooterStyle || "",
        this.options.prefixCls,
        containerElementCls,
        toastElementCls
      );
      const customCloseBtnStyle = getCustomCloseBtnStyle(
        this.options.customCloseBtnStyle || "",
        this.options.prefixCls,
        containerElementCls,
        toastElementCls
      );
      const customConfirmBtnStyle = getCustomConfirmBtnStyle(
        this.options.customConfirmBtnStyle || "",
        this.options.prefixCls,
        containerElementCls,
        toastElementCls
      );
      style.innerHTML =
        baseStyle +
        customContainerStyle +
        customToastStyle +
        customIconCloseStyle +
        customHeaderStyle +
        customIconStyle +
        customTopicStyle +
        customContentStyle +
        customFooterStyle +
        customCloseBtnStyle +
        customConfirmBtnStyle +
        this.options.customStyle;
      // 插入到文档
      document.head.appendChild(style);
    }
    return style;
  }

  private _getToastElement() {
    // 创建toast项
    // 创建容器元素
    const id = uuid();
    const commonCls = this.options.prefixCls;
    const scopeCls = window.Boolean(commonCls)
      ? `${commonCls}-${this.options.scopeCls}`
      : "";
    // 唯一标识
    const idCls = this.options.key ? this.options.key : `${scopeCls}-${id}`;
    const toastElement = document.createElement("div");
    toastElement.className = `${commonCls} ${scopeCls} ${idCls} ${
      this.options.className ?? ""
    } show`;
    toastElement.innerHTML = this._computeToastInnerHTML(idCls);
    // 将当前toast推入存活队列
    const currenAliveToast: ToastStatusSnapshot = {
      idCls,
      topic: this.options.topic,
      duration: this.options.duration,
      onOk: this.options.onOk,
      onClose: this.options.onClose,
      showCloseIcon: this.options.showCloseIcon,
      showOkBtn: this.options.showOkBtn,
      showCloseBtn: this.options.showCloseBtn,
      icon: this.options.icon,
      content: this.options.content,
      className: this.options.className,
    };
    this.toastAliveList.push(currenAliveToast);

    // 返回当前toast
    return {
      toastElement,
      currenAliveToast,
    };
  }

  private _computeToastInnerHTML(idCls: string) {
    // 右上关闭按钮的HMTL
    const closeIconBtnHtml = this.options.showCloseIcon
      ? `<button class="toast-icon-close" class="toast-close-btn" data-type="close" data-id="${idCls}">
          <svg viewBox="64 64 896 896" focusable="false" data-icon="close" width="1em" height="1em" fill="currentColor" aria-hidden="true">
            <path d="M563.8 512l262.5-312.9c4.4-5.2.7-13.1-6.1-13.1h-79.8c-4.7 0-9.2 2.1-12.3 5.7L511.6 449.8 295.1 191.7c-3-3.6-7.5-5.7-12.3-5.7H203c-6.8 0-10.5 7.9-6.1 13.1L459.4 512 196.9 824.9A7.95 7.95 0 00203 838h79.8c4.7 0 9.2-2.1 12.3-5.7l216.5-258.1 216.5 258.1c3 3.6 7.5 5.7 12.3 5.7h79.8c6.8 0 10.5-7.9 6.1-13.1L563.8 512z"></path>
          </svg>
        </button>`
      : "";
    // header左侧icon的HMTL
    const iconHtml = getIconHTML(this.options.icon);
    // header的HMTL
    const headerHTML = `<div class="toast-header">
                          ${iconHtml}
                          <div class="toast-topic">
                          ${this.options.topic}
                          </div>
                        </div>`;

    // content的HMTL
    const contentHTML = `<div class="toast-content">
                          ${this.options.content}
                        </div>
                        `;
    // footer的HTML
    const footerHTML =
      this.options.showCloseBtn && this.options.showOkBtn
        ? `<div class="toast-footer">
          ${
            this.options.showCloseBtn
              ? `<button class="toast-close-btn" data-type="close" data-id="${idCls}">取消</button>`
              : ""
          }
          ${
            this.options.showOkBtn
              ? `<button class="toast-confirm-btn" data-type="ok" data-id="${idCls}">确定</button>`
              : ""
          }
        </div>
        `
        : "";
    return closeIconBtnHtml + headerHTML + contentHTML + footerHTML;
  }

  /**
   * Remove the toast from the DOM
   * @param {Element} toastElement
   */
  private _removeElement(idCls: string) {
    if (!idCls) {
      return;
    }
    const toastContainerElement = document.querySelector(
      `.${this._getContainerElementIdCls()}`
    );
    const node = document.querySelector(`.${idCls}`);
    if (node) {
      // 移除dom前增加hide的class 方便处理消失动画
      removeClass(node, "show");
      addClass(node, "hide");
    }
    const animationTimer = setTimeout(() => {
      const aliveToast = this.toastAliveList.find(
        (config) => config.idCls === idCls
      );
      if (node && node.parentNode) {
        node.parentNode.removeChild(node);

        // 如果有定时器，取消定时器
        if (
          aliveToast &&
          aliveToast.duration &&
          aliveToast.duration > 0 &&
          aliveToast.timer
        ) {
          clearTimeout(aliveToast.timer);
        }
        // 从存活队列中删除
        if (aliveToast) {
          const index = this.toastAliveList.indexOf(aliveToast);
          this.toastAliveList.splice(index, 1);
        }
      }
      // 如果没有toast了，将container dom、 style dom 和 事件委托等都删除
      if (
        toastContainerElement &&
        toastContainerElement.childNodes.length === 0
      ) {
        this.abortController && this.abortController.abort();
        if (toastContainerElement.parentNode) {
          toastContainerElement.parentNode.removeChild(toastContainerElement);
        }
        const styleId = `${this.options.prefixCls}-${this.containerUuid}`;
        const styleDom = document.querySelector(
          `[data-toast-hash="${styleId}"]`
        );
        if (styleDom && styleDom.parentNode) {
          styleDom.parentNode.removeChild(styleDom);
        }
        this.toastAliveList = [];
        this.abortController = null;
      }

      animationTimer && clearTimeout(animationTimer);
    }, 400);
  }
}
// Returning the Toast function to be assigned to the window object/module
function CreateToastInstance(options: Options) {
  return new Toast(options);
}

export default CreateToastInstance;
