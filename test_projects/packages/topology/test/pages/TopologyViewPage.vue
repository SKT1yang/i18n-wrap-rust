
<template>
  <MarginPageWrapper :has-margin="false" :hasBg="false">
    <TopologyView />
  </MarginPageWrapper>
</template>

<script lang='ts' setup>
import { MarginPageWrapper } from '@guolisec/permission'
import { TopologyView } from '@/index';
</script>