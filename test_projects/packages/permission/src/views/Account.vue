<!--
 * @Name: 用户管理
 * @Description: 用户管理
-->
<template>
  <Tabs v-model:active-key="activeKey" destroyInactiveTabPane>
    <TabPane key="User" :tab="t('用户')" v-if="props.showItems.includes('User')">
      <User />
    </TabPane>
    <TabPane key="Role" :tab="t('角色')" v-if="props.showItems.includes('Role')">
      <Role />
    </TabPane>
    <TabPane key="UsbKey" tab="USB Key" v-if="props.showItems.includes('UsbKey')">
      <UsbKey :show-items="props.showItems.includes('EmergencyLogin') ? ['EmergencyLogin'] : []" />
    </TabPane>
  </Tabs>
</template>
<script setup name="Account" lang="ts">
import { type PropType, ref } from 'vue'
import { Tabs, TabPane } from 'ant-design-vue';
import User from './User/index.vue';
import Role from './Role/index.vue';
import { UsbKey } from '@guolisec/usb-key'
import { t } from '@/languages/useLanguage'

let activeKey = ref('User');

type IncludeItem = 'User' | 'Role' | 'UsbKey' | 'EmergencyLogin'
const props = defineProps({
  showItems: {
    type: Array as PropType<IncludeItem[]>,
    default() {
      return ['User', 'Role', 'UsbKey']
    }
  }
})
</script>
