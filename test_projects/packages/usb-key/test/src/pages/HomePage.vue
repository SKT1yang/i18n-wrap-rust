<!--
 * @name: 首页
 * @description: 404 not found
-->

<template>
  <div class="m-2 i-base-delete">
    <UsbKey />
    <!-- 用户绑定subkey弹窗 -->
    <ModalUsbKeyBindUser
      v-model:visible="bindVsible"
      type="bind"
      :record="current"
      @refresh="getBindRelation"
    />
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { UsbKey, ModalUsbKeyBindUser, useGetBindRelation, enumSnList } from '../../../src'

const { bindedUsernameList, getBindRelation } = useGetBindRelation()

const current = ref()
const bindVsible = ref(false)
</script>
