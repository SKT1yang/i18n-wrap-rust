import vueDevTools from 'vite-plugin-vue-devtools';

function createVueDevToolsPlugin() {
  return vueDevTools();
}

export { createVueDevToolsPlugin };
