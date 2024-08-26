<!--
 * @name: Do not edit
 * @description: Do not edit
 * @date: 2023-09-14 19:44:26
 * @path: \reports\test\pages\ReportsListPage.vue
-->
<template>
    <div class="p-4">
        <ReportsList :hidden-features="['month-report', 'year-report']" />
    </div>
</template> 
<script lang="ts" setup>
import { ReportsList } from '@/index'
</script>