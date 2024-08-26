/*
 * @Name: Do not edit
 * @Description: Do not edit
 * @Author: ygd
 * @Date: 2022-06-01 19:41:19
 * @LastEditTime: 2023-08-16 16:57:05
 * @LastEditors: Please set LastEditors
 */
import { Grid, SnapLine, ToolBar, Minimap } from '@antv/g6'
export default () => {
  const plugins: any = []
  const grid = new Grid({
    img: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB2ZXJzaW9uPSIxLjEiIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiPjxkZWZzPjxwYXR0ZXJuIGlkPSJwYXR0ZXJuXzAiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiIHg9IjAiIHk9IjAiIHdpZHRoPSIxMCIgaGVpZ2h0PSIxMCI+PHJlY3Qgd2lkdGg9IjEiIGhlaWdodD0iMSIgcng9IjEiIHJ5PSIxIiBmaWxsPSIjYWFhYWFhIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI3BhdHRlcm5fMCkiLz48L3N2Zz4=',
  })

  // const toolbar = new ToolBar({
  //   position: {
  //     x: 5,
  //     y: 5,
  //   },
  // })

  plugins.push(grid, new SnapLine())
  return plugins
}
