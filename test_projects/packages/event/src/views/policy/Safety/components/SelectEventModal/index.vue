<template>
  <modal :open="parentProps.open" @cancel="emit('update:open', false)" :title="title" width="1200px" :min-height="700" :show-cancel-btn="false" :show-ok-btn="false">
    <form :wrapper-col="{ span: 17 }" :label-col="{ span: 5 }" layout="inline" :model="form">
      <formitem name="name" style="width:500px" :label="t('事件名称')">
        <input v-model:value="form.name" :maxlength="30" :placeholder="t('请输入数据名称')">
      </formitem>
      <formitem name="typeId" style="width:500px" :label="t('事件类型')">
        <cascader :expand-trigger="'hover'" change-on-select v-model:value="form.typeId" :options="casOptions.list" :fieldnames="{ label: 'name', value: 'id', children: 'eventTypes' }" :placeholder="t('请选择事件类型')"></cascader>
      </formitem>
      <div class="w-full flex flex-end">
        <button @click="reset" class="m-r-2">{{ t("重置") }}</button>
        <button type="primary" @click="() => { tableData.current = 1; query() }">{{ t("查询") }}</button>
      </div>
    </form>{{ t("资产列表") }}<table @change="handleChange" :columns="columns" :data-source="tableData.list" :pagination="pagin" size="small" rowkey="id" bordered :searchinfo="searchInfo">
      <template #bodycell="{ column, record }">
        <template v-if="column.title == t('操作')">
          <button type="primary" @click="handleSubmit(record)">{{ t("设为关联事件") }}</button>
        </template>
      </template>
    </table>
  </modal>
</template>
<script name="SelectEventModal" lang="ts" setup>
import { t } from "..\\..\\..\\..\\..\\languages\\index";
import { computed, reactive, ref, unref, watch } from "vue";
import { Modal, Table, message, Button, Input, Form, FormItem, Cascader } from "ant-design-vue";
import { EventStoreName, IEvent, IAssociateEventStore } from "./types/event";
import { Event } from "./types/event.class";
import type { TableColumnsType } from "ant-design-vue";
import { getEventStoreTreeApi, getEventStoreApi, modifyEventComposeSettingApi, createEventComposeSettingApi } from "../../../../../model/policy";
import { getPagin } from "../../../../../utils/getPagin";
const casOptions = reactive<{list: any[]}>({ list: [] });
const { tableData, pagin } = getPagin();
const emit = defineEmits(["refresh", "continue", "update:open", "finish"]);
const handleChange = (event) => {
	tableData.current = event.current;
	tableData.pageSize = event.pageSize;
	query();
};
let dataForm = reactive<IAssociateEventStore>({
	id: 0,
	eventStoreA: new Event(),
	eventStoreB: new Event(),
	eventStoreC: new Event()
});
let currentIdx = ref<number>(0);
let currentEventStoreName = ref<EventStoreName>("eventStoreA");
const parentProps = defineProps<{
	open: boolean;
	idx: any;
	record: any;
	eventStoreName: any;
}>();
watch(() => parentProps.open, () => {
	if (!parentProps.open) return;
	getEventStoreTreeApi().then((res) => {
		casOptions.list = res;
	});
	Object.assign(dataForm, parentProps.record);
	currentIdx.value = parentProps.idx;
	currentEventStoreName.value = parentProps.eventStoreName;
	reset();
	query();
}, { deep: true });
const reset = () => {
	form.name = undefined;
	form.typeId = undefined;
};
const columns: TableColumnsType = [{
	title: t("事件名"),
	dataIndex: "name",
	align: "center",
	ellipsis: true
}, {
	title: t("事件类型"),
	dataIndex: "type",
	align: "center",
	ellipsis: true
}, {
	title: t("操作"),
	dataIndex: "operation",
	align: "center"
}];
const form = reactive<{
	name?: string;
	typeId: any;
}>({
	name: undefined,
	typeId: undefined
});
const searchInfo = reactive<any>({});
const isEdit = computed(() => {
	return dataForm.id > 0;
});
const title = computed(() => {
	const event = currentEventStoreName.value.slice(-1);
	return isEdit.value ? t("修改关联事件") + event : t("新增关联事件") + event;
});
function query() {
	getEventStoreApi({
		page: tableData.current,
		size: tableData.pageSize,
		name: form.name,
		typeId: form.typeId
	}).then((res) => {
		tableData.total = res.totalElements;
		tableData.list = res.content;
	});
}
async function handleSubmit(record: any) {
	try {
		dataForm[currentEventStoreName.value] = { ...record };
		let pickList: IEvent[] = [];
		["eventStoreA", "eventStoreB", "eventStoreC"].forEach((key) => {
			if (dataForm[key].name) {
				pickList.push(dataForm[key]);
			}
		});
		let repeatFlag = false;
		if (pickList.length >= 2) {
			for (let i = 1; i < pickList.length; i++) {
				if (pickList[i].name === pickList[i - 1].name) {
					repeatFlag = true;
				}
			}
		}
		if (repeatFlag) {
			message.warning(t("存在重复事件名!"));
		} else {
			if (unref(isEdit)) {
				await modifyEventComposeSettingApi(dataForm);
				message.success(t("修改关联事件成功!"));
				emit("refresh");
			} else {
				if (dataForm.eventStoreA.id && dataForm.eventStoreB.id && dataForm.eventStoreC.id) {
					await createEventComposeSettingApi(dataForm);
					message.success(t("新增关联事件成功!"));
					emit("finish");
					emit("refresh");
				} else {
					message.success(t("请继续添加事件！"));
					emit("continue", JSON.parse(JSON.stringify(dataForm)));
				}
			}
		}
	} finally {
		emit("update:open", false);
	}
}
</script>
