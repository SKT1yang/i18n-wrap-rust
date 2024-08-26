import {
  getTreeEventTypeOptsApi,
  getSearchAggTermApi,
} from "../../../model/event";
import { computed, ref, unref } from "vue";

interface IEventTypeOptionsTree {
  eventTypes?: IEventTypeOptionsTree[];
  id: number;
  level: number;
  name: string;
}

// 事件类型下拉选项
const eventTypeOptions = ref<IEventTypeOptionsTree[]>([]);

// 日志源类型下拉选项
const logSourceTypeOptions = ref<{ key: string; value: number }[]>([]);

// 事件名称下拉选项
const eventNameOptions = ref<{ key: string; value: number }[]>([]);

export function useEventTypeOpts() {
  // 返回事件类型下拉选项
  const getEventTypeRef = computed(() => {
    return eventTypeOptions.value;
  });

  // 返回日志源类型下拉选项
  const getLogSourceTypeRef = computed(() => {
    return logSourceTypeOptions.value;
  });

  // 返回事件名称下拉选项
  const getEventName = computed(() => {
    return eventNameOptions.value;
  });

  // 获取事件类型下拉选项
  async function getTreeEventTypeOptsData() {
    const treeData = await getTreeEventTypeOptsApi();
    eventTypeOptions.value = unref(treeData) as any;
  }

  // 获取日志源类型下拉选项、事件名称下拉选项
  async function getSearchAggTerm() {
    const data = await getSearchAggTermApi();
    // logSourceTypeOptions.value = data.logSourceType;
    logSourceTypeOptions.value = unref(data.logSourceType);
    eventNameOptions.value = data.eventName;
  }

  const getRouteInfo = async function (routeInfo?) {
    const treeData = await getTreeEventTypeOptsApi();
    const temp = treeData;
    if (routeInfo !== "主机事件" && routeInfo !== "事件列表") {
      eventTypeOptions.value = disableEventType(temp);
    } else {
      eventTypeOptions.value = temp as any;
    }
  };

  const disableEventType: any = (data) => {
    return data.map((element) => {
      if (element.level === 1 || element.level === 2) {
        element.disabled = true;
      }
      if (element.eventTypes && element.eventTypes.length > 0) {
        disableEventType(element.eventTypes);
      }
      return element;
    });
  };

  return {
    getTreeEventTypeOptsData,
    getSearchAggTerm,
    getEventTypeRef,
    getLogSourceTypeRef,
    getEventName,
    getRouteInfo,
  };
}
