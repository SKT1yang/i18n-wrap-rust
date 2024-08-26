<!--
 * @Name: 资产流量
 * @Description: Do not edit
-->

<template>
  <Row :gutter="20" class="min-h-190">
    <Col :span="12">
    <Card :title="t('日流量趋势')">
      <ChartFlowDay class="h-75" />
    </Card>

    </Col>
    <Col :span="12">
    <Card :title="t('时流量趋势')">
      <ChartFlowHour class="h-75" />
    </Card>
    </Col>
  </Row>
</template>

<script setup lang="ts">
import { Col, Row } from 'ant-design-vue'
import Card from '@/shared/components/Card.vue'
import ChartFlowDay from './ChartFlowDay.vue';
import ChartFlowHour from './ChartFlowHour.vue';
import { t } from '@/entry/languages/useLanguage'
</script>
