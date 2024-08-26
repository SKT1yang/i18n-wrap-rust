<script lang="tsx">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'Tsx',
  setup() {
    const a = 1
    console.log(__APP_GLOBAL_ROUTER_INSTANCE_)
    return () => {
      return <div></div>
    }
  }
})
</script>
<style scoped></style>

