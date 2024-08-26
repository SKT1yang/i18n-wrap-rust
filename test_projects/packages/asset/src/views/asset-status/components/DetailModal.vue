<!--
 * @name: Do not edit
 * @description: Do not edit
 * @date: 2024-01-23 13:44:45
 * @path: \feature-vue\platform\front\asset\src\views\asset-status\components\DetailModal.vue
-->
<template>
  <div>
    <Row>
      <Col :span="8">
      <div class="flex justify-center flex-col items-center">
        <Device class="text-8xl" :asset-type-code="parentProps.detailRecord?.assetTypeCode"
          :run-status="parentProps.detailRecord?.runStatus"></Device>
        <div>{{ parentProps.detailRecord?.name }}</div>
        <div class="m-2">
          运行状态：
          <Tag :color="statusColorTable[parentProps.detailRecord?.runStatus]">{{
            statusTable[parentProps.detailRecord?.runStatus] || '未知'
          }}</Tag>
        </div>
      </div>
      </Col>
      <Col :span="8">
      <div class="m-l-4">
        <Descriptions :column="1" :labelStyle="{ width: '80px' }">
          <DescriptionsItem label="资产名称">{{ parentProps.detailRecord?.name || '暂无' }}</DescriptionsItem>
          <DescriptionsItem label="运行状态">
            <Tag :color="statusColorTable[parentProps.detailRecord?.runStatus]">{{
              statusTable[parentProps.detailRecord?.runStatus] || '未知'
            }}</Tag>
          </DescriptionsItem>
          <DescriptionsItem label="资产系列">{{ parentProps.detailRecord?.assetSeriesNameLong || '-' }}
          </DescriptionsItem>
          <DescriptionsItem v-if="!hiddenFeatures.includes('asset-safe-field')" label="安全域">
            {{
              parentProps.detailRecord?.assetField?.name || '暂无'
            }}
          </DescriptionsItem>
          <DescriptionsItem label="资产品牌">
            <span class="truncate" :title="parentProps.detailRecord?.trademarkName || '暂无'">
              {{ parentProps.detailRecord?.trademarkName || "暂无" }}
            </span>
          </DescriptionsItem>
          <DescriptionsItem label="重要程度">{{ importanceTable[parentProps.detailRecord?.importance] || '未知' }}
          </DescriptionsItem>
          <DescriptionsItem label="入网时间">{{
            parentProps.detailRecord?.createTime ?
            formatToDateTime(parentProps.detailRecord?.createTime) : '-'
          }}
          </DescriptionsItem>
        </Descriptions>
      </div>
      </Col>
      <Col :span="8">
      <div class="m-l-4">
        <Descriptions :column="1" :labelStyle="{ width: '70px', flex: 'none', }"
          :contentStyle="{ width: '100%', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }">
          <DescriptionsItem label="IP地址">{{ parentProps.detailRecord?.assetIp || '暂无' }}</DescriptionsItem>
          <DescriptionsItem label="Mac地址">{{ parentProps.detailRecord?.assetMac || '暂无' }}
          </DescriptionsItem>
          <DescriptionsItem label="固件版本" v-if="[1, 2, 17, 30].includes(parentProps.detailRecord?.assetTypeCode)"><span>
            </span>{{
              parentProps.detailRecord?.firmwareVersion
              || '暂无'
            }}</DescriptionsItem>
          <DescriptionsItem label="资产组"><span> </span>{{ parentProps.detailRecord.assetGroupLongName || '-' }}
          </DescriptionsItem>
          <DescriptionsItem label="资产类型">{{ parentProps.detailRecord?.assetTypeName || '-' }}</DescriptionsItem>
          <DescriptionsItem label="操作系统" v-if="[3, 25].includes(parentProps.detailRecord?.assetTypeCode)">{{
            parentProps.detailRecord?.os || '暂无'
          }}
          </DescriptionsItem>
          <DescriptionsItem label="软件版本" v-if="![1, 2, 17, 30, 3, 25].includes(parentProps.detailRecord?.assetTypeCode)">
            <span class="truncate" :title="parentProps.detailRecord?.softwareVersion || '暂无'"> {{
              parentProps.detailRecord?.softwareVersion || '暂无'
            }}</span>
          </DescriptionsItem>
          <DescriptionsItem label="所处位置">
            <span class="truncate" :title="parentProps.detailRecord?.assetLocation || '暂无'">
              {{ parentProps.detailRecord?.assetLocation || '暂无' }}
            </span>
          </DescriptionsItem>
        </Descriptions>
      </div>
      </Col>
    </Row>
  </div>
</template>

<script lang='ts' setup>
import { computed } from 'vue'
import { Col, Row, Tag, Descriptions, DescriptionsItem } from 'ant-design-vue'
import { formatToDateTime } from "@guolisec/utils"
import { Device } from '@guolisec/graph';
import { provideAssetStatusContext } from '../context/useStatusContext';

defineOptions({ name: 'AssetsStatusPageModal', inheritADescriptionsescriptionsItems: false })
const statusTable = ["离线", "在线", "闲置"]
const statusColorTable = ["red", "green", ""]
const importanceTable = ["普通", "重要"]
const parentProps = defineProps<{ detailRecord: any, hiddenFeatures: any }>()

// 合并props和context的隐藏配置项
const hiddenFeatures = computed(() => {
  return parentProps.hiddenFeatures
})

provideAssetStatusContext({
  hiddenFeatures: parentProps.hiddenFeatures,
})
</script>

<style></style>