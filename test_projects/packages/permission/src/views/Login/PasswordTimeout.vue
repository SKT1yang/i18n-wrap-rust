<!--
 * @name: 密码超时机制时限
 * @description: Do not edit
-->
<template>
  <Form :model="dataForm" layout="inline" :rules="rules" @finish="handleFinish">
    <FormItem :label="`${t('密码超时机制时限')}:`" name="interval">
      <InputNumber class="w-40" v-model:value="dataForm.interval" :placeholder="`${t('请填写密码超时机制时限')}`" allowClear
        :addon-after="t('月')" />
    </FormItem>
    <div>
      <Button html-type="submit">
        {{ t('保存') }}
      </Button>
    </div>
  </Form>
</template>
<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import type { Rule } from 'ant-design-vue/es/form';
import { Button, Form, FormItem, InputNumber } from 'ant-design-vue'
import { getPasswordTime, modifyPasswordTime, logout } from '../../service/login';
import { t } from '@/languages/useLanguage'
// 表单数据
const dataForm = ref<{
  interval: number
}>({
  interval: 15,
})

const rules = ref<Record<string, Rule[]>>({
  interval: [
    {
      required: true,
      message: t('请填写密码超时机制时限'),
      trigger: 'blur',
    },
  ],
})


// 用户提交
async function handleFinish(values) {
  await modifyPasswordTime(values)
  logout(t('修改密码超时机制时限成功，请重新登录'))
}

onMounted(async () => {
  //获取超时时限
  dataForm.value.interval = await getPasswordTime()
})

</script>
