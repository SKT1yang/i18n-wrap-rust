
<template>
  <modal :title="title" v-model:visible="dialogVisible" :width="1200">
    <form :model="dataForm" :rules="rules" ref="formRef" @finish="handleSubmit" :label-col="{ span: 6 }">
      <tabs v-model:active-key="activeName">
        <tabpane :tab="t('基础配置')" key="basic">
          <div class="grid grid-cols-2 gap-x-4">
            <formitem name="name" label="name:">
              <input v-model:value="dataForm.name" allowclear :placeholder="t('请输入路由的唯一标识name')" />
            </formitem>
            <formitem name="path" label="path:">
              <input v-model:value="dataForm.path" allowclear :placeholder="t('路由本身路径,不包含子路径,如:asset')" />
            </formitem>
            <formitem name="component" label="component:">
              <input v-model:value="dataForm.component" allowclear :placeholder="t('请输入页面组件路径')" />
            </formitem>
            <formitem name="title" :label="t('菜单名称:')">
              <input v-model:value="dataForm.title" allowclear :placeholder="t('请输入菜单名称')" />
            </formitem>
            <formitem name="icon" :label="t('图标:')">
              <input v-model:value="dataForm.icon" allowclear :placeholder="t('请输入图标')" />
            </formitem>
            <formitem name="orderNo" :label="t('序号:')">
              <inputnumber v-model:value="dataForm.orderNo" allowclear :min="1" :placeholder="t('请输入序号')">
            </inputnumber></formitem>
            <formitem name="hideMenu" :label="t('是否隐藏:')">
              <switch v-model:checked="dataForm.hideMenu">
            </switch></formitem>
          </div>
        </tabpane>
        <tabpane :tab="t('深度配置')" key="advance">
          <div class="grid grid-cols-2 gap-x-4">
            <formitem name="redirect" label="redirect:">
              <input v-model:value="dataForm.redirect" allowclear :placeholder="t('请输入重定向完整路径')" />
            </formitem>
            <formitem name="props" label="props:">
              <input v-model:value="dataForm.props" allowclear :placeholder="t('请输入页面组件配置数据')" />
            </formitem>
            <formitem name="dynamicLevel" :label="t('动态路由等级:')">
              <inputnumber v-model="dataForm.dynamicLevel" allowclear :min="1" :placeholder="t('请输入页面组件路径')">
            </inputnumber></formitem>
            <formitem name="realPath" :label="t('真实路径:')">
              <input v-model:value="dataForm.realPath" allowclear :placeholder="t('请输入真实路径（为了性能）')" />
            </formitem>
            <formitem name="fullPath" :label="t('全路径:')">
              <input v-model:value="dataForm.fullPath" allowclear :placeholder="t('请输入全路径(包含协议、域名、hash等完整路径)')" />
            </formitem>
            <formitem name="transitionName" :label="t('页面过渡动画:')">
              <input v-model:value="dataForm.transitionName" allowclear :placeholder="t('请输入页面过渡动画')" />
            </formitem>
            <formitem name="currentActiveMenu" :label="t('当前激活组件:')">
              <input v-model:value="dataForm.currentActiveMenu" allowclear :placeholder="t('请输入当前激活组件')" />
            </formitem>
            <formitem name="hasChildClick" :label="t('自定义重定向路径:')">
              <input v-model:value="dataForm.hasChildClick" allowclear :placeholder="t('请输入自定义重定向路径')" />
            </formitem>
            <formitem name="frameSrc" :label="t('frame页面src:')">
              <input v-model:value="dataForm.frameSrc" allowclear :placeholder="t('请输入自定义重定向路径')" />
            </formitem>
          </div>

          <div class="grid grid-cols-2">
            <formitem name="carryParam" :label="t('是否带参:')">
              <switch v-model:checked="dataForm.carryParam">
            </switch></formitem>
            <formitem name="ignoreRoute" :label="t('是否忽略路由:')">
              <switch v-model:checked="dataForm.ignoreRoute">
            </switch></formitem>
            <formitem name="ignoreAuth" :label="t('是否忽略鉴权:')">
              <switch v-model:checked="dataForm.ignoreAuth">
            </switch></formitem>
            <formitem name="single" :label="t('标记顶级路由:')">
              <switch v-model:checked="dataForm.single">
            </switch></formitem>
            <formitem name="hideBreadcrumb" :label="t('是否显示面包屑:')">
              <switch v-model:checked="dataForm.hideBreadcrumb">
            </switch></formitem>
            <formitem name="ignoreKeepAlive" :label="t('是否忽略页面缓存:')">
              <switch v-model:checked="dataForm.ignoreKeepAlive">
            </switch></formitem>
            <formitem name="affix" :label="t('是否tab固定:')">
              <switch v-model:checked="dataForm.affix">
            </switch></formitem>
            <formitem name="hideChildrenInMenu" :label="t('隐藏子页面路由:')">
              <switch v-model:checked="dataForm.hideChildrenInMenu">
            </switch></formitem>
            <formitem name="hideTab" :label="t('是否在tab上显示:')">
              <switch v-model:checked="dataForm.hideTab">
            </switch></formitem>
            <formitem name="isLink" :label="t('是否是三方链接页面:')">
              <switch v-model:checked="dataForm.isLink">
            </switch></formitem>
            <formitem name="hidePathForChildren" :label="t('路由隐藏子路径:')">
              <switch v-model:checked="dataForm.hidePathForChildren">
            </switch></formitem>
            <formitem name="subNavigator" :label="t('子系统路由:')">
              <switch v-model:checked="dataForm.subNavigator">
            </switch></formitem>
            <formitem name="monitorBehavior" :label="t('是否检测用户行为:')">
              <switch v-model:checked="dataForm.monitorBehavior">
            </switch></formitem>
          </div>
        </tabpane>
      </tabs>
    </form>

    <template #footer>
      <div class="space-x-5">
        <button @click="closeModal">{{ t("取消") }}</button>
        <button type="primary" @click="handleSubmit" html-type="submit">{{ t("确定") }}</button>
      </div>
    </template>
  </modal>
</template>
