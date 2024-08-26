<template>
  <div class="p-4" style="width: 100%">
    <Card>
      <template #title>
        <Button type="primary" ghost @click="goBack()"> <LeftOutlined />返回 </Button>
        <Divider type="vertical" style="height: 32px" />
        设备管理&emsp;
        <Tag color="green">{{ state.deviceName }}</Tag>
        <Tag color="green">{{ state.ip }}</Tag>
        <Tag :color="colorSet[state.status]">{{ runstatusSet[state.status] }}</Tag>
      </template>
      <Tabs v-model:active-key="activeKey">
        <TabPane key="parameter" tab="系统参数">
          <div class="systemConfigThreshold">
            <Row style="text-align: center">
              <Col :span="12">
                <h1 class="text-lg">设备状态告警阈值</h1>
                <Form
                  :model="alarmForm"
                  :label-col="{ span: 11 }"
                  :wrapper-col="{ span: 4 }"
                  style="margin-top: 30px"
                  ref="alarmFormRef"
                >
                  <FormItem
                    label="CPU使用率"
                    name="cpu"
                    :rules="[{ required: true, message: '请输入CPU使用率', trigger: 'blur' }]"
                  >
                    <InputNumber v-model:value="alarmForm.cpu" :min="1" :max="100" :precision="0" />
                    <span class="unit">%</span>
                  </FormItem>
                  <FormItem
                    label="内存使用率"
                    name="memory"
                    :rules="[{ required: true, message: '请输入内存使用率', trigger: 'blur' }]"
                  >
                    <InputNumber
                      v-model:value="alarmForm.memory"
                      :min="1"
                      :max="100"
                      :precision="0"
                    />
                    <span class="unit">%</span>
                  </FormItem>
                  <FormItem
                    label="硬盘使用率"
                    name="disk"
                    :rules="[{ required: true, message: '请输入硬盘使用率', trigger: 'blur' }]"
                  >
                    <InputNumber
                      v-model:value="alarmForm.disk"
                      :min="1"
                      :max="100"
                      :precision="0"
                    />
                    <span class="unit">%</span>
                  </FormItem>
                  <FormItem :wrapper-col="{ offset: 9, span: 6 }">
                    <Button type="primary" :loading="alarmButtonLoading" @click="saveAlarm"
                      >保存</Button
                    >
                  </FormItem>
                </Form>
                <div class="tips">
                  <ExclamationCircleFilled />
                  超过设备状态阈值会产生告警，超过磁盘使用率阈值还会进行转储。
                </div>
              </Col>
            </Row>
          </div>
        </TabPane>
      </Tabs>
    </Card>
  </div>
</template>
<script setup lang="ts">
import {
  Card,
  Button,
  Divider,
  Tag,
  Tabs,
  TabPane,
  Row,
  Col,
  FormItem,
  Form,
  FormInstance,
  message,
  InputNumber
} from 'ant-design-vue'
import { LeftOutlined, ExclamationCircleFilled } from '@ant-design/icons-vue'
import { useRoute } from 'vue-router'
import { go } from '@guolisec/routerable'
import { ref, reactive, onMounted } from 'vue'

import { getEsCleanApi, saveResourceRateApi } from '../../model/preference'

let activeKey = ref('parameter')

const runstatusSet = ['离线', '在线', '闲置']
const colorSet = ['red', 'green', 'default']

const goBack = () => {
  go({
    name: 'DevicePage',
    query: {
      activeKey: state.activeKey
    }
  })
}

const state = reactive({
  deviceName: '',
  ip: '',
  status: '',
  activeKey: ''
})

onMounted(() => {
  const { query } = useRoute()
  state.deviceName = query.name as string
  state.ip = query.ip as string
  state.activeKey = query.activeKey as string
})

const { query } = useRoute()

// 设备状态告警阈值表单
let alarmForm = ref({
  id: undefined,
  cpu: undefined, // CPU使用率
  memory: undefined, // 内存使用率
  disk: undefined, // 硬盘使用率
  netflow: undefined, // 网络流量
  offline: false // 离线告警开关
})

let sysForm = ref({
  day: undefined, // 数据保存时限
  dataDiskUsedRate: undefined // 硬盘使用率
})

// 保存按钮loading状态
let alarmButtonLoading = ref(false)

// 表单实例
const alarmFormRef = ref<FormInstance>()

// 页面加载时
onMounted(() => {
  getAssetThresholds()
  getEsClean()
})

// 获取设备状态告警阈值
const getAssetThresholds = () => {
  alarmForm.value.cpu = query.cpu as any
  alarmForm.value.memory = query.ram as any
  alarmForm.value.disk = query.rom as any
}

// 获取数据清理阈值
const getEsClean = () => {
  getEsCleanApi().then((res) => {
    sysForm.value = res[0]
  })
}

// 保存设备状态告警阈值
const saveAlarm = () => {
  alarmFormRef.value?.validateFields().then(() => {
    alarmButtonLoading.value = true
    const data = {
      id: undefined,
      cpuRate: alarmForm.value.cpu,
      ramRate: alarmForm.value.memory,
      romRate: alarmForm.value.disk,
      sn: query.sn
    }
    if (query.cpu) {
      data.id = query.id as any
    } else {
      data.id = alarmForm.value.id ? alarmForm.value.id : undefined
    }
    saveResourceRateApi(data)
      .then((res) => {
        if (!data.id) {
          alarmForm.value.id = res.id
        }
        message.success('修改成功')
      })
      .finally(() => {
        alarmButtonLoading.value = false
      })
  })
}
</script>
