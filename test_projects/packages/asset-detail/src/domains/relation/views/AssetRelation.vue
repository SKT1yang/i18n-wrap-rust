<!--
 * @Name: 资产详情-资产关系
 * @Description: 整个资产关系统一成一个组件
-->
<template>
  <div class="w-full h-180 bg-[--color-bg-base]" ref="chartRef"></div>
</template>
<script setup lang="ts">
import { ref, type Ref } from 'vue'
import { useECharts } from '@guolisec/utils/echarts';
import { getAssetRelationApi } from '../model';
import { useAssetInfoStore } from '@/entry/store';
import { onMountedOrActivated, getProductImageByAssetTypeCode, _getObjectURLMap, RUN_STATUS_MAP } from '@guolisec/utils'
import dayjs from 'dayjs';

interface SessionNode {
  ip: string;
  name: string;
  symbol: string;
  symbolSize: number;
  x?: number;
  y?: number;
  label: { show: true; color: '#999'; position: 'bottom' };
}

interface SessionLink {
  source: string;
  sourceIp: string;
  target: string;
  targetIp: string;
}

onMountedOrActivated(() => {
  getData()
})

const { asset, relationAsset } = useAssetInfoStore()

const time = ref<[string, string]>([dayjs().startOf('D').toISOString(), dayjs().endOf('D').toISOString()])

const chartRef = ref<HTMLDivElement | null>(null);

async function getData() {
  if (!asset.assetIp) {
    return;
  }
  let sessionNodes: SessionNode[] = [];
  let sessionLinks: SessionLink[] = [];
  let createTime: [string, string] = [dayjs().startOf('D').toISOString(), dayjs().endOf('D').toISOString()]
  try {
    if (time.value.length > 0) {
      createTime = [
        dayjs(time.value[0]).toISOString(),
        dayjs(time.value[1]).toISOString(),
      ];
    }
    const relationAssets = await getAssetRelationApi({
      dstIp: asset.assetIp,
      srcIp: relationAsset.assetIp ? relationAsset.assetIp : asset.assetIp,
      trust: 0,
      createTime: createTime,
    });
    const mainUrl = getProductImageByAssetTypeCode(asset.assetTypeCode, {
      urlType: 'base64',
      color: getRunStatue(asset.runStatus),
      purpose: 'echarts'
    })
    console.log(_getObjectURLMap())
    sessionNodes.push({
      ip: asset.assetIp,
      name: asset.name,
      symbol: mainUrl,
      symbolSize: 150,
      x: 0,
      y: 0,
      label: { show: true, color: '#999', position: 'bottom' },
    });

    if (relationAssets && Array.isArray(relationAssets)) {
      relationAssets.forEach((item) => {
        let nodeName = '';
        if (item.assetName != null) {
          if (item.assetName === item.ip) {
            nodeName = item.ip;
          } else {
            if (item.assetName !== '') {
              if (item.assetTypeCode === 11) {
                nodeName = item.assetName;
              } else {
                nodeName = item.assetName + '\n' + item.ip;
              }
            } else {
              nodeName = item.ip;
            }
          }
        } else if (item.ip != null) {
          nodeName = item.ip;
        }
        const url = getProductImageByAssetTypeCode(item.assetTypeCode, {
          urlType: 'objectUrl',
          color: getRunStatue(item.runStatus),
          purpose: 'echarts'
        })
        sessionNodes.push({
          ip: item.ip,
          name: nodeName,
          symbol: url,
          symbolSize: 100,
          x: 3,
          y: 3,
          label: { show: true, color: '#999', position: 'bottom' },
        });
      });
    }
    sessionNodes.forEach((item) => {
      sessionLinks.push({
        source: sessionNodes[0].name,
        sourceIp: sessionNodes[0].ip,
        target: item.name,
        targetIp: item.ip,
      });
    });
    initChart(sessionNodes, sessionLinks);
  } catch (err) {
    console.warn("@guolisec/asset getData", err)
  }
}

function getRunStatue(runStatus?: 0 | 1 | 2) {
  switch (runStatus) {
    case 0:
      return RUN_STATUS_MAP[0]
    case 1:
      return RUN_STATUS_MAP[1]
    case 2:
      return RUN_STATUS_MAP[2]
    default:
      return RUN_STATUS_MAP[1]
  }
}

const initChart = (sessionNodes, sessionLinks) => {
  if (chartRef.value) {
    const { setOptions } = useECharts(chartRef as Ref<HTMLDivElement>, 'dark');
    setOptions({
      grid: {
        top: '10%',
        left: 0,
      },
      animation: false,
      series: [
        {
          type: 'graph',
          layout: 'force',
          center: [0, 0],
          zoom: 0.05,
          force: {
            initLayout: 'circular',
            repulsion: 100,
            edgeLength: [10, 50],
          },
          data: sessionNodes,
          links: sessionLinks,
          roam: true,
          label: {
            position: 'right',
          },
        },
      ],
    });
  }

};
</script>