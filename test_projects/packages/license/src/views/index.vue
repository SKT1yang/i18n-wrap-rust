<!--
 * @name: 授权管理
 * @description: Do not edit
 * @date: 2023-10-20 15:31:54
 * @path: \front\license\src\views\index.vue
-->
<template>
    <div class="mb-4">
        <template v-if="Boolean(machineCode)">
            <span>机器码：</span>
            <span class="ml-2 text-sm">
                {{ machineCode }}
            </span>
        </template>
        <template v-else>
            <Button @click="getMachineCodeData">生成机器码</Button>
        </template>
    </div>
    <div class="license-upgrade  grid grid-cols-3 gap-4">
        <LicenseItem v-for="item in licenseData" :data="item" :key="item.licenseModule" />
    </div>
</template>   

<script setup lang="ts">
/* 类型文件 */
/* 第三方模块 */
import { Button } from 'ant-design-vue'
/* 本地共享模块 */
/* 业务模块 */
import LicenseItem from './LicenseItem.vue';
import { useLicense } from '../controller/useLicense'

const { licenseData, machineCode, getMachineCodeData } = useLicense()
</script>