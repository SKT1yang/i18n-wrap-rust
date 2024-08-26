/*
 * @name: 用户行为监测
 * @description: 1. 运行时实例 2.localstorage USER_BEHEAVIOR_INFO
 * todo 1. 增加初始化方式，这样状态更可控；2. 定时器一致跑着，使用状态机
 */
import type { Pausable } from '@vueuse/core';
import { useIntervalFn } from '@vueuse/core';
import { reactive } from 'vue';
import { ls } from '../cache';
import { onUnMountedOrDeactivated } from '.';
import { log } from '../env';

const DEFAULT_TIME_OUT = 2 * 60 * 60 * 1000;
const USER_BEHEAVIOR_INFO = 'USER_BEHEAVIOR_INFO';

interface BehaviorMonitorConfig {
  // 开始监测
  running: boolean;
  // 用户无操作开始时刻（毫秒）
  noOperationStartTime: number;
  // 超时时间判断模式
  timeoutMode: 'default' | 'login';
  // 页面超时时间（毫秒）
  timeout: number;
  // 登录超时时间（毫秒）
  sysLoginTime: number;
  // 监测频率（毫秒）
  frequency: number;
}

/**
 *
 * @param opt 基本配置
 * @param logout 登出系统函数
 * @param needMonitor  当前是否监测回调
 * @param getLoginTime 获取token有效时长
 */
function useBehaviorMonitor(
  needMonitor: () => boolean,
  logout: (...arg: any[]) => any,
  getLoginTime: () => Promise<number>,
  opt: Partial<BehaviorMonitorConfig> = {}
) {
  let pausable: Pausable | undefined;

  // 需要检测的行为数据
  const behaviorMonitor = reactive<BehaviorMonitorConfig>({
    // 开始监测
    running: false,
    noOperationStartTime: 0,
    // 超时时间判断模式
    timeoutMode: 'login',
    // 页面超时时间（毫秒）
    timeout: DEFAULT_TIME_OUT,
    // 登录超时时间（毫秒）
    sysLoginTime: DEFAULT_TIME_OUT,
    // 监测频率（毫秒）
    frequency: 1000,
  });

  update(opt);

  async function watchRouteChange() {
    // 登录页面初始化信息
    if (location.hash.includes('#/login')) {
      clear('#/login');
    }
    const isNeedMonitor = needMonitor();
    log('[@guolisec/utils] useBehaviorMonitor isNeedMonitor', isNeedMonitor);
    if (isNeedMonitor) {
      await createMonitor();
    } else {
      clear('is not NeedMonitor');
    }
  }

  async function createMonitor() {
    // 获取登录时间报错，采用默认超时时间
    try {
      behaviorMonitor.sysLoginTime = await getLoginTime();
      log(
        '[@guolisec/utils] useBehaviorMonitor 此次超时时间为：',
        behaviorMonitor.sysLoginTime
      );
    } catch (error) {
      log('[@guolisec/utils] 获取登录时间报错，采用默认超时时间', error);
      behaviorMonitor.sysLoginTime = DEFAULT_TIME_OUT;
    }

    removeEventListener();
    addEventListener();
    behaviorMonitor.noOperationStartTime = new Date().getTime();
    recoveryUnloadOperation();
    behaviorMonitor.running = true;
    if (pausable === undefined) {
      pausable = useIntervalFn(() => {
        behaviorMonitor.running && handleLogout();
      }, behaviorMonitor.frequency);
    }
    pausable.resume();
  }

  /**
   * 还原状态，并做一次 《超时退出》 校验
   */
  function recoveryUnloadOperation() {
    update(ls.get<BehaviorMonitorConfig>(USER_BEHEAVIOR_INFO) || {});
    if (behaviorMonitor.noOperationStartTime) {
      handleLogout();
      console.log('recoveryUnloadOperation');
    }
  }

  function clear(key: string) {
    log('[@guolisec/utils] useBehaviorMonitor clear', key);
    behaviorMonitor.running = false;
    // 恢复完后，清楚所有痕迹
    behaviorMonitor.noOperationStartTime = 0;
    removeEventListener();
    pausable && pausable.pause();
    ls.remove(USER_BEHEAVIOR_INFO);
  }

  // 页面销毁前缓存用户操作信息快照
  async function recordOperateSnapshot() {
    behaviorMonitor.noOperationStartTime = new Date().getTime();
    ls.set(USER_BEHEAVIOR_INFO, behaviorMonitor);
    log('[@guolisec/utils] useBehaviorMonitor after recordOperateSnapshot');
  }

  // 添加事件
  function addEventListener() {
    // 监听点击事件
    document.addEventListener('click', recordStaticOperation, true);
    document.addEventListener('mousewheel', recordStaticOperation, true);
    document.addEventListener('mousemove', recordStaticOperation, true);
    document.addEventListener('keydown', recordStaticOperation, true);
    window.addEventListener('beforeunload', recordOperateSnapshot);
  }
  //  移除事件
  function removeEventListener() {
    // 移除点击事件
    document.removeEventListener('click', recordStaticOperation, true);
    document.removeEventListener('mousewheel', recordStaticOperation, true);
    document.removeEventListener('mousemove', recordStaticOperation, true);
    document.removeEventListener('keydown', recordStaticOperation, true);
  }

  // 记录静态操作
  function recordStaticOperation() {
    // 刷新用户无操作开始时间
    behaviorMonitor.noOperationStartTime = new Date().getTime();
  }

  /**
   * 更新状态
   * @param opt 配置
   */
  function update(opt: Partial<BehaviorMonitorConfig> = {}) {
    Object.assign(behaviorMonitor, opt);
  }

  /**
   * 《超时退出》
   */
  function handleLogout() {
    if (behaviorMonitor.noOperationStartTime !== 0) {
      const currentTime = new Date().getTime();
      const noOperationTime =
        currentTime - behaviorMonitor.noOperationStartTime;
      if (
        behaviorMonitor.timeoutMode === 'default' &&
        noOperationTime > behaviorMonitor.timeout
      ) {
        // 登出
        logout('超时退出！');
        clear('default 超时退出！');
      }
      if (
        behaviorMonitor.timeoutMode === 'login' &&
        noOperationTime > behaviorMonitor.sysLoginTime
      ) {
        // 登出
        logout('超时退出！');
        clear('login 超时退出！');
      }
    }
  }

  // 这里不能将localstorage USER_BEHEAVIOR_INFO删除，会导致token超时但是refresh token没超时（设置的24小时，很长）不退出
  onUnMountedOrDeactivated(() => {
    behaviorMonitor.running = false;
    removeEventListener();
    pausable && pausable.pause();
  });

  return { watchRouteChange, update };
}

export { useBehaviorMonitor };
