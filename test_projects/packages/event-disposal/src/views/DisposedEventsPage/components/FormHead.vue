<!--
 * @name: 已处置事件表单
 * @author: bwb
-->

<template>
  <Form class="pedding-event-form min-w-[1200px]" :model="selectedObj" :rules="rules">
    <div class="grid grid-cols-4 gap-x-4 gap-y-2">
      <FormItem label="时间字段">
        <DatePicker.RangePicker
          :allow-clear="true"
          showTime
          showToday
          valueFormat="YYYY-MM-DD HH:mm:ss"
          v-model:value="selectedObj.time"
        />
      </FormItem>
      <FormItem label="模式">
        <Select
          allow-clear
          v-model:value="selectedObj.statusType"
          :options="fileObj.modes"
          :placeholder="profix + '模式'"
        />
      </FormItem>
      <FormItem label="事件类型">
        <Cascader
          v-model:value="selectedObj.mulitMode"
          :placeholder="profix + '事件类型'"
          :options="fileObj.mulitModes"
          changeOnSelect
          expand-trigger="hover"
        />
      </FormItem>
      <FormItem label="事件名称">
        <Select
          allow-clear
          :options="fileObj.events"
          v-model:value="selectedObj.event"
          show-search
          :filter-option="filterOption"
          :placeholder="profix + '事件名称'"
        />
      </FormItem>
      <FormItem label="威胁等级">
        <Select
          allow-clear
          v-model:value="selectedObj.threat"
          :placeholder="profix + '威胁等级'"
          :options="fileObj.threats"
          :filter-option="filterOption"
        />
      </FormItem>
      <FormItem label="源IP">
        <Select
          allow-clear
          mode="multiple"
          v-model:value="selectedObj.IP"
          :loading="sipLoading"
          :options="fileObj.IPs"
          :placeholder="profix + '源IP'"
        />
      </FormItem>
      <FormItem label="目的IP">
        <Select
          allow-clear
          mode="multiple"
          :options="fileObj.targetIPs"
          :loading="dipLoading"
          v-model:value="selectedObj.targetIP"
          :placeholder="profix + '目的IP'"
        />
      </FormItem>
      <FormItem label="源或目标IP" name="ip">
        <Input
          v-model:value="selectedObj.ip"
          :placeholder="profix + '源或目标IP'"
          :maxlength="30"
          autocomplete="off"
        />
      </FormItem>
      <FormItem label="源或目的MAC">
        <Input
          v-model:value="selectedObj.MAC"
          :options="fileObj.Mac"
          :maxlength="30"
          :placeholder="profix + '源或目的MAC'"
        />
      </FormItem>
      <FormItem label="资产查询ID">
        <Input
          v-model:value="selectedObj.assetSearchID"
          :maxlength="30"
          :placeholder="profix + '资产查询ID'"
          autocomplete="off"
        />
      </FormItem>
      <FormItem label="日志源类型">
        <Select
          allow-clear
          v-model:value="selectedObj.logSourceType"
          :placeholder="profix + '日志源类型'"
          :options="fileObj.logSourceTypes"
          :filter-option="filterOption"
          show-search
        />
      </FormItem>
      <FormItem label="日志源名称">
        <Select
          allow-clear
          v-model:value="selectedObj.logSourceName"
          :placeholder="profix + '日志源名称'"
          :options="fileObj.logSourceNames"
          :filter-option="filterOption"
          show-search
        />
      </FormItem>
    </div>
    <FormItem class="float-right p-y-2">
      <Button
        type="primary"
        :disabled="disable"
        size="middle"
        @click="
          () => {
            data_disposed.current = 1
            parentFunc('query')
          }
        "
        >查询</Button
      >
    </FormItem>
  </Form>
</template>

<script lang="ts" setup>
import { onMounted, reactive, watch, ref } from 'vue'
import { DatePicker, Form, Select, FormItem, Cascader, Input, Button } from 'ant-design-vue'
import {
  getLogSourceType,
  getLogSourceName,
  getTree,
  countUntreatedEventBySrcIpReport,
  countUntreatedEventByDstIpReport,
  getEventNameByEventType
} from '../../../service/Form'
import { useRoute } from '@guolisec/routerable'
import { filterOption } from '@guolisec/utils'
import { getRules } from '../../../utils/formRules'
import { fileType, baseType } from '../../../types/peddingEventType'
import { useFormStore } from '../../../model/form'

let { data_disposed } = useFormStore()
const sipLoading = ref(false)
const dipLoading = ref(false)
const disable = ref(false)
const rules = getRules(disable)
const route = useRoute()
const profix = '请选择'
const parentFunc = defineEmits(['query', 'update:selectedObj'])
let { selectedObj, treat } = defineProps({
  selectedObj: {
    type: Object,
    default() {
      return {}
    }
  },
  treat: Boolean
})
watch(selectedObj, () => {
  parentFunc('update:selectedObj', selectedObj)
})

const fileObj = reactive<fileType>({
  time: undefined,
  modes: [
    { value: 0, label: '审计' },
    { value: 1, label: '警告' },
    { value: 2, label: '阻断' },
    { value: 3, label: '拒绝' },
    { value: 4, label: '恢复' }
  ],
  mulitModes: [],
  events: [],
  threats: [
    { value: '高风险', label: '高风险' },
    { value: '中风险', label: '中风险' },
    { value: '低风险', label: '低风险' },
    { value: '信息', label: '信息' }
  ],
  IPs: [],
  targetIPs: [],
  threatLevels: [],
  Mac: [],
  logSourceTypes: [],
  logSourceNames: []
})
onMounted(() => {
  //这个页面可能可以从其他页面跳转
  selectedObj.assetSearchID = route.query.content
  if (route.query.clearTime) {
    selectedObj.time = []
  }
  selectedObj.threat = route.query.level
  getEventNameByEventType({
    eventType: 0,
    //这个组件可以被两个页面使用，在disposed-events时所有请求的treat参数为true 否则false
    treat: Boolean(treat)
  }).then((res) => {
    fileObj.events = res.map((value) => {
      return { value: value, label: value }
    })
  })
  getLogSourceType().then((res: string[]) => {
    fileObj.logSourceTypes = res.map((e) => {
      return { value: e, label: e }
    })
  })
  getLogSourceName().then((res: string[]) => {
    fileObj.logSourceNames = res.map((e) => {
      return { value: e, label: e }
    })
  })
  type LoopTree = { eventTypes?: LoopTree; id: number; level: number; name: string }[]
  //递归 转换数据结构
  const recursiveFunc = (obj: LoopTree) => {
    return obj.map((item) => {
      let { name, id } = item
      if (Array.isArray(item.eventTypes)) {
        return { value: id, label: name, children: recursiveFunc(item.eventTypes) }
      }
      return { value: id, label: name }
    })
  }
  getTree().then((res) => {
    fileObj.mulitModes = recursiveFunc(res)
  })
  whileTimeChange()
})

watch(
  () => selectedObj.time,
  () => {
    whileTimeChange()
  }
)

// const clear = () => {
//   //清空对象数据后发还给父组件
//   for (let key of Object.keys(selectedObj)) {
//     //时间组件除外
//     if (key != 'time') {
//       selectedObj[key] = undefined
//     }
//   }
//   parentFunc("update:selectedObj", selectedObj);
// }

//根据时间范围选择器改变需要获取两个输入框的options
const whileTimeChange = () => {
  dipLoading.value = true
  sipLoading.value = true
  countUntreatedEventBySrcIpReport({
    treat: route.name == 'disposed-events',
    filterZero: true
  }).then((res) => {
    fileObj.IPs = res.map((value) => {
      if (fileObj.IPs.indexOf({ value: value.srcIp, label: value.srcIp }) == -1) {
        return { value: value.srcIp, label: value.srcIp }
      }
    }) as baseType[]
    sipLoading.value = false
  })
  countUntreatedEventByDstIpReport({
    treat: route.name == 'disposed-events',
    filterZero: true
  }).then((res) => {
    fileObj.targetIPs = res.map((value) => {
      if (fileObj.targetIPs.indexOf({ value: value.srcIp, label: value.srcIp }) == -1) {
        return { value: value.srcIp, label: value.srcIp }
      }
    }) as baseType[]
    dipLoading.value = false
  })
}
</script>
<style scoped>
.pedding-event-form {
  margin: 1vh 2vw;
  padding: 10px;
  border-radius: 0.5em;
}

:deep(.ant-form-item) {
  margin-bottom: 5px;
}

:deep(.ant-picker-input > input) {
  margin: 1px;
}

:deep(.ant-form-item-label) {
  width: 5vw;
  justify-content: end;
}
</style>
