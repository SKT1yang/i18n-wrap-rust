<template>
  <div class="space-x-2 px-2">
    <ButtonSetAssetBaseline v-if="isShowByFeature('scan::update-configuration')" />
    <ButtonDeleteAsset></ButtonDeleteAsset>
    <ButtonRetryScanAsset v-if="isShowByFeature('scan::debug-scan')" />
  </div>
</template>

<script lang='ts' setup>
import ButtonSetAssetBaseline from '@/domains/scan/views/ButtonSetAssetBaseline.vue';
import ButtonRetryScanAsset from '@/domains/scan/views/ButtonRetryScanAsset.vue';
import ButtonDeleteAsset from '@/domains/asset/views/ButtonDeleteAsset.vue'
import { isShowByFeature } from '@/entry/features/useContext.ts'
</script>