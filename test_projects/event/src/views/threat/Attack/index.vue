<template>
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
      
      
      <button class="float-right" type="primary" @click="() => { tableData.current = 1; getShowUntreatedEventList() }">{{ t("查询") }}</button>
      
    </row>
  </form>
  <table bordered rowkey="id" :datasource="tableData.list" :pagination="pagin" @change="handleChange" :columns="columns">
  </table>
</template>
<script name="AttackEvent" lang="tsx" setup>
import { t } from "..\\..\\..\\languages\\index";
import { Table, RangePicker, FormItem, Select, Input, Row, Col, Form, Button } from "ant-design-vue";
import { getShowUntreatedEventListApi } from "../../../model/threat";
import { columns } from "../components/event.data";
import { onMounted, reactive } from "vue";
import { getPagin } from "../../../utils/getPagin";
import { getEventNameApi, getLogSourceNameApi, getLogSourceTypeNameApi } from "../../../model/threat";
import { getOptions } from "../../../utils/tag";
import dayjs from "dayjs";
const { tableData, pagin } = getPagin();
tableData.sort = "createTime,desc";
const handleChange = (e, _filter, sorter) => {
	tableData.current = e.current;
	tableData.pageSize = e.pageSize;
	tableData.sort = sorter.order ? sorter.field + "," + ((sorter.order) as string).match(/(.*)end/)![1] : undefined;
	getShowUntreatedEventList();
};
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
onMounted(async () => {
	options.threatLavel = ((getOptions("score")) as any);
	getEventNameApi({ eventType: 1002 }).then((res) => {
		options.eventsName = res.map((val) => {
			return {
				label: val,
				value: val
			};
		});
		console.log(options.eventsName);
	});
	getLogSourceTypeNameApi({ eventType: 1002 }).then((res) => {
		options.logSourceTypes = res.map((val) => {
			return {
				label: val,
				value: val
			};
		});
	});
	getLogSourceNameApi({ eventType: 1002 }).then((res) => {
		options.logSourceNames = res.map((val) => {
			return {
				label: val,
				value: val
			};
		});
	});
	const params = history.state;
	if (params.createTime) {
		form.createTime = params.createTime;
	}
	if (params.name) {
		form.name = params.name;
	}
	if (params.srcIp) {
		form.srcIp = params.srcIp;
	}
	if (params.statusType) {
		form.statusType = Number(params.statusType);
	}
	if (["true", "false"].includes(((params.treat) as string))) {
		form.treat = params.treat === "true";
	}
	getShowUntreatedEventList();
});
function getShowUntreatedEventList() {
	if (!form.createTime) {
		form.createTime = [];
	}
	getShowUntreatedEventListApi({
		page: tableData.current,
		size: tableData.pageSize,
		eventType: 1002,
		sort: tableData.sort,
		...form,
		createTime: form.createTime.map((v) => v.toISOString())
	}).then((res) => {
		let showIndex = 1 + (tableData.current - 1) * tableData.pageSize;
		tableData.list = res.content.map((res) => {
			return {
				...res,
				showIndex: showIndex++
			};
		});
		tableData.total = res.totalElements;
	});
}
</script>
<style scoped>
:deep(.ant-form-item) {
  margin-bottom: 5px !important;
}
</style>
