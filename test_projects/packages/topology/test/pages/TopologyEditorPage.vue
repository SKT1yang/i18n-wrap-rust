<template>
  <MarginPageWrapper :has-margin="false" :hasBg="false">
    <TopologyEditor />
  </MarginPageWrapper>
</template>

<script lang='ts' setup>
import { MarginPageWrapper } from '@guolisec/permission'
import { TopologyEditor } from '@/index';
</script>