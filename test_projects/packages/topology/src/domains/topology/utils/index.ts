// 禁用浏览器默认右键菜单
function handlePreventContextmenu(e) {
  e.preventDefault()
  return false
}

export { handlePreventContextmenu }
