import { computed, reactive } from "vue"

const getPagin = () => {
  const tableObj = reactive<{ list: any[], current: number, pageSize: number, total: number, sort?: string }>({ list: [], current: 1, pageSize: 10, total: 0, sort: undefined })
  return {
    tableData: tableObj,
    pagin: computed(() => ({
      current: tableObj.current,
      showSizeChanger: true,
      defaultPageSize: tableObj.pageSize,
      total: tableObj.total > 10000 ? 10000 : tableObj.total,
      showQuickJumper: true,
      showTotal: () => (tableObj.total > 10000
        ? `命中 ${tableObj.total} 条, 展示10000条`
        : `共 ${tableObj.total} 条`),
    }))
  }
}

export { getPagin }