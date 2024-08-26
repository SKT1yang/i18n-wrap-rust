<!--
 * @name: Do not edit
 * @description: Do not edit
 * @date: 2023-02-13 13:41:36
 * @path: \permission\src\views\Login\IsepLogin.vue
-->
<template>
  <LoginContainer class="login-bg-image">
    <LicenseForm v-if="license && !licenseStatus" />
    <LoginForm v-else />
  </LoginContainer>
</template>
<script lang="ts" setup>
import LoginForm from './LoginForm.vue'
import LoginContainer from './LoginContainer.vue'
import LicenseForm from './LicenseForm.vue';
import { usePermissionStore } from '../../model/store'
import { computed } from 'vue'

import { injectLoginContext } from '../../controller/useContext';

const { license = true } = injectLoginContext()

const store = usePermissionStore()

const licenseStatus = computed(() => store.getLicenseStatus)
</script>

<style scoped>
.login-bg-image::before {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
  background-image: url('../../assets/wave.svg');
  background-repeat: no-repeat;
  content: '';
}

.login-bg-image::after {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
  background-image: url('../../assets/login-bg-2.svg');
  background-repeat: no-repeat;
  background-size: 45%;
  background-position: 10%;
  content: '';
}
</style>

