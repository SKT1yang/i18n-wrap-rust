<template>
  <div class="topology-config-bar">
    <FloatButtonGroup shape="square" :style="{
      top: '160px',
      right: '50px',
      bottom: '800px'
    }">
      <FloatButton @click="handleUserConfigClick">
        <template #icon>
          <i class="i-base-equalizer-line"></i>
        </template>
      </FloatButton>
    </FloatButtonGroup>
    <FloatButtonGroup shape="square" :style="{
      top: '210px',
      right: '50px',
      bottom: '500px'
    }">
      <FloatButton @click="handleZoom(1.1)">
        <template #icon>
          <i class="i-base-zoom-in-line"></i>
        </template>
      </FloatButton>
      <FloatButton @click="handleZoom(0.9)">
        <template #icon>
          <i class="i-base-zoom-out-line"></i>
        </template>
      </FloatButton>
      <FloatButton @click="handleFocus(3)">
        <template #icon>
          <span>L</span>
          <span class="text-sm">3</span>
        </template>
      </FloatButton>
      <FloatButton @click="handleFocus(2)">
        <template #icon>
          <span>L</span>
          <span class="text-sm">2</span>
        </template>
      </FloatButton>
      <FloatButton @click="handleFocus(1)">
        <template #icon>
          <span>L</span>
          <span class="text-sm">1</span>
        </template>
      </FloatButton>
      <FloatButton @click="handleFitCenter">
        <template #icon>
          <i class="i-base-fullscreen-exit-line"></i>
        </template>
      </FloatButton>
    </FloatButtonGroup>
    <FloatButtonGroup shape="square" :style="{
      top: '465px',
      right: '50px',
      bottom: '500px'
    }">
      <FloatButton @click="handleHelper">
        <template #icon>
          <i class="i-base-question-line"></i>
        </template>
      </FloatButton>
    </FloatButtonGroup>

    <!-- 线条配置弹窗 -->
    <div v-if="lineVisible" class="fixed z-1000 p-4 bg-$color-bg-base w-50 right-[100px] top-[100px] shadow-md">
      <div class="text-md font-bold mb-2">线条属性</div>
      <Form :model="topologyStoreRef.activeLineElement.value" layout="vertical">
        <FormItem label="宽度" name="lineWidth">
          <InputNumber placeholder="线条宽度" v-model:value="topologyStoreRef.activeLineElement.value.lineWidth"
            @change="handleChange" :min="1" :max="10" addon-after="px" />
        </FormItem>
        <FormItem label="线性" name="lineDash">
          <LineDashPicker @change="handleChange" v-model:line-dash="topologyStoreRef.activeLineElement.value.lineDash" />
        </FormItem>
        <FormItem label="颜色" name="stroke">
          {{ topologyStoreRef.activeLineElement.value.stroke }}
          <ColorPicker @change="handleChange" v-model:value="topologyStoreRef.activeLineElement.value.stroke" />
        </FormItem>
      </Form>
    </div>
    <!-- 矩形配置弹窗 -->
    <div v-if="boxVisible" class="fixed z-1000 p-4 bg-$color-bg-base w-50 right-[100px] top-[100px] shadow-md">
      <div class="text-md font-bold mb-2">矩形属性</div>
      <Form :model="topologyStoreRef.activeBoxElement.value" layout="vertical">
        <FormItem label="描边宽度" name="lineWidth">
          <InputNumber placeholder="线条宽度" v-model:value="topologyStoreRef.activeBoxElement.value.lineWidth"
            @change="handleChange" :min="1" :max="10" addon-after="px" />
        </FormItem>
        <FormItem label="描边线型" name="lineDash">
          <LineDashPicker @change="handleChange" v-model:line-dash="topologyStoreRef.activeBoxElement.value.lineDash" />
        </FormItem>
        <FormItem label="描边颜色" name="stroke">
          <ColorPicker @change="handleChange" v-model:value="topologyStoreRef.activeBoxElement.value.stroke" />
        </FormItem>
        <FormItem label="填充颜色" name="fill">
          <ColorPicker @change="handleChange" v-model:value="topologyStoreRef.activeBoxElement.value.fill" />
        </FormItem>
      </Form>
    </div>
    <!-- 文字配置弹窗 -->
    <div v-if="textVisible" class="fixed z-1000 p-4 bg-$color-bg-base w-50 right-[100px] top-[100px] shadow-md">
      <div class="text-md font-bold mb-2">文字属性</div>
      <Form :model="topologyStoreRef.activeTextElement.value" layout="vertical">
        <FormItem label="文字内容" name="label">
          <Input placeholder="文字内容" v-model:value="topologyStoreRef.activeTextElement.value.label" @blur="handleChange"
            :maxlength="20" />
        </FormItem>
        <FormItem label="文字字号" name="fontSize">
          <InputNumber placeholder="字号" v-model:value="topologyStoreRef.activeTextElement.value.fontSize"
            @change="handleChange" :min="12" :max="96" addon-after="px" />
        </FormItem>
        <FormItem label="文字颜色" name="color">
          <ColorPicker @change="handleChange" v-model:value="topologyStoreRef.activeTextElement.value.color" />
        </FormItem>
      </Form>
    </div>

    <OperateHelper v-model:value="helperVisible" />
  </div>
</template>

<script lang='ts' setup>
import { ref, watch } from 'vue';
import { FloatButtonGroup, FloatButton, Form, FormItem, message, Input, InputNumber } from 'ant-design-vue'
import LineDashPicker from './LineDashPicker.vue';
import ColorPicker from './ColorPicker.vue'
import OperateHelper from './OperateHelper.vue';
import { useTopologyStoreWithOut } from '../../../model/store'
import { storeToRefs } from 'pinia'
import { NODE_TYPE, PERA_LAYER } from '../../../types/enum';

const topologyStore = useTopologyStoreWithOut()
const topologyStoreRef = storeToRefs(topologyStore)

/********************** 可配置元素按钮 **********************/
function handleUserConfigClick() {
  const type = topologyStore.activeElementInfo.type
  switch (type) {
    case NODE_TYPE.LINE_NODE:
      lineVisible.value = !lineVisible.value
      break;
    case NODE_TYPE.BOX_NODE:
      boxVisible.value = !boxVisible.value
      break;
    case NODE_TYPE.TEXT_NODE:
      textVisible.value = !textVisible.value
      break;
    case NODE_TYPE.ASSET_NODE:
      break;
    default:
      message.warn('未选中可配置的元素')
      break;
  }

}

watch(() => topologyStoreRef.activeElementInfo.value.uuid, (uuid) => {
  lineVisible.value = false
  boxVisible.value = false
  textVisible.value = false
  if (uuid) {
    handleUserConfigClick()
  }
})

function handleChange() {
  topologyStore.updateActiveNodeItem()
}

// 线
const lineVisible = ref(false)

// 矩形
const boxVisible = ref(false)

// 文字
const textVisible = ref(false)

/********************** 缩放画布 **********************/

function handleZoom(ratio) {
  if (!topologyStore.graphic) {
    console.warn('缩放画布失败,未找到g6实例')
    return
  }
  topologyStore.graphic.zoom(ratio)
}

/********************** 聚焦普渡模型某一层 **********************/

function handleFocus(level: 1 | 2 | 3) {
  if (!topologyStore.graphic) {
    console.warn('聚焦普渡模型某一层失败,未找到g6实例')
    return
  }
  switch (level) {
    case 1:
      topologyStore.graphic.focusItem(PERA_LAYER.CONTROLLER_LAYER)
      break;
    case 2:
      topologyStore.graphic.focusItem(PERA_LAYER.MONITOR_LAYER)
      break;
    case 3:
      topologyStore.graphic.focusItem(PERA_LAYER.OPERATION_LAYER)
      break;
    default:
      break;
  }
}

/********************** 对齐画布 **********************/

function handleFitCenter() {
  if (!topologyStore.graphic) {
    console.warn('对齐到画布中心失败, 未找到g6实例')
    return
  }
  topologyStore.graphic.fitCenter()
}

/********************** 操作帮助 **********************/
const helperVisible = ref(false)

function handleHelper() {
  helperVisible.value = true
}
</script>