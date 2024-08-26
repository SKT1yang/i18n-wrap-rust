/*
 * @name: 通用组件
 * @description: Do not edit
 */

import 'uno.css';

import { Device } from './domains/Device/index';
import EventAlarmTag from './domains/EventAlarmTag/EventAlarmTag.vue';
import type {
  EventScore,
  EventLevel,
} from './domains/EventAlarmTag/types/event';

export type { EventScore, EventLevel };
export { Device, EventAlarmTag };
