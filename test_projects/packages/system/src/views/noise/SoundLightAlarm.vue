<!--
 * @name: 声光电告警
 * @description: 系统设置-声光电告警
 * @path: \system\src\views\noise\SoundLightAlarm.vue
-->
<template>
  <div class="systemConfigSoundLightAlarm">
    <Form :model="soundLightForm" :label-col="{ span: 10 }" :wrapper-col="{ span: 4 }" style="margin-top: 30px">
      <FormItem label="开关设置" name="doStatus">
        <Switch v-model:checked="soundLightForm.doStatus" :checked-value="1" :un-checked-value="0" />
      </FormItem>
      <FormItem label="威胁等级" name="score">
        <Select v-model:value="soundLightForm.score" :options="eventLevelList" placeholder="威胁等级" />
      </FormItem>
      <FormItem label="设备" name="assetIp">
        <Select v-model:value="soundLightForm.assetIp" placeholder="请选择设备" allow-clear>
          <SelectOption v-for="item in deviceList" :value="item.assetIp" :key="item.id">
            {{ item.assetIp }}
          </SelectOption>
        </Select>
      </FormItem>
      <FormItem label="设备网口" name="doIndex">
        <Select v-model:value="soundLightForm.doIndex" :options="networkInterfaceList" placeholder="请选择设备网口"
          allow-clear />
      </FormItem>
      <FormItem :wrapper-col="{ offset: 11, span: 6 }">
        <Button type="primary" :loading="buttonLoading" @click="handleSubmit">保存</Button>
      </FormItem>
    </Form>
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted } from 'vue'
import {
  Form,
  FormItem,
  Switch,
  Button,
  message,
  Select,
  SelectOption,
} from 'ant-design-vue';
import {
  getSoundLightDeviceApi,
  getSoundLightInfoApi,
  postSoundLightInfoApi,
  type SoundLightConfig
} from '../../model/noise';

let soundLightForm = ref<SoundLightConfig>({
  id: undefined,
  doStatus: 0, // 开关设置
  score: 1, // 威胁等级
  assetIp: '', // 设备
  doIndex: undefined, // 设备网口
});

// 威胁等级列表
const eventLevelList = ref([
  { label: '高风险', value: 10 },
  { label: '中风险', value: 5 },
  { label: '低风险', value: 2 },
  { label: '信息', value: 0 },
]);

// 设备列表
let deviceList = ref<{
  assetIp: string;
  id: number;
}[]>([]);

// 设备网口列表
const networkInterfaceList = ref([
  { label: 'DO0', value: 0 },
  { label: 'DO1', value: 1 },
  { label: 'DO2', value: 2 },
  { label: 'DO3', value: 3 },
  { label: 'DO4', value: 4 },
  { label: 'DO5', value: 5 },
  { label: 'DO6', value: 6 },
  { label: 'DO7', value: 7 },
  { label: 'DO8', value: 8 },
  { label: 'DO9', value: 9 },
  { label: 'DO10', value: 10 },
  { label: 'DO11', value: 11 },
  { label: 'DO12', value: 12 },
  { label: 'DO13', value: 13 },
  { label: 'DO14', value: 14 },
  { label: 'DO15', value: 15 },
]);

// 保存按钮loading状态
let buttonLoading = ref(false);

// 页面加载时
onMounted(() => {
  getDeviceList();
  getSoundLightInfo();
});

// 获取声光电设备列表
async function getDeviceList() {
  const res = await getSoundLightDeviceApi()
  deviceList.value = res;
}

// 获取声光电告警数据
async function getSoundLightInfo() {
  const res = await getSoundLightInfoApi()
  soundLightForm.value = res;
}

// 保存声光电告警
async function handleSubmit() {
  buttonLoading.value = true;
  try {
    await postSoundLightInfoApi(soundLightForm.value)
    getSoundLightInfo();
    message.success('修改成功');
    buttonLoading.value = false;
  } finally {
    buttonLoading.value = false;
  }

}
</script>
