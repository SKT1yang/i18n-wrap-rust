import { t } from "..\\languages\\index";
import type { FormInstance } from "ant-design-vue";
import { ref } from "vue";
import { http } from "@guolisec/request";
import { message } from "@guolisec/toast";
export function useUser() {
	const dataList = ref([]);
	message.warning(t("我是消息！"));
	return { dataList };
}
