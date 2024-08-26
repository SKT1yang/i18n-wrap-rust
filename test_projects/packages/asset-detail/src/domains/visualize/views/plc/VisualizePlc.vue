<!--
 * @Name: PLC-可视化
 * @Description: 展示PLC的硬件模块
-->

<template>
  <Card class="min-h-190">
    <Button class="absolute top-10 right-10 z-9" v-if="isShowByFeature('visualize::plc::modify')"
      @click="handleModifyPlcModule">
      <i class="i-base-edit"></i>
    </Button>
    <div class="relative">
      <!-- 目前，所有的模块类型中只有 CPU 类型可以识别出信号灯信息，其他模块类型不支持识别设备灯。-->
      <!-- 因此，如果有设备灯状态的模块，将其视为 CPU 类型的模块。如果该 PLC 没有设备灯状态信息，则默认 CPU 模块位于0号槽。 -->
      <div class="h-60 mt-10 ml-40 relative" v-for="(val, key) in dataList" :key="key">
        <div class="absolute left-[-100px] t-[6px] font-bold w-25 break-all">{{ val.blockGuideName }}</div>
        <div class="flex overflow-auto pb-1">
          <div class="flex" v-for="(item) in val.moduleVOList" :key="item.id" v-show="item.repeat !== 1">
            <PlcModuleCpu
              v-if="(item.blockSlotNo === 0 && !ledStatus?.length) || getMoudleLedStatusList(item.blockGuideNo, item.blockSlotNo)"
              :module-vo="item" :ledStatus="getMoudleLedStatusList(item.blockGuideNo, item.blockSlotNo)"
              :expand-id="expandId" @expand="handleExpand" />
            <PlcModule v-else :module-vo="item" :expand-id="expandId" :ledStatus="ledStatus" @expand="handleExpand" />
          </div>
        </div>
      </div>
    </div>

    <VisualizePlcModifyModal v-model:visible="visible" :current="dataList" @refresh="getDataList" />
  </Card>
</template>

<script lang="ts" setup>
/* 类型文件 */
import type { ModulePlcVisualize } from '../../types/plc'
/* 第三方模块 */
import { ref } from 'vue'
import { Button, Card } from 'ant-design-vue';
import { onMountedOrActivated, uuid } from '@guolisec/utils'
/* 全局模块 */
import { isShowByFeature } from '@/entry/features/useContext';
/* 本地模块 */
import { useAssetInfoStore } from '@/entry/store';
import VisualizePlcModifyModal from './VisualizePlcModifyModal.vue';
import PlcModuleCpu from './PlcModuleCpu.vue';
import PlcModule from './PlcModule.vue';
import { getPlcDeviceDetailApi } from '@/domains/hardware/model/plc';
import { getPlcModuleApi } from '../../model/plc';

/********************** 处理外部状态数据 **********************/

const { asset } = useAssetInfoStore()

/********************** 初始化 **********************/

const dataList = ref<ModulePlcVisualize[]>([])
const frameLength = ref(0)

onMountedOrActivated(() => {
  getDataList()
  getLedStatus()
})


async function getDataList() {
  const content = await getPlcModuleApi({
    assetIp: asset.assetIp,
    assetMac: asset.assetMac,
  })

  dataList.value = content.map(item => {
    return {
      uuid: uuid(),
      ...item
    }
  })

  if (dataList.value.length > 0) {
    frameLength.value = dataList.value.length - 1;
  }
}

const expandId = ref()
function handleExpand(id?: number) {
  expandId.value = id
}

/********************** 设备灯 **********************/
interface LedStatusForMoudle {
  rack: string;
  slot: string;
  leds: { flash: 0 | 1; status: 0 | 1; name: string }[]
}
const ledStatus = ref<LedStatusForMoudle[]>([])

async function getLedStatus() {
  const { assetDetailOtherVO } = await getPlcDeviceDetailApi({ deviceIp: asset.assetIp, deviceMac: asset.assetMac })
  const rackAndSlotList: string[] = []

  // 根据机架号和槽号，遍历出下面的设备灯
  ledStatus.value = assetDetailOtherVO?.ledStatus.reduce((prev: any[], cur) => {
    const { rack, slot, flash, status, name } = cur
    const rackAndSlot = `${rack},${slot}`
    if (rackAndSlotList.includes(rackAndSlot)) {
      const index = rackAndSlotList.indexOf(rackAndSlot)
      prev[index].leds.push({
        flash, status, name
      })
    } else {
      rackAndSlotList.push(rackAndSlot)
      prev.push({
        rack, slot,
        leds: [{
          flash, status, name
        }]
      })
    }
    return prev
  }, []) || []
}

function getMoudleLedStatusList(moudleRack, moudleSlot) {
  const list = ledStatus.value?.filter(item => item.rack === moudleRack && item.slot === moudleSlot)
  return list.length ? list[0].leds : undefined
}

/********************** 编辑弹窗 **********************/

const visible = ref(false)

function handleModifyPlcModule() {
  visible.value = true
}
</script>