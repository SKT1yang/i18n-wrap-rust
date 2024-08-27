<template>
  <div style="width: 100%; height: 100%">
    <div v-show="chartData.length > 0" class="eventLevelChart" ref="chartRef"> </div>
    <empty v-show="chartData.length === 0" :image="simpleImage" class="emptyStyle"></empty>
  </div>
</template>
<script setup name="EventLevelChart" lang="ts">
import { t } from "..\\..\\..\\languages\\index";
import { nextTick, ref, watchEffect, onMounted } from "vue";
import { Empty } from "ant-design-vue";
import * as echarts from "echarts";
import { getCountUntreatedEventByEventLevelReportApi } from "../../../model/event";
const props = defineProps({
	start: {
		type: String,
		default() {
			return "";
		}
	},
	end: {
		type: String,
		default() {
			return "";
		}
	},
	treat: {
		type: Boolean,
		default() {
			return false;
		}
	},
	api: {
		type: Function,
		default() {
			return () => {};
		}
	}
});
const chartRef = ref<HTMLDivElement | null>(null);
const mychart = ref();
onMounted(() => {
	mychart.value = echarts.init(chartRef.value!);
});
const simpleImage = Empty.PRESENTED_IMAGE_SIMPLE;
let chartData = ref<{
	eventLevel: number;
	count: number;
}[]>([]);
const getData = () => {
	getCountUntreatedEventByEventLevelReport();
	props.api();
};
const getCountUntreatedEventByEventLevelReport = () => {
	getCountUntreatedEventByEventLevelReportApi({
		start: props.start,
		end: props.end,
		treat: props.treat
	}).then((res) => {
		const arr = res.sort((a, b) => {
			return b.eventLevel - a.eventLevel;
		});
		chartData.value = arr;
		nextTick(() => {
			if (chartData.value.length > 0) {
				initChart();
			}
		});
	});
};
const initChart = () => {
	let data: any[] = [];
	chartData.value.forEach((item) => {
		const arr = [t("高风险"), t("中风险"), t("低风险"), t("信息")];
		data.push({
			name: arr[Number(item.eventLevel) - 1],
			value: item.count
		});
	});
	mychart.value.setOption({
		color: ["#85ffdb", "#ffe38c", "#ffbc8c", "#ff938c"],
		tooltip: {
			trigger: "item",
			formatter: function(params) {
				return params.marker + params.name + "<span style='font-weight: bolder;margin-left: 8px;'>" + params.value + t("个") + "</span>";
			}
		},
		legend: {
			top: "5%",
			left: "center"
		},
		series: [{
			name: t("数量"),
			type: "pie",
			radius: ["40%", "70%"],
			avoidLabelOverlap: false,
			minAngle: 10,
			itemStyle: {
				borderRadius: 10,
				borderColor: "#151515",
				borderWidth: 2
			},
			label: {
				show: false,
				position: "center"
			},
			labelLine: { show: false },
			data
		},]
	}, false);
};
defineExpose({});
watchEffect(() => {
	getData();
});
</script>
<style scoped>
.eventLevelChart {
  width: 100%;
  height: 100%;
}

.emptyStyle {
  margin: 0px;
  padding-top: 10%;
}
</style>
