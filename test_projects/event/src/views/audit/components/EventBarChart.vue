<template>
  <div style="width: 100%; height: 100%">
    <div v-show="chartData.length > 0" class="eventNameChart" ref="chartRef"> </div>
    <empty v-show="chartData.length === 0" :image="simpleImage" class="emptyStyle"></empty>
  </div>
</template>
<script setup name="EventNameChart" lang="ts">
import { t } from "..\\..\\..\\languages\\index";
import { nextTick, ref, onMounted } from "vue";
import { Empty } from "ant-design-vue";
import * as echarts from "echarts";
import { getCountUntreatedEventByEventNameReportApi } from "../../../model/event";
onMounted(() => {
	mychart.value = echarts.init(chartRef.value!);
});
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
	}
});
const chartRef = ref<HTMLDivElement | null>(null);
const mychart = ref();
const simpleImage = Empty.PRESENTED_IMAGE_SIMPLE;
let chartData = ref<{
	eventName: string;
	count: number;
}[]>([]);
const getData = () => {
	getCountUntreatedEventByEventNameReport();
};
const getCountUntreatedEventByEventNameReport = () => {
	getCountUntreatedEventByEventNameReportApi({
		start: props.start,
		end: props.end,
		treat: props.treat
	}).then((res) => {
		chartData.value = res;
		nextTick(() => {
			if (chartData.value.length > 0) {
				initChart();
			}
		});
	});
};
const initChart = () => {
	let yAxisData: string[] = [];
	let seriesData: any[] = [];
	chartData.value.forEach((item) => {
		yAxisData.push(item.eventName);
		seriesData.push(item.count);
	});
	let start = 0;
	if (yAxisData.length > 10) {
		start = 100 - Math.round(9 / yAxisData.length * 100);
	}
	mychart.value.setOption({
		tooltip: {
			trigger: "item",
			formatter: function(params) {
				return params.marker + params.name + "<span style='font-weight: bolder;margin-left: 8px;'>" + params.value + "</span>";
			}
		},
		grid: {
			left: "25%",
			right: "10%",
			bottom: "10%",
			top: "5%"
		},
		dataZoom: [{
			type: "slider",
			show: yAxisData.length > 10,
			yAxisIndex: 0,
			zoomLock: true,
			width: 5,
			right: 10,
			top: 15,
			bottom: 30,
			start,
			end: 100,
			handleSize: 0,
			showDetail: false,
			showDataShadow: false
		}, {
			type: "inside",
			id: "insideY",
			yAxisIndex: 0,
			start,
			end: 100,
			zoomOnMouseWheel: false,
			moveOnMouseMove: true,
			moveOnMouseWheel: true
		},],
		xAxis: {
			type: "value",
			minInterval: 1,
			axisLabel: {
				color: "#e1ebf4",
				fontSize: 11,
				interval: 0
			},
			axisLine: {
				show: true,
				lineStyle: { color: "#172031" }
			},
			splitLine: { show: false }
		},
		yAxis: {
			type: "category",
			axisLabel: {
				color: "#e1ebf4",
				fontSize: 11,
				formatter: function(value) {
					let len = 0;
					for (let i in value) {
						if (value.charCodeAt(i) > 127 || value.charCodeAt(i) == 94) {
							len += 2;
						} else {
							len++;
						}
						if (len >= 24) {
							return value.substring(0, i) + "...";
						}
					}
					return value;
				}
			},
			axisLine: {
				show: true,
				lineStyle: { color: "#172031" }
			},
			splitLine: { show: false },
			data: yAxisData.reverse()
		},
		series: [{
			name: t("数量"),
			type: "bar",
			barWidth: 10,
			itemStyle: {
				borderRadius: 5,
				color: new echarts.graphic.LinearGradient(1, 0, 0, 0, [{
					offset: 0,
					color: "rgba(98, 198, 255, 1)"
				}, {
					offset: 1,
					color: "rgba(98, 198, 255, 0.1)"
				},])
			},
			label: {
				show: true,
				color: "#e1ebf4",
				position: "right"
			},
			data: seriesData.reverse()
		},]
	}, false);
};
defineExpose({ getData });
</script>
<style scoped>
.eventNameChart {
  width: 100%;
  height: 100%;
}

.emptyStyle {
  margin: 0px;
  padding-top: 10%;
}
</style>
