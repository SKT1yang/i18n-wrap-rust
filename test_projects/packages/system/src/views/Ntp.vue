<!--
* @Name: NTP设置
* @Description: 系统设置-时间设置
 * @date: 2023-06-21 10:41:21
 * @path: \system\src\views\Ntp.vue
-->
<template>
  <div class="systemConfigTime">
    <Form :model="ntpForm" :label-col="{ style: { width: '120px' } }" :wrapper-col="{ span: 4 }" hide-required-mark
      ref="ntpFormRef">
      <FormItem label="当前服务器时间">
        {{ systemDate }}
        <Tooltip placement="right">
          <template #title>
            <div class="">
              <div class="">若服务器时间与本地时间不一致，可进行手动校时</div>
            </div>
          </template>
          <i class="i-base-information-full ml-4 mt-1"></i>
        </Tooltip>
      </FormItem>
      <!-- <FormItem label="自动时间同步">
        <Switch v-model:checked="autoSync" />
      </FormItem> -->
      <FormItem label="手动设置时间">
        <div class="flex items-center space-x-2">
          <DatePicker v-model:value="customDate" show-time />
          <Button class="ml-2" @click="saveCustomDate" :disabled="customButtonLoading"
            :loading="customButtonLoading">更改</Button>
        </div>
      </FormItem>
      <FormItem label="设置NTP服务器" name="ip" :rules="[
        {
          validator: ipValidate({
            allowEmpty: true
          }),
          trigger: 'blur',
        },
      ]">
        <div class="flex items-center space-x-2">
          <Input v-model:value="ntpForm.ip" allow-clear placeholder="请输入NTP服务器IP" />
          <Button type="primary" :loading="nptButtonLoading" @click="saveNpt">保存</Button>
        </div>
      </FormItem>
    </Form>
  </div>
</template>
<script setup name="SystemConfigTime" lang="ts">
import { reactive, ref, onMounted, watch } from 'vue'
import {
  Form,
  FormItem,
  Input,
  Button,
  DatePicker,
  message,
  FormInstance,
  Tooltip,
  // Switch
} from 'ant-design-vue';
import dayjs from 'dayjs';
import { formatToDate, ipValidate, useIntervalFn } from '@guolisec/utils';
import {
  getSystemDateApi,
  modifySystemDateApi,
  getClockSyncIpApi,
  modifyClockSyncIpApi,
} from '../model/ntp';

// 组件传值
const props = defineProps({
  activeKey: {
    type: String,
    default: '',
  },
});

// const autoSync = ref(false)

// 当前服务器时间
let systemDate = ref();
// 设置服务器时间
let customDate = ref();
// 保存按钮loading状态
let nptButtonLoading = ref(false);

let customButtonLoading = ref(false);

// NTP服务器表单
let ntpForm = reactive({
  id: '',
  ip: '',
});

// 表单实例
const ntpFormRef = ref<FormInstance>();
// 获取客户端时间
const getSysDate = () => {
  getSystemDateApi().then((res) => {
    systemDate.value = formatToDate(res.systemDate, 'YYYY-MM-DD HH:mm:ss');
  });
};
const { pause, resume } = useIntervalFn(() => {
  getSysDate();
}, 1000, {
  immediateCallback: true
})

// 监听激活标签
watch(
  () => props.activeKey,
  (v) => {
    if (v === 'time') {
      resume();
    } else {
      pause();
    }
  },
);

// 页面加载时
onMounted(() => {
  resume();
  getClockSyncIp();
});

// 设置服务器时间
const saveCustomDate = () => {
  if (customDate.value) {
    customButtonLoading.value = true;
    modifySystemDateApi({
      systemDate: dayjs(customDate.value).toISOString(),
    })
      .then(() => {
        message.success('修改成功');
        resume();
        customButtonLoading.value = false;
      })
      .finally(() => {
        customButtonLoading.value = false;
      });
  } else {
    message.warning('请选择服务器时间!');
  }
};

// 获取IP时钟同步
const getClockSyncIp = () => {
  getClockSyncIpApi().then((res) => {
    ntpForm.id = res.id;
    ntpForm.ip = res.ip;
  });
};

// 设置IP时钟同步
const saveNpt = () => {
  ntpFormRef.value?.validateFields().then(() => {
    nptButtonLoading.value = true;
    modifyClockSyncIpApi({
      id: ntpForm.id,
      ip: ntpForm.ip,
    })
      .then(() => {
        message.success('成功');
        getClockSyncIp();
        setTimeout(() => {
          nptButtonLoading.value = false;
        }, 3000);
      })
      .finally(() => {
        nptButtonLoading.value = false;
      });
  });
};
</script>
