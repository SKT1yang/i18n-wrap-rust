<!--
 * @name: 新增/修改权限
 * @description: Do not edit
 * @date: 2023-03-07 11:01:40
 * @path: \permission\src\src\views\Permission\PermissionUpdateModal.vue
-->
<template>
  <Modal :title="title" v-model:open="dialogVisible" :width="1200">
    <Form :model="dataForm" :rules="rules" ref="formRef" :label-col="{ span: 6 }">
      <Tabs v-model:active-key="activeName">
        <TabPane tab="基础配置" key="basic">
          <div class="grid grid-cols-2 gap-x-4">
            <FormItem name="name" label="name:">
              <Input v-model:value="dataForm.name" allowClear placeholder="请输入路由的唯一标识name" />
            </FormItem>
            <FormItem name="path" label="path:">
              <Input v-model:value="dataForm.path" allowClear placeholder="路由本身路径,不包含子路径,如:asset" />
            </FormItem>
            <FormItem name="component" label="component:">
              <Input v-model:value="dataForm.component" allowClear placeholder="请输入页面组件路径" />
            </FormItem>
            <FormItem name="title" label="菜单名称:">
              <Input v-model:value="dataForm.title" allowClear placeholder="请输入菜单名称" />
            </FormItem>
            <FormItem name="icon" label="图标:">
              <Input v-model:value="dataForm.icon" allowClear placeholder="请输入图标" />
            </FormItem>
            <FormItem name="orderNo" label="序号:">
              <InputNumber v-model:value="dataForm.orderNo" allowClear :min="1" placeholder="请输入序号" />
            </FormItem>
            <FormItem name="hideMenu" label="是否隐藏:">
              <Switch v-model:checked="dataForm.hideMenu" />
            </FormItem>
          </div>
        </TabPane>
        <TabPane tab="深度配置" key="advance">
          <div class="grid grid-cols-2 gap-x-4">
            <FormItem name="redirect" label="redirect:">
              <Input v-model:value="dataForm.redirect" allowClear placeholder="请输入重定向完整路径" />
            </FormItem>
            <FormItem name="props" label="props:">
              <Input v-model:value="dataForm.props" allowClear placeholder="请输入页面组件配置数据" />
            </FormItem>
            <FormItem name="dynamicLevel" label="动态路由等级:">
              <InputNumber v-model:value="dataForm.dynamicLevel" allowClear :min="1" placeholder="请输入页面组件路径" />
            </FormItem>
            <FormItem name="realPath" label="真实路径:">
              <Input v-model:value="dataForm.realPath" allowClear placeholder="请输入真实路径（为了性能）" />
            </FormItem>
            <FormItem name="fullPath" label="全路径:">
              <Input v-model:value="dataForm.fullPath" allowClear placeholder="请输入全路径(包含协议、域名、hash等完整路径)" />
            </FormItem>
            <FormItem name="transitionName" label="页面过渡动画:">
              <Input v-model:value="dataForm.transitionName" allowClear placeholder="请输入页面过渡动画" />
            </FormItem>
            <FormItem name="currentActiveMenu" label="当前激活组件:">
              <Input v-model:value="dataForm.currentActiveMenu" allowClear placeholder="请输入当前激活组件" />
            </FormItem>
            <FormItem name="hasChildClick" label="自定义重定向路径:">
              <Input v-model:value="dataForm.hasChildClick" allowClear placeholder="请输入自定义重定向路径" />
            </FormItem>
            <FormItem name="frameSrc" label="frame页面src:">
              <Input v-model:value="dataForm.frameSrc" allowClear placeholder="请输入自定义重定向路径" />
            </FormItem>
          </div>

          <div class="grid grid-cols-2">
            <FormItem name="carryParam" label="是否带参:">
              <Switch v-model:checked="dataForm.carryParam" />
            </FormItem>
            <FormItem name="ignoreRoute" label="是否忽略路由:">
              <Switch v-model:checked="dataForm.ignoreRoute" />
            </FormItem>
            <FormItem name="ignoreAuth" label="是否忽略鉴权:">
              <Switch v-model:checked="dataForm.ignoreAuth" />
            </FormItem>
            <FormItem name="single" label="标记顶级路由:">
              <Switch v-model:checked="dataForm.single" />
            </FormItem>
            <FormItem name="hideBreadcrumb" label="是否显示面包屑:">
              <Switch v-model:checked="dataForm.hideBreadcrumb" />
            </FormItem>
            <FormItem name="ignoreKeepAlive" label="是否忽略页面缓存:">
              <Switch v-model:checked="dataForm.ignoreKeepAlive" />
            </FormItem>
            <FormItem name="affix" label="是否tab固定:">
              <Switch v-model:checked="dataForm.affix" />
            </FormItem>
            <FormItem name="hideChildrenInMenu" label="隐藏子菜单页面:" tooltip="子路由正常注册，但在菜单上不显示，只显示当前菜单，当所有子菜单都不希望在菜单显示时很好用">
              <Switch v-model:checked="dataForm.hideChildrenInMenu" />
            </FormItem>
            <FormItem name="hideTab" label="是否在tab上显示:">
              <Switch v-model:checked="dataForm.hideTab" />
            </FormItem>
            <FormItem name="isLink" label="是否是三方链接页面:">
              <Switch v-model:checked="dataForm.isLink" />
            </FormItem>
            <FormItem name="hidePathForChildren" label="路由隐藏子路径:">
              <Switch v-model:checked="dataForm.hidePathForChildren" />
            </FormItem>
            <FormItem name="subNavigator" label="子系统路由:">
              <Switch v-model:checked="dataForm.subNavigator" />
            </FormItem>
            <FormItem name="monitorBehavior" label="是否检测用户行为:">
              <Switch v-model:checked="dataForm.monitorBehavior" />
            </FormItem>
          </div>
        </TabPane>
      </Tabs>
    </Form>

    <template #footer>
      <div class="space-x-5">
        <Button @click="closeModal">取消</Button>
        <Button type="primary" @click="handleSubmit">确定</Button>
      </div>
    </template>
  </Modal>
</template>
<script setup lang="ts">
import { PropType } from 'vue';
import { Button, Form, FormItem, Input, Modal, InputNumber, Switch, Tabs, TabPane } from 'ant-design-vue'
import { usePermissionUpdate } from '../../controller/usePermission'

// 父组件传值
const props = defineProps({
  visible: {
    type: Boolean,
    required: true
  },
  current: {
    type: Object,
    default: () => { }
  },
  mode: {
    type: String as PropType<'create' | 'modify'>,
    default: 'create'
  }
});

const emit = defineEmits(['update:visible', 'refresh']);

const { dataForm, rules, dialogVisible, title, activeName, formRef, handleSubmit, closeModal } = usePermissionUpdate(props, emit)

</script>