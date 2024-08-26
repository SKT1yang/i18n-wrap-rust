<!--
 * @name: Do not edit
 * @description: Do not edit
 * @date: 2023-02-22 10:52:25
 * @path: \permission\src\views\Login\LoginTimeout.vue
-->
<template>
  <Form :model="dataForm" layout="inline" :rules="rules" @finish="handleFinish" ref="formRef">
    <FormItem :label="`${t('登录超时机制时限')}:`" name="time">
      <div class="flex align-center">
        <Select class="min-w-30" v-model:value="dataForm.time" :options="timeoutOptions"
          :placeholder="`${t('单位')}:${t('分钟')}`" />
        <div class="min-w-10 leading-8 text-center">
          {{ t('分钟') }}
        </div>
      </div>
    </FormItem>
    <div>
      <Button class="w-full" html-type="submit">
        {{ t('保存') }}
      </Button>
    </div>
  </Form>
</template>
<script lang="ts" setup>
import type { FormInstance } from "ant-design-vue";
import type { Rule } from 'ant-design-vue/es/form';
import { ref, onMounted } from 'vue'
import { Button, Form, FormItem, Select } from 'ant-design-vue'
import { getLoginTime, modifyLoginTime } from '../../service/login';
import { message } from '@guolisec/toast';
import { t } from '@/languages/useLanguage'


// 表单数据
const dataForm = ref<{
  time: number
}>({
  time: 15,
})

const formRef = ref<FormInstance>();

const rules = ref<Record<string, Rule[]>>({
  time: [
    {
      required: true,
      message: t('请输入超时时间'),
      trigger: 'blur',
    },
  ],
})

// 超时机制时限列表
const timeoutOptions = ref([
  { label: '15', value: 15 },
  { label: '30', value: 30 },
  { label: '45', value: 45 },
  { label: '60', value: 60 },
  { label: '75', value: 75 },
  { label: '90', value: 90 },
  { label: '105', value: 105 },
  { label: '120', value: 120 },
]);


// 用户提交
async function handleFinish() {
  await formRef.value?.validate();
  await modifyLoginTime(dataForm.value)
  message.success(t('修改成功'));
  await getTime()
}

//获取超时时限
async function getTime() {
  dataForm.value.time = await getLoginTime()
}

onMounted(async () => {
  getTime()
})

</script>
