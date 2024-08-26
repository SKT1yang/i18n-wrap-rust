import { computed } from 'vue'

const getPagin = (tableObj: { current: number; pageSize: number; total: number }) =>
  computed(() => ({
    current: tableObj.current,
    showSizeChanger: true,
    defaultPageSize: tableObj.pageSize,
    total: tableObj.total,
    showQuickJumper: true,
    showTotal: () => `共${tableObj.total}条信息`
  }))

export { getPagin }
