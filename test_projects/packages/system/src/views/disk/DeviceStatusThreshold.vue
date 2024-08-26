<!--
 * @name: 数据清理阈值
 * @description: Do not edit
 * @date: 2023-06-26 09:20:58
 * @path: \system\src\views\disk\DeviceStatusThreshold.vue
-->
<template>
  <div class="systemConfigThreshold">
    <Row style="text-align: center">
      <Col :span="12" style="border-right: 1px solid rgba(0, 0, 0, 0.1)">
      <h1 class="text-lg"> 设备状态告警阈值 </h1>
      <Form :model="alarmForm" :label-col="{ span: 11 }" :wrapper-col="{ span: 4 }" style="margin-top: 30px"
        ref="alarmFormRef">
        <template v-if="props.showOfflineAlarm">
          <FormItem label="离线告警" name="offline">
            <Switch v-model:checked="alarmForm.offline" />
          </FormItem>
        </template>
        <FormItem label="CPU使用率" name="cpu" :rules="[{ required: true, message: '请输入CPU使用率', trigger: 'blur' }]">
          <InputNumber v-model:value="alarmForm.cpu" :min="1" :max="100" :precision="0" />
          <span class="ml-1">%</span>
        </FormItem>
        <FormItem label="内存使用率" name="memory" :rules="[{ required: true, message: '请输入内存使用率', trigger: 'blur' }]">
          <InputNumber v-model:value="alarmForm.memory" :min="1" :max="100" :precision="0" />
          <span class="ml-1">%</span>
        </FormItem>
        <FormItem label="硬盘使用率" name="disk" :rules="[{ required: true, message: '请输入硬盘使用率', trigger: 'blur' }]">
          <InputNumber v-model:value="alarmForm.disk" :min="1" :max="100" :precision="0" />
          <span class="ml-1">%</span>
        </FormItem>
        <FormItem :wrapper-col="{ offset: 9, span: 6 }">
          <Button ghost type="primary" :loading="alarmButtonLoading" @click="saveAlarm">保存</Button>
        </FormItem>
      </Form>
      <div class="tips">
        <i class="i-base-error-warning-line align-icon"></i>
        {{ deviceStatusAlarmInfo }}
      </div>
      </Col>
      <Col :span="12">
      <h1 class="text-lg"> 数据清理阈值 </h1>
      <Form :model="sysForm" :label-col="{ span: 11 }" :wrapper-col="{ span: 4 }" style="margin-top: 30px"
        ref="sysFormRef">
        <FormItem label="数据保存时限" name="day" :rules="[{ required: true, message: '请输入数据保存时限', trigger: 'blur' }]">
          <InputNumber v-model:value="sysForm.day" :min="1" :max="36500" :precision="0" />
          <span class="ml-1">天</span>
        </FormItem>
        <FormItem label="硬盘使用率" name="dataDiskUsedRate"
          :rules="[{ required: true, message: '请输入硬盘使用率', trigger: 'blur' }]">
          <InputNumber v-model:value="sysForm.dataDiskUsedRate" :min="1" :max="100" :precision="0" />
          <span class="ml-1">%</span>
        </FormItem>
        <FormItem :wrapper-col="{ offset: 9, span: 6 }">
          <Button :loading="esButtonLoading" @click="saveEs" danger>保存</Button>
        </FormItem>
      </Form>
      </Col>
    </Row>
  </div>
</template>
<script setup name="SystemConfigThreshold" lang="ts">
import { ref, onMounted, computed } from 'vue'
import {
  Row,
  Col,
  Form,
  FormItem,
  Switch,
  InputNumber,
  Button,
  FormInstance,
  message,
  Modal
} from 'ant-design-vue';
import {
  getAssetThresholdsApi,
  getEsCleanApi,
  modifyAssetThresholdsApi,
  modifyEsCleanApi,
} from '../../model/disk';

const props = defineProps({
  showOfflineAlarm: {
    type: Boolean,
    default: true
  },
  supportDump: {
    type: Boolean,
    default: true
  }
})

const deviceStatusAlarmInfo = computed(() => {
  if (!props.supportDump) {
    return "超过设备状态阈值会产生告警。"
  }
  return "超过设备状态阈值会产生告警，超过磁盘使用率阈值还会进行转储。"
})

// 设备状态告警阈值表单
let alarmForm = ref({
  id: undefined,
  cpu: undefined, // CPU使用率
  memory: undefined, // 内存使用率
  disk: undefined, // 硬盘使用率
  netflow: undefined, // 网络流量
  offline: false, // 离线告警开关
});

let sysForm = ref({
  day: undefined, // 数据保存时限
  dataDiskUsedRate: undefined, // 硬盘使用率
});

// 保存按钮loading状态
let alarmButtonLoading = ref(false);
let esButtonLoading = ref(false);

// 表单实例
const alarmFormRef = ref<FormInstance>();
const sysFormRef = ref<FormInstance>();

// 页面加载时
onMounted(() => {
  getAssetThresholds();
  getEsClean();
});

// 获取设备状态告警阈值
const getAssetThresholds = () => {
  getAssetThresholdsApi().then((res) => {
    alarmForm.value = res;
  });
};

// 获取数据清理阈值
const getEsClean = () => {
  getEsCleanApi().then((res) => {
    sysForm.value = res[0];
  });
};

// 保存设备状态告警阈值
const saveAlarm = () => {
  alarmFormRef.value?.validateFields().then(() => {
    alarmButtonLoading.value = true;
    modifyAssetThresholdsApi(alarmForm.value)
      .then((res) => {
        alarmForm.value = res;
        message.success('修改成功');
      })
      .finally(() => {
        alarmButtonLoading.value = false;
      });
  });
};

// 保存数据清理阈值
const saveEs = () => {
  Modal.confirm({
    title: '确定修改数据清理阈值吗？',
    content: `修改后系统将在数据存储超过 ${sysForm.value.day} 天或磁盘使用率超过 ${sysForm.value.dataDiskUsedRate}% 时进行数据清理。`,
    onOk() {
      sysFormRef.value?.validateFields().then(() => {
        esButtonLoading.value = true;
        modifyEsCleanApi(sysForm.value)
          .then(() => {
            message.success('修改成功');
            esButtonLoading.value = false;
          })
          .finally(() => {
            esButtonLoading.value = false;
          });
      });
    }
  })

};
</script>
