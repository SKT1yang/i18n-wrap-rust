
<!--
 * @Name: 资产关系 -- echarts图
 * @Description: Do not edit
 * @Author: ygd
-->
<template>
  <div style="overflow: auto">
    <div class="relationshipChart" ref="relationchartsRef" :style="{
      height: Number(documentClientHeight) - 180 + 'px',
      margin: '10px',
    }"></div>
  </div>
</template>

<script setup name="relationChart" lang="ts">
/* 类型文件 */
import type { Ref } from 'vue'
import type { RelationInfo } from './types';
/* 第三方模块 */
import dayjs from 'dayjs';
import { ref, reactive, inject, watch } from 'vue'
import { useECharts } from '@guolisec/utils/echarts';
import {
  useColorSchemeMode,
} from "@guolisec/utils";
import {
  getProductImageByAssetTypeCode,
} from "@guolisec/graph";
import { useRouter } from '@guolisec/routerable';
/* 本地模块 */
import { getAssetRelationApi } from '@/model/relation'
import { relationInfoKey } from './sysmbols';

const { colorSchemeMode } = useColorSchemeMode();

const relationchartsRef = ref<HTMLDivElement>() as unknown as Ref<HTMLDivElement>;
const { getInstance, resize, setOptions } = useECharts(
  relationchartsRef,
);

const state = reactive<any>({
  relationChart: null,
});

const tempNodes = ref()

const viewInfo = reactive<any>({
  firstLevelCount: 0, // 第一层的总数量
  secondLevelCount: 0, // 第二层的总数量
  lineSize: 0, // 一行的个数
  rowSize: 0, // 一层一共有多少行
  graphFontSize: 12, // 字体大小
  iconSize: 20, //图标大小
  nodeData: null, // 节点数据
  links: null, // 连线数据
  deviceInfoDialogVisible: false, // 设备信息框
});

const relationInfo = inject(
  relationInfoKey,
  reactive<RelationInfo>({
    dialogIp: '',
    dialogDate: dayjs(),
    dialogType: '',
    relationshipChartWidth: (`${document.documentElement.clientWidth}` as unknown as number) - 36,
    isIcp: '0',
  }),
);
const documentElement = `${document.documentElement.clientHeight}`;
let documentClientHeight = ref(documentElement);

watch([() => relationInfo.dialogDate, () => relationInfo.isIcp, colorSchemeMode], async () => {
  await getData();
});

const assetId = ref()
const time = ref<string[]>([])


// 获取数据
async function getData() {
  const data = await getAssetRelationApi({
    createTime: [
      dayjs(dayjs(relationInfo.dialogDate).format('YYYY-MM-DD 00:00:00')).toJSON(),
      dayjs(dayjs(relationInfo.dialogDate).format('YYYY-MM-DD 23:59:59')).toJSON(),
    ],
    isIcp: relationInfo.isIcp,
  });
  processData(data);
}

// 处理数据
const processData = (data) => {
  viewInfo.firstLevelCount = 0;
  viewInfo.secondLevelCount = 0;

  data.nodes.forEach((item) => {
    if ([3, 10, 13, 24].includes(item.assetTypeCode)) {
      viewInfo.firstLevelCount++;
    }
    if ([1, 2, 8, 16, 17].includes(item.assetTypeCode)) {
      viewInfo.secondLevelCount++;
    }
  });

  // 确定一行的个数和每一层有几行
  if (viewInfo.firstLevelCount > 100 || viewInfo.secondLevelCount > 100) {
    viewInfo.lineSize = 10;
    if (viewInfo.firstLevelCount > 100 && viewInfo.secondLevelCount > 100) {
      const maxCount =
        viewInfo.firstLevelCount > viewInfo.secondLevelCount
          ? viewInfo.firstLevelCount
          : viewInfo.secondLevelCount;
      viewInfo.rowSize = Math.floor(maxCount / viewInfo.lineSize);
    } else {
      if (viewInfo.firstLevelCount > 100) {
        viewInfo.rowSize = Math.floor(viewInfo.firstLevelCount / viewInfo.lineSize);
      }
      if (viewInfo.secondLevelCount > 100) {
        viewInfo.rowSize = Math.floor(viewInfo.secondLevelCount / viewInfo.lineSize);
      }
    }
  } else {
    viewInfo.rowSize = 10;
  }

  if (viewInfo.rowSize < 10) {
    viewInfo.rowSize = 10;
    viewInfo.iconSize = 40;
  } else {
    viewInfo.iconSize = 35;
  }

  // 确定canvas的高度
  if (viewInfo.rowSize > 10) {
    relationInfo.relationshipChartWidth = viewInfo.rowSize * 140;
  } else {
    relationInfo.relationshipChartWidth =
      (`${document.documentElement.clientWidth}` as unknown as number) - 36;
  }

  // 给连线加上标签
  if (data.links) {
    data.links.forEach((item) => {
      item.label = {
        show: true,
        fontSize: viewInfo.graphFontSize,
        formatter: function () {
          let contentHtml = '';
          if (item.totalTraffic == null) {
            item.totalTraffic = '';
          }
          if (item.protocol == null) {
            item.protocol = '';
          }
          contentHtml = item.totalTraffic + '\n' + item.protocol;
          return contentHtml;
        },
      };
    });
  }

  let xFirstIndex = 0; // 第一层现有数量 - 1
  let xSecondIndex = 0; // 第二层现有数量 - 1

  let first_qNum = 0; // 第一层的奇数行在奇数位置上的节点数量
  let first_oNum = 0; // 第一层的奇数行在偶数位置上的节点数量

  let first_qNum2 = 0; // 第一层的偶数行在奇数位置上的节点数量
  let first_oNum2 = 0; // 第一层的偶数行在偶数位置上的节点数量

  let qNum = 0; // 第二层的奇数行在奇数位置上的节点数量
  let oNum = 0; // 第二层的奇数行在偶数位置上的节点数量

  let qNum2 = 0; // 第二层的偶数行在奇数位置上的节点数量
  let oNum2 = 0; // 第二层的偶数行在偶数位置上的节点数量

  data.nodes.forEach((item) => {
    item.symbolSize = viewInfo.iconSize;
    let status: 'red' | 'normal' | 'yellow' = item.trust === 0 ? 'red' : 'normal';
    item.symbol = getProductImageByAssetTypeCode(item.assetTypeCode, {
      type: 'png',
      status,
      purpose: 'echarts'
    });

    // 3.主机、10.工控安全审计系统、13.工业安全隔离与信息交换系统、24.工业管理平台   放在第一层
    if (
      item.assetTypeCode == 3 ||
      item.assetTypeCode == 10 ||
      item.assetTypeCode == 13 ||
      item.assetTypeCode == 24
    ) {
      if (Math.floor(xFirstIndex / viewInfo.rowSize) % 2 != 0) {
        //奇数行

        // 如果一行已经满了
        if (first_qNum + first_oNum == viewInfo.rowSize) {
          first_qNum = 0;
          first_oNum = 0;
        }

        //  设置节点的位置
        if ((xFirstIndex % viewInfo.rowSize) % 2) {
          // 奇数位置上的节点
          first_qNum++;
          item.x = 500 - ((first_qNum - 0.5) * 1000) / viewInfo.rowSize;
        } else {
          // 偶数位置上的节点
          first_oNum++;
          item.x = 500 + ((first_oNum - 0.5) * 1000) / viewInfo.rowSize;
        }
      } else {
        //偶数行

        if (first_qNum2 + first_oNum2 == viewInfo.rowSize) {
          first_qNum2 = 0;
          first_oNum2 = 0;
        }
        if ((xFirstIndex % viewInfo.rowSize) % 2) {
          first_qNum2++;
          item.x = 500 - (first_qNum2 * 1000) / viewInfo.rowSize;
        } else {
          item.x = 500 + (first_oNum2 * 1000) / viewInfo.rowSize;
          first_oNum2++;
        }
      }
      item.y = 1000 - Math.floor(xFirstIndex / viewInfo.rowSize) * (viewInfo.iconSize * 1.5);
      xFirstIndex++;
    } else if (item.assetTypeCode == 99) {
      //互联网
      item.x = 1000;
      item.y = 575;
    } else {
      if (Math.floor(xSecondIndex / viewInfo.rowSize) % 2 != 0) {
        //奇数行
        if (qNum + oNum == viewInfo.rowSize) {
          qNum = 0;
          oNum = 0;
        }
        if ((xSecondIndex % viewInfo.rowSize) % 2) {
          qNum++;
          item.x = 500 - ((qNum - 0.5) * 1000) / viewInfo.rowSize;
        } else {
          oNum++;
          item.x = 500 + ((oNum - 0.5) * 1000) / viewInfo.rowSize;
        }
      } else {
        //偶数行
        if (qNum2 + oNum2 == viewInfo.rowSize) {
          qNum2 = 0;
          oNum2 = 0;
        }
        if ((xSecondIndex % viewInfo.rowSize) % 2) {
          qNum2++;
          item.x = 500 - (qNum2 * 1000) / viewInfo.rowSize;
        } else {
          item.x = 500 + (oNum2 * 1000) / viewInfo.rowSize;
          oNum2++;
        }
      }
      item.y = Math.floor(xSecondIndex / viewInfo.rowSize) * (viewInfo.iconSize * 1.5);
      xSecondIndex++;
    }
    item.value = [item.x, item.y];
  });

  viewInfo.nodeData = data.nodes;
  viewInfo.links = data.links;
  // nextTick(() => {
  // console.log('data.nodes', data.nodes)
  initChart(data.nodes, data.links);
  // })
};
const initChart = (nodes, links) => {
  // console.log('initChart.nodes', nodes)
  tempNodes.value = nodes
  setOptions({
    grid: {
      top: 50,
      left: 50,
      right: 50,
      bottom: 60,
    },
    xAxis: {
      min: 0,
      max: 1000,
      show: false,
      type: 'value',
    },
    yAxis: {
      min: 0,
      max: 1000,
      show: false,
      type: 'value',
    },
    series: [
      {
        layout: 'none',
        type: 'graph',
        coordinateSystem: 'cartesian2d',
        focusNodeAdjacency: true,
        label: {
          show: true,
          position: 'bottom',
          color: colorSchemeMode.value === 'dark' ? '#ccc' : '#000',
          fontSize: viewInfo.graphFontSize,
        },
        lineStyle: {
          curveness: 0,
        },
        data: nodes,
        links: links,
      },
    ],
  });
  state.relationChart = getInstance();
  resize();


  state.relationChart.on('click', function (params) {
    relationInfo.dialogType = params.dataType;
    console.log(params.data)
    if (params.dataType === 'node') {
      if (params.data.assetIp === '0.0.0.0') {
        return;
      } else {
        relationInfo.dialogType = 'node';
        relationInfo.dialogIp = params.data.assetIp;
        assetId.value = params.data.id
        time.value = [
          dayjs(relationInfo.dialogDate).format('YYYY-MM-DD 00:00:00'),
          dayjs(relationInfo.dialogDate).format('YYYY-MM-DD 23:59:59'),
        ]
        handleView(assetId.value)
      }
    }
  });
};

/**
 * 查看资产详情
 */
async function handleView(record) {
  const router = useRouter()
  router.push({
    name: 'AssetDetail',
    state: {
      id: record.id
    }
  })
}

defineExpose({
  getData,
});
</script>
