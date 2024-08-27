<template>
  <div>
    <form :label-col="{ span: 4 }" :model="form">
      <row justify="space-between">
        
        <formitem :label="t('时间')">
          <rangepicker show-time allow-clear v-model:value="form.createTime" format="YYYY-MM-DD HH:mm"></rangepicker>
        </formitem>
        
        
        <formitem :label="t('事件类型')">
          <cascader v-show="showEventType" :fieldnames="{ label: 'name', value: 'id', children: 'eventTypes' }" expandtrigger="hover" :options="treeData" :changeonselect="true" :allowclear="false" v-model:value="form.eventTypes" :placeholder="t('请选择事件类型')">
          </cascader>
          <select mode="multiple" v-model:value="form.eventTypes" :placeholder="t('请选择事件类型')" :fieldnames="{ label: 'name', value: 'id' }" :allowclear="false" v-show="!showEventType" :options="eventTypesOptions"></select>
        </formitem>
        
        
        <formitem :label="t('日志源类型')">
          <select :options="logSourceTypeOptions" :placeholder="t('请选择日志源类型')" v-model:value="form.logSourceType" format="YYYY-MM-DD HH:mm"></select>
        </formitem>
        
      </row>
      <row justify="space-between">
        
        <formitem :label="t('事件级别')">
          <select :options="eventOptions" :placeholder="t('请选择事件级别')" v-model:value="form.eventLevel" format="YYYY-MM-DD HH:mm"></select>
        </formitem>
        
        
        
        <formitem>
          <button class="float-right" type="primary" @click="() => { tableData.current = 1; getEventList(); }">{{ t("查询") }}</button>
        </formitem>
        
      </row>
    </form>
    <template v-if="false">
      <row>
        
        <eventlevelchart ref="eventLevelChartRef" :start="chartForm.start" :end="chartForm.end" :treat="false" style="height: 250px"></eventlevelchart>
        
        
        <eventbarchart ref="eventNameChartRef" :start="chartForm.start" :end="chartForm.end" :treat="false" style="height: 250px"></eventbarchart>
        
      </row>
    </template>
    <table @change="handleChange" :loading="loading" bordered rowkey="id" :pagination="pagin" :data-source="tableData.list" :columns="setColumns()">
      <template #headercell="{ column }">
        <template v-if="column.dataIndex === 'srcName'">
          <span @click.stop="changeSrcName" style="cursor: pointer; text-decoration: underline">
            {{ srcHeaderName }}</span>
        </template>
        <template v-else-if="column.dataIndex === 'dstName'">
          <span @click.stop="changeDstName" style="cursor: pointer; text-decoration: underline">
            {{ dstHeaderName }}</span>
        </template>
        <template v-else>
          <span> {{ column.title }}</span>
        </template>
      </template>
      <template #bodycell="{ column, record }">
        <template v-if="column.dataIndex === 'srcName'">
          <div v-if="isScrIp">
            <span>{{ EmptyIpFilter(record.srcIp) }}</span>
          </div>
          <div v-else>{{ EmptyNameFilter(record.srcName) }}</div>
        </template>
        <template v-if="column.dataIndex === 'dstName'">
          <div v-if="isDstIp">
            <span>{{ EmptyIpFilter(record.dstIp) }}</span>
          </div>
          <div v-else>{{ EmptyNameFilter(record.dstName) }}</div>
        </template>
        <template v-if="column.dataIndex === 'operation'">
          <button type="link" @click="handleDetail(record)">{{ t("详情") }}</button>
        </template>
      </template>
    </table>
    <eventstablerowmodal :record="record" v-model:open="open"></eventstablerowmodal>
  </div>
</template>
<script setup name="EventsPage" lang="ts">
import { t } from "..\\..\\..\\languages\\index";
import { Row, Col, Table, Button, RangePicker, Form, FormItem, Cascader, Select } from "ant-design-vue";
import { useRouter } from "vue-router";
import { getPagin } from "../../../utils/getPagin";
import { getEventListApi, getEventTypeLevelApi, getSearchAggTermApi, getTreeEventTypeOptsApi } from "../../../model/event";
import { columns, eventOptions } from "../components/industrial.data";
import EventsTableRowModal from "../components/EventsTableRowModal.vue";
import EventLevelChart from "../components/EventLevelChart.vue";
import EventBarChart from "../components/EventBarChart.vue";
import { formatToDate } from "../../../utils/index";
import dayjs from "dayjs";
import { EmptyIpFilter, EmptyNameFilter } from "../../../utils/index";
import { nextTick, onMounted, reactive, ref } from "vue";
const showEventType = ref(true);
const { tableData, pagin } = getPagin();
const handleChange = (e) => {
	tableData.current = e.current;
	tableData.pageSize = e.pageSize;
	getEventList();
};
const eventType = 1003;
const form = reactive<{
	createTime?: [dayjs.Dayjs, dayjs.Dayjs];
	eventTypes: any[];
	logSourceType: any;
	eventLevel: any;
}>({
	createTime: undefined,
	eventTypes: [],
	logSourceType: undefined,
	eventLevel: undefined
});
const eventNameChartRef = ref();
const eventLevelChartRef = ref();
let chartForm = reactive({
	start: "",
	end: ""
});
let isScrIp = ref(false);
let srcHeaderName = ref(t("源名称"));
let isDstIp = ref(false);
let dstHeaderName = ref(t("目的名称"));
const { currentRoute } = useRouter();
currentRoute.value.params = history.state.queryTime ? history.state : {};
const eventTypesOptions = ref([]);
const setColumns = () => {
	return columns;
};
const loading = ref(false);
function getEventList() {
	const p: any = {
		...form,
		eventType,
		page: tableData.current,
		size: tableData.pageSize,
		sort: "@timestamp,desc",
		statusType: 0,
		signDiff: "1",
		logSourceNameTag: t("IT事件")
	};
	if (form.createTime) {
		p.createTime = form.createTime.map((item) => {
			return new Date(((item) as any)).toISOString();
		});
	}
	if (p.createTime) {
		chartForm.start = ((p.createTime[0]) as any);
		chartForm.end = ((p.createTime[1]) as any);
	} else {
		chartForm.start = "";
		chartForm.end = "";
	}
	loading.value = true;
	getEventListApi(p).then((res) => {
		res.content.forEach((item) => {
			item["@timestamp"] = formatToDate(item["@timestamp"], "YYYY-MM-DD HH:mm:ss");
		});
		tableData.list = res.content;
		tableData.total = res.totalElements;
		loading.value = false;
	});
}
const changeSrcName = () => {
	isScrIp.value = !isScrIp.value;
	if (isScrIp.value) {
		srcHeaderName.value = t("源IP");
	} else {
		srcHeaderName.value = t("源名称");
	}
};
const changeDstName = () => {
	isDstIp.value = !isDstIp.value;
	if (isDstIp.value) {
		dstHeaderName.value = t("目的IP");
	} else {
		dstHeaderName.value = t("目的名称");
	}
};
const treeData = ref();
const logSourceTypeOptions = ref();
onMounted(async () => {
	form.createTime = ((currentRoute.value.params.queryTime) as any) ?? undefined;
	getEventList();
	getSearchAggTermApi().then((res) => {
		logSourceTypeOptions.value = res.logSourceType.map((value) => {
			return {
				value: value.key,
				label: value.key
			};
		});
	});
	treeData.value = await getTreeEventTypeOptsApi();
	customPageForm();
});
const customPageForm = () => {
	nextTick(async () => {
		showEventType.value = false;
		eventTypesOptions.value = await getEventTypeLevelApi(eventType);
		const routeParams = currentRoute.value.params;
		if (routeParams.eventType) {
			form.eventTypes = [+routeParams.eventType];
		}
	});
};
const open = ref(false);
const record = ref();
const handleDetail = (record_p) => {
	record.value = record_p;
	open.value = true;
};
</script>
