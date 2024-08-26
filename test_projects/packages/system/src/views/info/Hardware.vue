<!--
 * @name: 系统硬件信息
 * @description: Do not edit
-->

<template>
  <Row>
    <Col :span="12">
    <div class="font-bold text-base">CPU 信息</div>
    <div class="h-75" ref="cpuChartRef"></div>
    <div class="font-bold text-base">内存信息</div>
    <div class="h-75" ref="memoryChartRef"></div>
    </Col>
    <Col :span="12">
    <div class="font-bold text-base">磁盘信息</div>
    <div class="h-75" ref="dataDiskChartRef"></div>
    <div v-show="isDoubleDisk" class="h-75" ref="sysDiskChartRef"></div>
    </Col>
  </Row>
</template>

<script setup lang="ts">
/* 类型文件 */

/* 第三方模块 */
import { onMounted, ref, h } from 'vue';
import * as echarts from 'echarts'
import { Row, Col, notification } from 'ant-design-vue';
import { useIntervalFn, uuid } from '@guolisec/utils';
import { useECharts } from '@guolisec/utils/echarts'
/* 共享模块 */
import { injectSystemInfoContext } from '../../controller/useContext';
/* 业务模块 */
import { getHardwareInfoApi, diskWarningApi } from '../../model/info'

const hardwareInfo = ref({
  cpuRate: '', // cpu占用率
  memUsedRate: '', // 内存占用率
  memUsedTotal: '', // 内存使用量
  memTotal: '', // 内存总量
  dataDiskUsedRate: '', // 磁盘使用率
  dataDiskUsedTotal: '', // 磁盘使用量
  dataDiskTotal: '', // 磁盘总量
  sysDiskUsedRate: '', // 系统区使用率、磁盘使用率
  sysDiskTotal: '', // 系统区使用量、磁盘使用量
  sysDiskUsedTotal: '', // 系统区总量、磁盘总量

});

const isDoubleDisk = ref(true)
const notifications = ref<string[]>([]) // 告警提醒框

// echart初始化
const cpuChartRef = ref<HTMLDivElement>();
const memoryChartRef = ref<HTMLDivElement>();
const dataDiskChartRef = ref<HTMLDivElement>();
const sysDiskChartRef = ref<HTMLDivElement>();

// 获取实时信息
async function getHardwareInfo() {
  hardwareInfo.value = await getHardwareInfoApi()
  if (hardwareInfo.value.dataDiskUsedRate === hardwareInfo.value.sysDiskUsedRate) {
    isDoubleDisk.value = false;
  }
  initChart()
};

function initChart() {
  initCpuChart()
  initMemoryChart()
  initDataDiskChart()
  initSysDiskChart()
}

/**
 * CPU图表
 */
function initCpuChart() {
  if (cpuChartRef.value) {
    const { setOptions } = useECharts(cpuChartRef.value);
    setOptions(
      {
        series: [
          {
            type: 'gauge',
            radius: '100%',
            axisLine: {
              lineStyle: {
                width: 10,
              },
            },
            detail: {
              formatter: hardwareInfo.value.cpuRate,
              fontSize: 20,
              fontWeight: 600,
            },
            splitLine: {
              length: 10,
            },
            data: [
              {
                value: Number(hardwareInfo.value.cpuRate?.replace('%', '')),
                name: 'cpu占用率',
              },
            ],
            title: {
              show: true,
              offsetCenter: [0, '20%'],
              fontSize: 12,
              fontWeight: 600,
            },
          },
        ],
      },
      false,
    );
  }
}
/**
 * 内存图表
 */
function initMemoryChart() {
  if (memoryChartRef.value) {
    const { setOptions } = useECharts(memoryChartRef.value);
    setOptions(
      {
        series: [
          {
            type: 'gauge',
            radius: '100%',
            detail: {
              formatter:
                '{line1|' +
                hardwareInfo.value.memUsedRate +
                '}\n{line2|' +
                hardwareInfo.value.memUsedTotal +
                '/' +
                hardwareInfo.value.memTotal +
                '}',
              offsetCenter: [0, '50%'],
              rich: {
                line1: {
                  fontSize: 20,
                  fontWeight: 800,
                  color: '#464646',
                },
                line2: {
                  fontSize: 14,
                  lineHeight: 28,
                  color: '#464646',
                },
              },
            },
            axisLine: {
              lineStyle: {
                width: 10,
              },
            },
            splitLine: {
              length: 10,
            },
            data: [
              {
                value: Number(hardwareInfo.value.memUsedRate?.replace('%', '')),
                name: '内存占用率',
              },
            ],
            title: {
              show: true,
              offsetCenter: [0, '20%'],
              fontSize: 12,
              fontWeight: 600,
            },
          },
        ],
      },
      false,
    );
  }
}

/**
 * 数据盘图表
 */
function initDataDiskChart() {
  if (dataDiskChartRef.value) {
    const { setOptions } = useECharts(dataDiskChartRef.value);
    setOptions(
      {
        series: [
          {
            type: 'gauge',
            radius: '100%',
            detail: {
              formatter:
                '{line1|' +
                hardwareInfo.value.dataDiskUsedRate +
                '}\n{line2|' +
                hardwareInfo.value.dataDiskUsedTotal +
                '/' +
                hardwareInfo.value.dataDiskTotal +
                '}',
              offsetCenter: [0, '50%'],
              rich: {
                line1: {
                  fontSize: 20,
                  fontWeight: 800,
                  color: '#464646',
                },
                line2: {
                  fontSize: 14,
                  lineHeight: 28,
                  color: '#464646',
                },
              },
            },
            axisLine: {
              lineStyle: {
                width: 10,
              },
            },
            splitLine: {
              length: 10,
            },
            data: [
              {
                value: Number(hardwareInfo.value.dataDiskUsedRate?.replace('%', '')),
                name: isDoubleDisk.value ? '数据区使用率' : '磁盘使用率',
              },
            ],
            title: {
              show: true,
              offsetCenter: [0, '20%'],
              fontSize: 12,
              fontWeight: 600,
            },
          },
        ],
      },
      false,
    );
  }
}

/**
 * 系统盘图表
 */
function initSysDiskChart() {
  if (sysDiskChartRef.value) {
    const sysDiskChart = echarts.init(sysDiskChartRef.value);
    sysDiskChart.setOption(
      {
        series: [
          {
            type: 'gauge',
            radius: '100%',
            detail: {
              formatter:
                '{line1|' +
                hardwareInfo.value.sysDiskUsedRate +
                '}\n{line2|' +
                hardwareInfo.value.sysDiskUsedTotal +
                '/' +
                hardwareInfo.value.sysDiskTotal +
                '}',
              offsetCenter: [0, '50%'],
              rich: {
                line1: {
                  fontSize: 20,
                  fontWeight: 800,
                  color: '#464646',
                },
                line2: {
                  fontSize: 14,
                  lineHeight: 28,
                  color: '#464646',
                },
              },
            },
            axisLine: {
              lineStyle: {
                width: 10,
              },
            },
            splitLine: {
              length: 10,
            },
            data: [
              {
                value: Number(hardwareInfo.value.sysDiskUsedRate?.replace('%', '')),
                name: '系统区使用率',
              },
            ],
            title: {
              show: true,
              offsetCenter: [0, '20%'],
              fontSize: 12,
              fontWeight: 600,
            },
          },
        ],
      },
      false,
    );
  }
}

async function diskWarning() {
  notifications.value.forEach((item) => {
    // 使用唯一key关闭notification
    notification.close(item);
  });
  const res = await diskWarningApi()
  res.forEach((item) => {
    let key = uuid(); // 唯一key
    notification.warning({
      message: '告警提示',
      description: getMessageVNode(item.message),
      duration: 0,
      placement: 'bottomRight',
      key: key,
    });
    // 保存唯一key用于关闭
    notifications.value.push(key);
  });
}

function getMessageVNode(message) {
  const msgList = message.split('\n').filter((i) => Boolean(i));
  const vNodes: any = [];
  for (let index = 0; index < msgList.length; index++) {
    const msg = msgList[index];
    vNodes.push(h('div', msg));
  }
  return () => h('div', vNodes);
}

onMounted(() => {
  notification.destroy()
  useIntervalFn(() => {
    getHardwareInfo();
  }, 5000, {
    immediateCallback: true
  })

  // 磁盘告警
  const { warning = true } = injectSystemInfoContext()
  warning && useIntervalFn(() => {
    diskWarning();
  }, 60000, {
    immediateCallback: true
  })
});
</script>
