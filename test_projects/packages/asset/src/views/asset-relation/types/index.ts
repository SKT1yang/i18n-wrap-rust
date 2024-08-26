/*
 * @Name: Do not edit
 * @Description: Do not edit
 * @Author: ygd
 * @Date: 2022-04-07 18:21:53
 * @LastEditTime: 2023-09-19 10:11:58
 * @LastEditors: Please set LastEditors
 */

import type dayjs from "dayjs";
export interface RelationInfo {
  dialogIp: string | string[]; // 弹窗需要的ip
  dialogDate: dayjs.Dayjs; // 弹窗需要的时间
  relationshipChartWidth: number; // echarts的高度
  dialogType: string; // 弹窗的类型
  isIcp: "0" | "1"; // 判断该条资产关系的协议是否属于工控协议，1---属于；0---不属于
}
