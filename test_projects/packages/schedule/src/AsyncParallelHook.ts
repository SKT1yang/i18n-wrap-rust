/*
 * @name: Do not edit
 * @description: Do not edit
 * @date: 2023-05-12 13:01:10
 * @path: \schedule\src\AsyncParallelHook.ts
 */
import { Good, Notify, GoodStatus, UserGood, Data, Config } from "./types";
import { judgeGoodHandlerCanExecute } from "./utils";

/**
 * 异步并行钩子
 */
class AsyncParallelHook {
  // 逻辑池
  private logicPool = new Map<string, Good[]>();
  // 订阅者消息缓存
  private notifyCache = new Map<string, Notify[]>();

  private config: Config = {
    // 开启延迟触发消息模式，当逻辑单元还未注册到逻辑池时，将发布者消息加到缓存里，在逻辑单元注册上来时马上触发
    delayTrigger: true,
    // 控制台是否被打印消息
    console: true,
  };

  constructor(opt?: Partial<Config>) {
    Object.assign(this.config, opt);
  }

  /**
   * 发布消息
   * @param topic 消息名
   * @param body 消息体
   */
  async on<T = any>(topic: string, body: UserGood) {
    // 确保topic存在
    if (typeof topic !== "string" || !topic) {
      console.error(
        `[Schedule error]:消息topic 【${topic}】 不存在或非法消息名！`
      );
      return;
    }
    const good = {
      ...body,
      topic,
      count: 0,
      status: GoodStatus.pedding,
    };

    let result: {
      good: Good;
      dataList: Data<T>[][];
    } = {
      good,
      dataList: [],
    };
    const goods = this.logicPool.get(topic);

    if (Array.isArray(goods)) {
      goods.push(good);
    } else {
      this.logicPool.set(topic, [good]);
    }

    // 检索并触发缓存的发布者消息
    if (this.config.delayTrigger) {
      const notifys = this.notifyCache.get(good.topic);
      if (Array.isArray(notifys)) {
        for (let index = 0; index < notifys.length; index++) {
          const notify = notifys[index];
          const dataList = await this.emit(good.topic, notify);
          result.dataList.push(dataList);
          this.offNotify(good.topic);
        }
      }
    }

    return result;
  }

  /**
   * 取消订阅
   * @param topic
   * @param good
   */
  off(topic: string, good?: Good) {
    const goods = this.logicPool.get(topic);
    if (Array.isArray(goods)) {
      if (good !== undefined) {
        goods.splice(goods.indexOf(good) >>> 0, 1);
      } else {
        this.logicPool.delete(topic);
        this.offNotify(topic);
      }
    }
  }

  private offNotify(topic: string) {
    this.notifyCache.delete(topic);
  }

  /**
   * 清空消息
   */
  clear() {
    this.logicPool.clear();
  }

  /**
   * 订阅消息
   * @param topic
   * @param nodify
   * @returns
   */
  async emit<T = any>(topic: string, body?: Omit<Notify, "topic">) {
    let dataList: Data<T>[] = [];
    try {
      const nodify = {
        ...body,
        topic,
      };
      if (typeof nodify.executeGuard === "function") {
        nodify.executeGuardPolicy = "subscriber";
      }
      if (this.logicPool.has(topic)) {
        const goods = this.logicPool.get(topic);
        if (goods && Array.isArray(goods)) {
          for (let index = 0; index < goods.length; index++) {
            const good = goods[index];
            await this.executeGood<T>(nodify, good, dataList);
          }
        }
      } else {
        // 缓存订阅者消息
        if (this.config.delayTrigger) {
          const notifys = this.notifyCache.get(topic);
          if (Array.isArray(notifys)) {
            notifys.push(nodify);
          } else {
            this.notifyCache.set(topic, [nodify]);
          }
        }
      }
    } catch (error) {
      console.error(
        `[Schedule error]:emit 【${topic}】 消息时发生错误！${error}`
      );
    }
    return dataList;
  }

  /**
   * 消费消息
   * @param nodify
   * @param good
   * @param dataList
   */
  private async executeGood<T = any>(
    nodify: Notify,
    good: Good,
    dataList: Data<T>[]
  ) {
    // 订阅次数加1
    good.count += 1;
    let data = undefined;
    if (good.data !== undefined) {
      data = good.data;
    }
    try {
      if (
        typeof good.handler === "function" &&
        judgeGoodHandlerCanExecute(nodify, good)
      ) {
        const hanlderData = await good.handler(nodify);
        // 说明同时存在data和handler
        if (good.data !== undefined) {
          data = {
            directData: good.data,
            hanlderData,
          };
        } else {
          data = hanlderData;
        }
        // once逻辑：先得到函数执行结果后移除good
        good.once && this.off(good.topic, good);
      }
    } catch (error) {
      console.error(
        `[Schedule error]:消费【${good.topic}】的handler时发生错误！${error}`
      );
    }
    dataList.push(data);
  }
}

export { AsyncParallelHook };
