<template>
  <div>
    <form :model="form" class="m-b-24px" :labelcol="{ span: 4 }">
      <row :justify="'space-between'">
        
        <formitem :label="t('时间段')">
          <rangepicker show-time v-model:value="form.createTime" format="YYYY-MM-DD HH:mm:ss"></rangepicker>
        </formitem>
        
        
        <formitem :label="t('模式')">
          <select allowclear :placeholder="t('请选择模式')" :options="options.modes" v-model:value="form.statusType"></select>
        </formitem>
        
        
        <formitem :label="t('事件名称')">
          <select showsearch :placeholder="t('请选择事件名称')" :filteroption="(input, option) => {
            return option!.label.toLowerCase().indexOf(input.toLowerCase()) >= 0;
          }" allowclear :options="options.eventsName" v-model:value="form.name"></select>
        </formitem>
        
      </row>
      <row :justify="'space-between'">
        
        <formitem :label="t('威胁等级')">
          <select :placeholder="t('请选择威胁等级')" allowclear :options="options.threatLavel" v-model:value="form.score"></select>
        </formitem>
        
        
        <formitem :label="t('处置情况')">
          <select :placeholder="t('请选择处置情况')" allowclear :options="(options.handle as any)" v-model:value="form.treat"></select>
        </formitem>
        
        
        <formitem :label="t('攻击源')">
          <input :placeholder="t('请输入攻击源')" v-model:value="form.srcIp">
        </formitem>
        
      </row>
      <row :justify="'space-between'">
        
        <formitem :label="t('日志源类型')">
          <select :placeholder="t('请选择日志源类型')" allowclear :options="(options.logSourceTypes as any)" v-model:value="form.logSourceTypeName"></select>
        </formitem>
        
        
        <formitem :label="t('日志源名称')">
          <select :placeholder="t('请选择日志源名称')" allowclear :options="(options.logSourceNames as any)" v-model:value="form.logSourceName"></select>
        </formitem>
        
        
        <button class="float-right" type="primary" @click="handleSearch()">{{ t("查询") }}</button>
        
      </row>
    </form>
    <tabs v-model:activekey="activeKey" type="card" @change="handleTabChange">
      <tabpane :key="1004" :tab="t('全部')"></tabpane>
      <tabpane v-for="eventType in eventTypeList" :key="eventType.id" :tab="eventType.name"></tabpane>
    </tabs>
    <table :data-source="dataSource" :columns="columns.slice(1)" @change="handleTableChange" :pagination=""></table>
  </div>
</template>
<script name="AttackEvent" lang="tsx" setup>
import { t } from "..\\..\\..\\languages\\index";
import { Table, RangePicker, FormItem, Select, Input, Row, Col, Form, Button, Tabs } from "ant-design-vue";
import { columns } from "../components/event.data";
import { getIcsTabApi, getShowUntreatedEventListApi } from "../../../model/threat";
import { onMounted, reactive, ref } from "vue";
import { getEventNameApi, getIcsEventNameApi, getIcsLogSourceTypeName, getLogSourceNameApi, getLogSourceTypeNameApi } from "../../../model/threat";
import dayjs from "dayjs";
import { getOptions } from "../../../utils/tag";
import { getEventTypeLevelApi } from "../../../model/event";
let eventTypeIn = ref<any[]>([]);
const options = reactive({
	modes: [{
		label: t("审计"),
		value: 0
	}, {
		label: t("告警"),
		value: 1
	}, {
		label: t("阻断"),
		value: 2
	}, {
		label: t("拒绝"),
		value: 3
	}, {
		label: t("恢复"),
		value: 4
	},],
	eventsName: [],
	threatLavel: [],
	handle: [{
		label: t("已处置"),
		value: true
	}, {
		label: t("未处置"),
		value: false
	}],
	logSourceTypes: [],
	logSourceNames: []
});
const form = reactive<{
	createTime: any;
	statusType?: number;
	name: any;
	score: any;
	treat: any;
	srcIp: any;
	logSourceTypeName: any;
	logSourceName: any;
}>({
	createTime: [dayjs().startOf("D"), dayjs().endOf("D")],
	statusType: undefined,
	name: undefined,
	score: undefined,
	treat: undefined,
	srcIp: undefined,
	logSourceTypeName: undefined,
	logSourceName: undefined
});
function handleSearch() {
	page.value = 1;
	getDataSource();
}
const TabPane = Tabs.TabPane;
let eventTypeList = ref<any[]>([]);
const activeKey = ref(1004);
async function getEventTypeLevel() {
	eventTypeList.value = await getEventTypeLevelApi(1004);
	eventTypeIn.value = [];
	eventTypeList.value.forEach((item: any) => {
		eventTypeIn.value.push(item.id);
	});
	getDataSource();
}
function handleTabChange() {
	getDataSource();
}
const dataSource = ref([]);
let page = ref(1);
let size = ref(10);
let total = ref(0);
let sort = ref("createTime,desc");
onMounted(() => {
	options.threatLavel = ((getOptions("score")) as any);
	getEventNameApi({ eventType: 1004 }).then((res) => {
		options.eventsName = res.map((val) => {
			return {
				label: val,
				value: val
			};
		});
	});
	getLogSourceTypeNameApi({ eventType: 1004 }).then((res) => {
		options.logSourceTypes = res.map((val) => {
			return {
				label: val,
				value: val
			};
		});
	});
	getLogSourceNameApi({ eventType: 1004 }).then((res) => {
		options.logSourceNames = res.map((val) => {
			return {
				label: val,
				value: val
			};
		});
	});
	const historyParams = history.state;
	if (historyParams.createTime) {
		form.createTime = historyParams.createTime;
	}
	if (historyParams.name) {
		form.name = historyParams.name;
	}
	if (historyParams.srcIp) {
		form.srcIp = historyParams.srcIp;
	}
	if (historyParams.statusType) {
		form.statusType = Number(historyParams.statusType);
	}
	if (["true", "false"].includes(((historyParams.treat) as string))) {
		form.treat = historyParams.treat === "true";
	}
	const params = history.state;
	if (params.createTime) {
		form.createTime = params.createTime;
	}
	if (["true", "false"].includes(((params.treat) as string))) {
		form.treat = params.treat === "true";
	}
	if (params.statusType) {
		form.statusType = Number(params.statusType);
	}
	if (params.activeKey) {
		activeKey.value = Number(params.activeKey);
	}
	getEventTypeLevel();
});
async function getDataSource() {
	let form_copy = JSON.parse(JSON.stringify(form));
	if (!form_copy.createTime) {
		form_copy.createTime = [];
	}
	if (activeKey.value === 1004) {
		form_copy.eventTypeIn = eventTypeIn.value;
	} else {
		form_copy.eventType = activeKey.value;
	}
	const res = await getShowUntreatedEventListApi({
		page: page.value,
		size: size.value,
		sort: sort.value,
		...form_copy
	});
	dataSource.value = res.content;
	total.value = res.totalElements;
}
function handleTableChange(e, _filters, sorter) {
	sort.value = `${sorter.field ?? "count"},${(sorter.order ?? "descend").split("end")[0]}`;
	page.value = e.current;
	size.value = e.pageSize;
	getDataSource();
}
</script>
