<!--
 * @name: 数据转储
 * @description: 数据备份
 * @date: 2023-10-10 08:50:26
 * @path: \front\data-backup\src\views\DataDump.vue
-->
<template>
    <div>
        <Card style="width: 420px">
            <template #title>
                <span class="text-sm font-medium ">磁盘使用率超过阈值时进行数据转储</span>
            </template>
            <template #extra>
                <Switch v-model:checked="ftpStatus" :checked-value="1" :un-checked-value="0"
                    @change="(checked) => { handleSetFtpStatus(checked) }"></Switch>
            </template>
            <Form :model="formData" :label-col="{ style: { width: '110px' } }" :rules="rules" ref="formRef">
                <FormItem label="服务器地址" name="host">
                    <Input v-model:value.trim="formData.host" :maxlength="24" placeholder="FTP 服务器的 IP 地址"
                        :disabled="isEditButton" allow-clear />
                </FormItem>
                <FormItem label="服务器端口" name="port">
                    <Input v-model:value.trim="formData.port" :maxlength="24" placeholder="FTP 服务器的端口"
                        :disabled="isEditButton" allow-clear />
                </FormItem>
                <FormItem label="用户名" name="userName">
                    <Input v-model:value.trim="formData.userName" :maxlength="24" placeholder="用于登录 FTP 服务器的用户名"
                        :disabled="isEditButton" allow-clear />
                </FormItem>
                <FormItem label="密码" name="password">
                    <InputPassword v-model:value.trim="formData.password" :maxlength="24" placeholder="用户名对应的密码"
                        :disabled="isEditButton" allow-clear />
                </FormItem>
                <FormItem :wrapper-col="{ style: { textAlign: 'right' } }">
                    <Button type="primary" :loading="saveButtonLoading" @click="handleButtonTypeChange">
                        {{ isEditButton ? "编辑" : "应用" }}
                    </Button>
                </FormItem>
            </Form>
        </Card>
    </div>
</template>

<script lang="ts" setup>
import { Form, FormItem, Input, Button, InputPassword, Card, Switch } from 'ant-design-vue'
import { useDataDump } from '../controller/useDataDump'

const {
    formRef,
    formData,
    rules,
    saveButtonLoading,
    ftpStatus,
    handleSetFtpStatus,
    isEditButton,
    handleButtonTypeChange
} = useDataDump()
</script>