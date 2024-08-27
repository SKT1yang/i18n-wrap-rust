import { t } from "..\\..\\..\\languages\\index";
import { getTreeEventTypeOptsApi, getSearchAggTermApi } from "../../../model/event";
import { computed, ref, unref } from "vue";
interface IEventTypeOptionsTree {
	eventTypes?: IEventTypeOptionsTree[];
	id: number;
	level: number;
	name: string;
}
const eventTypeOptions = ref<IEventTypeOptionsTree[]>([]);
const logSourceTypeOptions = ref<{
	key: string;
	value: number;
}[]>([]);
const eventNameOptions = ref<{
	key: string;
	value: number;
}[]>([]);
export function useEventTypeOpts() {
	const getEventTypeRef = computed(() => {
		return eventTypeOptions.value;
	});
	const getLogSourceTypeRef = computed(() => {
		return logSourceTypeOptions.value;
	});
	const getEventName = computed(() => {
		return eventNameOptions.value;
	});
	async function getTreeEventTypeOptsData() {
		const treeData = await getTreeEventTypeOptsApi();
		eventTypeOptions.value = ((unref(treeData)) as any);
	}
	async function getSearchAggTerm() {
		const data = await getSearchAggTermApi();
		logSourceTypeOptions.value = unref(data.logSourceType);
		eventNameOptions.value = data.eventName;
	}
	const getRouteInfo = async function(routeInfo?) {
		const treeData = await getTreeEventTypeOptsApi();
		const temp = treeData;
		if (routeInfo !== t("主机事件") && routeInfo !== t("事件列表")) {
			eventTypeOptions.value = disableEventType(temp);
		} else {
			eventTypeOptions.value = ((temp) as any);
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
		getRouteInfo
	};
}
