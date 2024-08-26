/*
 * @name: Do not edit
 * @description: Do not edit
 * @date: 2023-02-17 19:33:58
 * @path: \event\src\index.ts
 */
import "uno.css";
import Industrial from "./views/audit/Industrial/index.vue";
import It from "./views/audit/It/index.vue";
import Events from "./views/audit/Events/index.vue";
import Attack from "./views/threat/Attack/index.vue";
import threatIndustrial from "./views/threat/Industrial/index.vue";
import Host from "./views/threat/Host/index.vue";
import Network from "./views/threat/Network/index.vue";
import Associate from "./views/policy/Safety/index.vue";

export {
  // /monitor/audit/industrial 工控事件
  Industrial,
  // /monitor/audit/it it事件
  It,
  // /monitor/audit/events 事件列表
  Events,
  // /monitor/threat/attack 攻击事件
  Attack,
  // /monitor/threat/industrial 异常工控事件
  threatIndustrial,
  // /monitor/threat/host 异常主机事件
  Host,
  // /monitor/threat/network 异常网络事件
  Network,
  /**
  @description policy/safety/associate 关联事件配置 
  **/
  Associate,
};
