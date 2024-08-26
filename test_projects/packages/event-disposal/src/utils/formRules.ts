import type { Rule } from 'ant-design-vue/es/form'

const getRules = (disable): Record<string, Rule[]> => {
  return {
    ip: [
      {
        validator: async (_rule, value) => {
          if (/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(value) || !value) {
            disable.value = false
            return Promise.resolve()
          }
          disable.value = true
          return Promise.reject('填写正确的ip格式')
        }
      }
    ]
  }
}

export { getRules }
