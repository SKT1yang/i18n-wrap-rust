<!--
 * @Name: 开放服务/端口
 * @Description: Do not edit
-->
<template>
  <Card :title="t('开放端口/服务')">

    <template #rightExtra>
      <div class="flex items-center leading-[22px] space-x-2">
        <span class="w-[16px] h-[16px] inline-block bg-$color-error rounded ">
        </span>
        <span class="text-$color-text-tertiary">
          {{ t("高危") }}
        </span>
        <span class="w-[16px] h-[16px] inline-block bg-$color-primary rounded">
        </span>
        <span class="text-$color-text-tertiary">
          {{ t("正常") }}
        </span>
      </div>

    </template>

    <div class="asset-service w-full h-full overflow-auto max-h-[266px] space-y-2">

      <template v-if="highRiskList.length + openList.length > 0">
        <div class="space-y-2">
          <Tag v-for="(service, index) in highRiskList" :key="index" color="red">
            {{ service.port }}/{{ service.server }}
          </Tag>
        </div>

        <Tag v-for="(service, index) in openList" :key="index" color="blue">
          {{ service.port }}/{{ service.server }}
        </Tag>
      </template>

      <Empty v-else />

    </div>
  </Card>
</template>

<script name="AssetService" lang="ts" setup>
import { ref } from 'vue'
import { Tag, Empty } from 'ant-design-vue';
import { getAssetServiceListApi } from '../model/port';
import { onMountedOrActivated } from '@guolisec/utils'
import { useAssetInfoStore } from '@/entry/store/index';
import { OpenPortAndService } from "../types/port";
import { t } from "@/entry/languages/useLanguage";
import Card from '@/shared/components/Card.vue';

const { asset } = useAssetInfoStore()


const props = defineProps<{
  serviceList?: any;
}>();

const highRiskList = ref<OpenPortAndService[]>([])
const openList = ref<OpenPortAndService[]>([])

async function getData() {
  if (props.serviceList) {
    // const dataList = props.serviceList;
  } else {
    if (asset.assetIp) {
      highRiskList.value = []
      openList.value = []
      const res = await getAssetServiceListApi({
        assetIp: asset.assetIp,
      });

      res.forEach((item) => {
        if (item.abnormalFlag) {
          highRiskList.value.push(item)
        } else {
          openList.value.push(item)
        }
      })
    }
  }
}

onMountedOrActivated(() => {
  getData()
})
</script>