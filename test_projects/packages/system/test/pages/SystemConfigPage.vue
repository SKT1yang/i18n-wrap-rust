<!--
 * @Name: 系统设置
 * @Description: 系统设置
-->
<template>
  <div class="p-4 w-full">
    <Card style="width: 100%">
      <Tabs v-model:active-key="activeKey" destroy-inactive-tab-pane>
        <TabPane key="network" tab="网络设置">
          <Interface :activeKey="activeKey" />
        </TabPane>
        <TabPane key="PlatformRemoteConfig" tab="远程管理">
          <PlatformRemoteConfig :activeKey="activeKey" />
        </TabPane>
        <TabPane key="UploadAssetGroupStructure" tab="上送资产组结构">
          <UploadAssetGroupStructure :activeKey="activeKey" />
        </TabPane>
        <TabPane key="time" tab="时间设置">
          <Ntp :activeKey="activeKey" />
        </TabPane>
        <TabPane key="remote" tab="自身安全性">
          <Remote />
        </TabPane>
        <TabPane key="threshold" tab="系统资源阈值">
          <DeviceStatusThreshold />
        </TabPane>
        <TabPane key="mail" tab="邮件告警">
          <EmailAlarm />
        </TabPane>
        <TabPane key="soundLight" tab="声光电告警">
          <SoundLightAlarm />
        </TabPane>
        <!-- <TabPane key="parameter" tab="系统参数">
          <SystemParameters />
        </TabPane> -->
        <TabPane key="log" tab="日志上送设置">
          <LogSubmitConfig />
        </TabPane>
        <TabPane key="register" tab="平台级联">
          <PlatformCascadeRegisterConfig />
        </TabPane>
      </Tabs>
    </Card>
  </div>
</template>
<script setup name="SystemConfig" lang="ts">
import { ref } from 'vue'
import { Card, Tabs, TabPane } from 'ant-design-vue';
import { SoundLightAlarm, DeviceStatusThreshold,UploadAssetGroupStructure,  Interface, Ntp, Remote, EmailAlarm, LogSubmitConfig, PlatformCascadeRegisterConfig, PlatformRemoteConfig } from '@/index';

let activeKey = ref('network');
</script>
