
<!--
 * @name:资产可视化-交换机
 * @description: 基本单元
-->

<template>
  <Card class="min-h-190">
    <template v-if="portUsageinfo.length">
      <div class="overflow-y-auto ">
        <div class="switch-interfaces w-fit" ref="pageRef">
          <div class=" flex p-6 items-center">
            <div class="light ">
              <div class="light-item flex items-center ">
                <div class="light-circle w-[10px] h-[10px]"
                  :style="`background: ${asset.runStatus ? '#0d8b0d' : '#606266'}`">
                </div>
                <div class="light-desc ml-2 font-bold">PWR</div>
              </div>
            </div>

            <div class="grid grid-rows-2 grid-flow-col"
              :style="`height: 100px; width: ${56 * portUsageinfo.length / 2}px`">
              <SwitchPortImage v-for="(item, key) in portUsageinfo" :key="key" :status="item.status" :size="48"
                @mouseover="(event) => handleMouseover(event, item)" @mouseout="handleMouseout"
                :direction="key % 2 === 0 ? 'bottom' : 'top'" />
            </div>

          </div>
        </div>
      </div>
      <Teleport to="body">

        <div
          class="port-info-tooltip w-[240px] shadow p-4 space-y-2 hidden  absolute  bg-$color-bg-base rounded text-sm z-[1000000]"
          ref="portInfoTooltipRef">
          <div>
            <span class="inline-block w-[12px] h-[12px] rounded-[6px] mr-2"
              :class="currentHoverSwitchPortInfo?.status === 'connect' ? 'bg-$green-6' : 'bg-$color-text-disabled'"></span>
            {{ currentHoverSwitchPortInfo?.port ?? '-'}}
          </div>
          <div v-show="currentHoverSwitchPortInfo?.status === 'connect'">
            <span class="inline-block text-$color-text-tertiary  w-[64px]">{{ t('上行速率') }}</span>
            {{ getFormatFlow(currentHoverSwitchPortInfo?.portUpSpeed) }}
          </div>
          <div v-show="currentHoverSwitchPortInfo?.status === 'connect'">
            <span class="inline-block text-$color-text-tertiary w-[64px]">{{ t('下行速率') }}</span>
            {{ getFormatFlow(currentHoverSwitchPortInfo?.portDownSpeed) }}
          </div>
        </div>
      </Teleport>
    </template>
    <Empty v-else />
  </Card>
</template>
<script setup lang="ts">
import type { PropType } from 'vue';
import { Empty, Card } from 'ant-design-vue';
import { ref, Teleport } from 'vue'
import { onMountedOrActivated } from '@guolisec/utils';
import SwitchPortImage from './PortImageSwitch.vue';
import { getSwitchInfoApi } from '@/domains/port/model/switch';
import { useAssetInfoStore } from '@/entry/store';
import { SwitchInfo, PortUsageinfo, PortInfo } from '@/domains/port/types/port'
import { t } from '@/entry/languages/useLanguage'
import { formatFlow } from '@guolisec/utils'

// 父组件传值
const props = defineProps({
  switchInfo: {
    type: Object as PropType<SwitchInfo>,
  },
});

onMountedOrActivated(() => {
  getData()
})

function getFormatFlow(value) {
  if (value) {
    const number = Number(value)
    return formatFlow(number, 1) + "ps"
  }
  return '-'
}

/**
 * 对于 connect 的端口，展示其上、下行速率
 */
const portInfoTooltipRef = ref()
const currentHoverSwitchPortInfo = ref<PortInfo>()
function handleMouseover(event, seitchInfo) {
  currentHoverSwitchPortInfo.value = seitchInfo || {}
  portInfoTooltipRef.value.style.display = 'block'
  portInfoTooltipRef.value.style.top = event.clientY + 24 - event.offsetY + 'px'
  portInfoTooltipRef.value.style.left = event.clientX + 24 - event.offsetX + 'px'
}

function handleMouseout() {
  portInfoTooltipRef.value.style.display = 'none'
}

const { asset } = useAssetInfoStore()

const portUsageinfo = ref<PortUsageinfo[]>([]);

async function getData() {
  if (props.switchInfo) {
    portUsageinfo.value = props.switchInfo.switchInfoVO.portUsageinfo;
  } else {
    if (asset.assetIp && asset.assetMac) {
      // 调用接口
      const { switchInfoVO } = await getSwitchInfoApi({
        assetIp: asset.assetIp,
        assetMac: asset.assetMac
      })
      portUsageinfo.value = switchInfoVO.portUsageinfo
    }
  }
}
</script>
<style scoped lang="less">
.switch-interfaces {
  background-color: #9a9a9a;

  .light {
    flex: 0 0 60px;

    .light-item {
      .light-circle {
        border-radius: 50%;
        background: #0d8b0d;
      }
    }
  }

  .interface-box {
    display: flex;
    align-items: center;
  }

  .content-box {
    display: flex;
    flex-direction: column;
    flex-wrap: wrap;
    align-content: center;
  }
}

.port-info-tooltip {
  pointer-events: none;
}
</style>