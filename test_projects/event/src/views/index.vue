<template>
	<div class="p-4">
		<!-- 我是注释 -->
		<card>
			<row>{{ t("关联事件清单") }}<button @click="handleCreate" :disabled="!newable" class="mb-2" type="primary">
					<div class="flex flex-center">
						<div class="i-base-add-circle-line m-r-2 scale-125"></div>{{ t("新增关联事件") }}
					</div>
				</button>

			</row>
			<table :loading="tableLoading" bordered @change="handleChange" :pagination="pagin" rowkey="id" :columns="columns" :data-source="tableData.list">
				<template #bodycell="{ column, record }">
					<template v-if="column.dataIndex == 'action'">
						<popconfirm :title="record.id !== -1 ? t('是否确认删除') : t('是否确认取消')" v-if="record.id == -1 || record.id !== 0" @confirm="handleDelete(record)">
							<button danger>{{ record.id !== -1 ? t("删除") : t("取消") }}</button>
						</popconfirm>
					</template>
				</template>
			</table>
			<selecteventmodal v-model:open="open" :record="record" :idx="idx" :eventstorename="eventStoreName" @refresh="query" @finish="newable = true" @continue="handleSuccess"></selecteventmodal>
		</card>
	</div>
</template>





<!-- 我是注释 -->

<script name="AssetList" lang="tsx" setup>
import { t } from "../languages/index";
import { Tag, Button, Card, Table, Modal, message, Row, Col, Popconfirm } from "ant-design-vue";
import { EventStoreName, IAssociateEventStore, CustomRenderOpt, getEventComposeSettingListApi, deleteEventComposeSettingApi } from "../../../model/policy";
import type { TableColumnsType } from "ant-design-vue";
import { Event } from "./components/SelectEventModal/types/event.class";
import SelectEventModal from "./components/SelectEventModal/index.vue";
import { onMounted, reactive, ref } from "vue";
import { getPagin } from "../../../utils/getPagin";
const newable = ref(true);
const { tableData, pagin } = getPagin();
const handleChange = (e) => {
	if (newable.value == false) {
		Modal.confirm({
			content: t("是否中断新增操作？"),
			okText: t("确认"),
			cancelText: t("取消"),
			onOk: () => {
				tableData.current = e.current;
				tableData.pageSize = e.pageSize;
				newable.value = true;
				query();
			}
		});
	} else {
		tableData.current = e.current;
		tableData.pageSize = e.pageSize;
		query();
	}
};
onMounted(() => {
	query();
});
const tableLoading = ref(false);
const query = async () => {
	tableLoading.value = true;
	await getEventComposeSettingList({
		page: tableData.current,
		size: tableData.pageSize
	}).then((res) => {
		tableLoading.value = false;
		let indexShow = 1 + tableData.pageSize * (tableData.current - 1);
		tableData.total = res.totalElements;
		tableData.list = res.content.map((value) => {
			return {
				...value,
				indexShow: indexShow++
			};
		});
	});
};
function customRenderFactory(eventStoreName: EventStoreName) {
	return (opt: CustomRenderOpt) => {
		const eventStore = opt.record[eventStoreName];
		if (eventStore.id) {
			return <Tag class="cursor-pointer table_tag" color={"pink"} onClick={() => {
				handleSelect(opt.record, opt.index, eventStoreName);
			}}>
				{eventStore.name}
			</Tag>;
		} else {
			return <div class="w-full flex flex-center">
				<Button class="flex flex-center" type={"primary"} onClick={() => {
				handleSelect(opt.record, opt.index, eventStoreName);
			}}>
					<div class="i-base-add-circle-line scale-125"></div>
				</Button>
			</div>;
		}
	};
}
const columns: TableColumnsType = [{
	title: t("序号"),
	dataIndex: "indexShow",
	align: "center",
	width: 100
}, {
	title: t("事件A"),
	dataIndex: "eventStoreA",
	customRender: customRenderFactory("eventStoreA"),
	align: "center",
	width: 500
}, {
	title: t("事件B"),
	dataIndex: "eventStoreB",
	customRender: customRenderFactory("eventStoreB"),
	align: "center",
	width: 500
}, {
	title: t("事件C"),
	dataIndex: "eventStoreC",
	customRender: customRenderFactory("eventStoreC"),
	align: "center",
	width: 500
}, {
	title: t("操作"),
	dataIndex: "action",
	align: "center",
	width: 300
}];
function getEventComposeSettingList(queryForm) {
	return getEventComposeSettingListApi(queryForm);
}
function handleCreate() {
	newable.value = false;
	let operateRecord = reactive<IAssociateEventStore>({
		id: -1,
		eventStoreA: new Event(),
		eventStoreB: new Event(),
		eventStoreC: new Event()
	});
	tableData.total = tableData.total + 1;
	tableData.current = Math.floor(tableData.total / tableData.pageSize) + 1;
	query().then(() => {
		tableData.list.push(operateRecord);
	});
}
const open = ref(false);
const record = ref();
const idx = ref();
const eventStoreName = ref();
function handleSelect(record_p: IAssociateEventStore, idx_p: number, eventStoreName_p: EventStoreName) {
	record.value = record_p;
	idx.value = idx_p;
	eventStoreName.value = eventStoreName_p;
	open.value = true;
}
async function handleDelete(record) {
	if (record.id == -1) {
		deleteOne(record);
		return;
	}
	await deleteEventComposeSettingApi(record);
	message.success(t("删除成功！"));
	query().then(() => {
		handleEmptyPage();
	});
}
const handleEmptyPage = () => {
	if (tableData.list.length == 0) {
		if (tableData.current != 1) {
			tableData.current = tableData.current - 1;
			query();
		}
	}
};
function handleSuccess(dataForm: IAssociateEventStore) {
	tableData.list[tableData.list.length - 1] = dataForm;
}
const deleteOne = (record) => {
	if (record.id == -1) {
		tableData.list.pop();
		handleEmptyPage();
		newable.value = true;
	}
};
</script>








<style scoped>
::v-deep .table_tag {
	max-width: 100%;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
}
</style>


