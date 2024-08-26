<template>
  <router-view>
    <template #default="{ Component, route }">
      <component :is="Component" :key="route.fullPath"></component>
    </template>
  </router-view>
</template>