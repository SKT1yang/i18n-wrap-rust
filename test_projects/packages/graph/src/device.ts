/*-
 * @Name: 公司产品图片处理函数
 * @Description: 只有png和svg两种
 * @Author: ygd
 * @Date: 2022-05-24 11:06:12
 * @LastEditTime: 2023-09-14 19:55:56
 * @LastEditors: Please set LastEditors
 */
import { Type, Status, Purpose } from "./types";
// 0-其他
import otherNormal from "./device/0/other-normal.png";
import otherYellow from "./device/0/other-yellow.png";
import otherRed from "./device/0/other-red.png";
import other from "./device/0/other-normal.svg";
// 1-PLC
import plcNormal from "./device/1/plc-normal.png";
import plcYellow from "./device/1/plc-yellow.png";
import plcrRed from "./device/1/plc-red.png";
import plc from "./device/1/plc-normal.svg";
// 2-DCS
import dcsNormal from "./device/2/dcs-normal.png";
import dcsYellow from "./device/2/dcs-yellow.png";
import dcsRed from "./device/2/dcs-red.png";
import dcs from "./device/2/dcs-normal.svg";
// 3-主机
import hostNormal from "./device/3/host-normal.png";
import hostYellow from "./device/3/host-yellow.png";
import hostRed from "./device/3/host-red.png";
import host from "./device/3/host-normal.svg?url";
// 4-HMI
import hmiNormal from "./device/4/hmi-normal.png";
import hmiYellow from "./device/4/hmi-yellow.png";
import hmiRed from "./device/4/hmi-red.png";
import hmi from "./device/4/hmi-normal.svg";
// 5-安全网关
import gatewayNormal from "./device/5/gateway-normal.png";
import gatewayYellow from "./device/5/gateway-yellow.png";
import gatewayRed from "./device/5/gateway-red.png";
import gateway from "./device/5/gateway-normal.svg";
// 6-OPC 服务器
import opcServerNormal from "./device/6/opc-server-normal.png";
import opcServerYellow from "./device/6/opc-server-yellow.png";
import opcServerRed from "./device/6/opc-server-red.png";
import opcServer from "./device/6/opc-server-normal.svg";
// 7-OPC 客户端
import opcClientNormal from "./device/7/opc-client-normal.png";
import opcClientYellow from "./device/7/opc-client-yellow.png";
import opcClientRed from "./device/7/opc-client-red.png";
import opcClient from "./device/7/opc-client-normal.svg";
// 8-交换机
import switchNormal from "./device/8/switch-normal.png";
import switchYellow from "./device/8/switch-yellow.png";
import switchRed from "./device/8/switch-red.png";
import switchSvg from "./device/8/switch-normal.svg";
// 9-路由器
import routerNormal from "./device/9/router-normal.png";
import routerYellow from "./device/9/router-yellow.png";
import routerRed from "./device/9/router-red.png";
import router from "./device/9/router-normal.svg";
// 10-网络审计
import networkAuditNormal from "./device/10/network-audit-normal.png";
import networkAuditYellow from "./device/10/network-audit-yellow.png";
import networkAuditRed from "./device/10/network-audit-red.png";
import networkAudit from "./device/10/network-audit-normal.svg";
// 11-防火墙
import firewallNormal from "./device/11/firewall-normal.png";
import firewallYellow from "./device/11/firewall-yellow.png";
import firewallRed from "./device/11/firewall-red.png";
import firewall from "./device/11/firewall-normal.svg";
// 12-入侵检测
import intrusionDetectionNormal from "./device/12/intrusion-detection-normal.png";
import intrusionDetectionYellow from "./device/12/intrusion-detection-yellow.png";
import intrusionDetectionRed from "./device/12/intrusion-detection-red.png";
import intrusionDetection from "./device/12/intrusion-detection-normal.svg";
// 13-网闸
import gapNormal from "./device/13/gap-normal.png";
import gapYellow from "./device/13/gap-yellow.png";
import gapRed from "./device/13/gap-red.png";
import gap from "./device/13/gap-normal.svg";
// 14-摄像头
import cameraNormal from "./device/14/camera-normal.png";
import cameraYellow from "./device/14/camera-yellow.png";
import cameraRed from "./device/14/camera-red.png";
import camera from "./device/14/camera-normal.svg";
// 15-视频监控平台
import cameraPlatformNormal from "./device/15/camera-platform-normal.png";
import cameraPlatformYellow from "./device/15/camera-platform-yellow.png";
import cameraPlatformRed from "./device/15/camera-platform-red.png";
import cameraPlatform from "./device/15/camera-platform-normal.svg";
// 16-控制器监测与恢复
import controllerMonitorNormal from "./device/16/controller-monitor-normal.png";
import controllerMonitorYellow from "./device/16/controller-monitor-yellow.png";
import controllerMonitorRed from "./device/16/controller-monitor-red.png";
import controllerMonitor from "./device/16/controller-monitor-normal.svg";
// 17-SIS
import sisNormal from "./device/17/sis-normal.png";
import sisYellow from "./device/17/sis-yellow.png";
import sisRed from "./device/17/sis-red.png";
import sis from "./device/17/sis-normal.svg";
// 18-智能仪表
import smartMeterNormal from "./device/18/smart-meter-normal.png";
import smartMeterYellow from "./device/18/smart-meter-yellow.png";
import smartMeterRed from "./device/18/smart-meter-red.png";
import smartMeter from "./device/18/smart-meter-normal.svg";
// 19-控制器防护
import controllerProtectionNormal from "./device/19/controller-protection-normal.png";
import controllerProtectionYellow from "./device/19/controller-protection-yellow.png";
import controllerProtectionRed from "./device/19/controller-protection-red.png";
import controllerProtection from "./device/19/controller-protection-normal.svg";
// 20-运维审计
import operationAuditNormal from "./device/20/operation-audit-normal.png";
import operationAuditYellow from "./device/20/operation-audit-yellow.png";
import operationAuditRed from "./device/20/operation-audit-red.png";
import operationAudit from "./device/20/operation-audit-normal.svg";
// 21-数据库审计
import databaseAuditNormal from "./device/21/database-audit-normal.png";
import databaseAuditYellow from "./device/21/database-audit-yellow.png";
import databaseAuditRed from "./device/21/database-audit-red.png";
import databaseAudit from "./device/21/database-audit-normal.svg";
// 22-日志分析
import logAnalysisNormal from "./device/22/log-analysis-normal.png";
import logAnalysisYellow from "./device/22/log-analysis-yellow.png";
import logAnalysisRed from "./device/22/log-analysis-red.png";
import logAnalysis from "./device/22/log-analysis-normal.svg";
// 23-单导
import oneWayInputNormal from "./device/23/one-way-input-normal.png";
import oneWayInputYellow from "./device/23/one-way-input-yellow.png";
import oneWayInputRed from "./device/23/one-way-input-red.png";
import oneWayInput from "./device/23/one-way-input-normal.svg";
// 24-安全管理平台
import managementPlatformNormal from "./device/24/management-platform-normal.png";
import managementPlatformYellow from "./device/24/management-platform-yellow.png";
import managementPlatformRed from "./device/24/management-platform-red.png";
import managementPlatform from "./device/24/management-platform-normal.svg";
// 25-服务器
import serverNormal from "./device/25/server-normal.png";
import serverYellow from "./device/25/server-yellow.png";
import serverRed from "./device/25/server-red.png";
import server from "./device/25/server-normal.svg";
// 26-以太网IO模块
import ethernetIoNormal from "./device/26/ethernet-io-normal.png";
import ethernetIoYellow from "./device/26/ethernet-io-yellow.png";
import ethernetIoRed from "./device/26/ethernet-io-red.png";
import ethernetIo from "./device/26/ethernet-io-normal.svg";
// 27-管控隔离装置
import controlIsolationNormal from "./device/27/control-isolation-normal.png";
import controlIsolationYellow from "./device/27/control-isolation-yellow.png";
import controlIsolationRed from "./device/27/control-isolation-red.png";
import controlIsolation from "./device/27/control-isolation-normal.svg";
// 28-威胁溯源
import threatsTracingNormal from "./device/28/threats-tracing-normal.png";
import threatsTracingYellow from "./device/28/threats-tracing-yellow.png";
import threatsTracingRed from "./device/28/threats-tracing-red.png";
import threatsTracing from "./device/28/threats-tracing-normal.svg";
// 29-漏洞扫描
import vulnerabilityScanNormal from "./device/29/vulnerability-scan-normal.png";
import vulnerabilityScanYellow from "./device/29/vulnerability-scan-yellow.png";
import vulnerabilityScanRed from "./device/29/vulnerability-scan-red.png";
import vulnerabilityScan from "./device/29/vulnerability-scan-normal.svg";
// 30-工作站
import workstationNormal from "./device/30/workstation-normal.png";
import workstationYellow from "./device/30/workstation-yellow.png";
import workstationRed from "./device/30/workstation-red.png";
import workstation from "./device/30/workstation-normal.svg";
// 31-操作员站
import operatorStationNormal from "./device/31/operator-station-normal.png";
import operatorStationYellow from "./device/31/operator-station-yellow.png";
import operatorStationRed from "./device/31/operator-station-red.png";
import operatorStation from "./device/31/operator-station-normal.svg";
// 32-工业网关
import industrialGatewayNormal from "./device/32/industrial-gateway-normal.png";
import industrialGatewayYellow from "./device/32/industrial-gateway-yellow.png";
import industrialGatewayRed from "./device/32/industrial-gateway-red.png";
import industrialGateway from "./device/32/industrial-gateway-normal.svg";
// 33-变频器
import frequencyTransformerNormal from "./device/33/frequency-transformer-normal.png";
import frequencyTransformerYellow from "./device/33/frequency-transformer-yellow.png";
import frequencyTransformerRed from "./device/33/frequency-transformer-red.png";
import frequencyTransformer from "./device/33/frequency-transformer-normal.svg";
// 34-无线网桥
import wirelessBridgeNormal from "./device/34/wireless-bridge-normal.png";
import wirelessBridgeYellow from "./device/34/wireless-bridge-yellow.png";
import wirelessBridgeRed from "./device/34/wireless-bridge-red.png";
import wirelessBridge from "./device/34/wireless-bridge-normal.svg";
// 35-RTU
import rtuNormal from "./device/35/rtu-normal.png";
import rtuYellow from "./device/35/rtu-yellow.png";
import rtuRed from "./device/35/rtu-red.png";
import rtu from "./device/35/rtu-normal.svg";
// 36-NTP服务器
import ntpServerNormal from "./device/36/ntp-server-normal.png";
import ntpServerYellow from "./device/36/ntp-server-yellow.png";
import ntpServerRed from "./device/36/ntp-server-red.png";
import ntpServer from "./device/36/ntp-server-normal.svg";
// 37-资产监测
import assetMonitorNormal from "./device/37/asset-monitor-normal.png";
import assetMonitorYellow from "./device/37/asset-monitor-yellow.png";
import assetMonitorRed from "./device/37/asset-monitor-red.png";
import assetMonitor from "./device/37/asset-monitor-normal.svg";
// 38-安全隔离
import secureIsolationNormal from "./device/38/secure-isolation-normal.png";
import secureIsolationYellow from "./device/38/secure-isolation-yellow.png";
import secureIsolationRed from "./device/38/secure-isolation-red.png";
import secureIsolation from "./device/38/secure-isolation-normal.svg";
// 39-态势感知
import situationAwarenessNormal from "./device/39/situation-awareness-normal.png";
import situationAwarenessYellow from "./device/39/situation-awareness-yellow.png";
import situationAwarenessRed from "./device/39/situation-awareness-red.png";
import situationAwareness from "./device/39/situation-awareness-normal.svg";
// 40-流量模拟
import flowSimulationNormal from "./device/40/flow-simulation-normal.png";
import flowSimulationYellow from "./device/40/flow-simulation-yellow.png";
import flowSimulationRed from "./device/40/flow-simulation-red.png";
import flowSimulation from "./device/40/flow-simulation-normal.svg";
// 41-漏洞挖掘
import vulnerabilityMiningNormal from "./device/41/vulnerability-mining-normal.png";
import vulnerabilityMiningYellow from "./device/41/vulnerability-mining-yellow.png";
import vulnerabilityMiningRed from "./device/41/vulnerability-mining-red.png";
import vulnerabilityMining from "./device/41/vulnerability-mining-normal.svg";
// 42-录像机
import videoRecorderNormal from "./device/42/video-recorder-normal.png";
import videoRecorderYellow from "./device/42/video-recorder-yellow.png";
import videoRecorderRed from "./device/42/video-recorder-red.png";
import videoRecorder from "./device/42/video-recorder-normal.svg";
// 43-主机卫士管理平台
import hostPlatformNormal from "./device/43/host-platform-normal.png";
import hostPlatformYellow from "./device/43/host-platform-yellow.png";
import hostPlatformRed from "./device/43/host-platform-red.png";
import hostPlatform from "./device/43/host-platform-normal.svg";
// 99-共有云（非资产类型）
import publicCloudNormal from "./device/99/public-cloud-normal.png";
import publicCloudYellow from "./device/99/public-cloud-yellow.png";
import publicCloudRed from "./device/99/public-cloud-red.png";
import publicCloud from "./device/99/public-cloud-normal.svg";

/**
 * 根据资产状态获取图片路径
 * @param assetTypeCode 资产类型
 * @param status 图片颜色状态
 * @param option 配置项
 * @returns
 */
function getProductImageByAssetTypeCode(
  assetTypeCode: number,
  opiton?: {
    type: Type;
    status?: Status;
    purpose?: Purpose;
    whiteBg?: boolean;
  }
) {
  const { type = "svg", status = "normal", purpose } = opiton || {};
  let url = "";
  switch (assetTypeCode) {
    // 其他
    case 0:
      if (type === "svg") {
        url = other;
      }
      if (type === "png") {
        url = getImageByStatus(status, otherNormal, otherYellow, otherRed);
      }
      break;
    // PLC
    case 1:
      if (type === "svg") {
        url = plc;
      }
      if (type === "png") {
        url = getImageByStatus(status, plcNormal, plcYellow, plcrRed);
      }
      break;
    // DCS
    case 2:
      if (type === "svg") {
        url = dcs;
      }
      if (type === "png") {
        url = getImageByStatus(status, dcsNormal, dcsYellow, dcsRed);
      }
      break;
    // 主机
    case 3:
      if (type === "svg") {
        url = host;
      }
      if (type === "png") {
        url = getImageByStatus(status, hostNormal, hostYellow, hostRed);
      }
      break;
    // HMI
    case 4:
      if (type === "svg") {
        url = hmi;
      }
      if (type === "png") {
        url = getImageByStatus(status, hmiNormal, hmiYellow, hmiRed);
      }
      break;
    // 安全网关
    case 5:
      if (type === "svg") {
        url = gateway;
      }
      if (type === "png") {
        url = getImageByStatus(
          status,
          gatewayNormal,
          gatewayYellow,
          gatewayRed
        );
      }
      break;
    // OPC 服务器
    case 6:
      if (type === "svg") {
        url = opcServer;
      }
      if (type === "png") {
        url = getImageByStatus(
          status,
          opcServerNormal,
          opcServerYellow,
          opcServerRed
        );
      }
      break;
    // OPC 客户端
    case 7:
      if (type === "svg") {
        url = opcClient;
      }
      if (type === "png") {
        url = getImageByStatus(
          status,
          opcClientNormal,
          opcClientYellow,
          opcClientRed
        );
      }
      break;
    // 交换机
    case 8:
      if (type === "svg") {
        url = switchSvg;
      }
      if (type === "png") {
        url = getImageByStatus(status, switchNormal, switchYellow, switchRed);
      }
      break;
    // 路由器
    case 9:
      if (type === "svg") {
        url = router;
      }
      if (type === "png") {
        url = getImageByStatus(status, routerNormal, routerYellow, routerRed);
      }
      break;
    // 网络审计
    case 10:
      if (type === "svg") {
        url = networkAudit;
      }
      if (type === "png") {
        url = getImageByStatus(
          status,
          networkAuditNormal,
          networkAuditYellow,
          networkAuditRed
        );
      }
      break;
    // 防火墙
    case 11:
      if (type === "svg") {
        url = firewall;
      }
      if (type === "png") {
        url = getImageByStatus(
          status,
          firewallNormal,
          firewallYellow,
          firewallRed
        );
      }
      break;
    // 入侵检测
    case 12:
      if (type === "svg") {
        url = intrusionDetection;
      }
      if (type === "png") {
        url = getImageByStatus(
          status,
          intrusionDetectionNormal,
          intrusionDetectionYellow,
          intrusionDetectionRed
        );
      }
      break;
    // 网闸
    case 13:
      if (type === "svg") {
        url = gap;
      }
      if (type === "png") {
        url = getImageByStatus(status, gapNormal, gapYellow, gapRed);
      }
      break;
    // 摄像头
    case 14:
      if (type === "svg") {
        url = camera;
      }
      if (type === "png") {
        url = getImageByStatus(status, cameraNormal, cameraYellow, cameraRed);
      }
      break;
    // 视频监控平台
    case 15:
      if (type === "svg") {
        url = cameraPlatform;
      }
      if (type === "png") {
        url = getImageByStatus(
          status,
          cameraPlatformNormal,
          cameraPlatformYellow,
          cameraPlatformRed
        );
      }
      break;
    // 控制器监测与恢复
    case 16:
      if (type === "svg") {
        url = controllerMonitor;
      }
      if (type === "png") {
        url = getImageByStatus(
          status,
          controllerMonitorNormal,
          controllerMonitorYellow,
          controllerMonitorRed
        );
      }
      break;
    // SIS
    case 17:
      if (type === "svg") {
        url = sis;
      }
      if (type === "png") {
        url = getImageByStatus(status, sisNormal, sisYellow, sisRed);
      }
      break;
    // 智能仪表
    case 18:
      if (type === "svg") {
        url = smartMeter;
      }
      if (type === "png") {
        url = getImageByStatus(
          status,
          smartMeterNormal,
          smartMeterYellow,
          smartMeterRed
        );
      }
      break;
    // 控制器防护
    case 19:
      if (type === "svg") {
        url = controllerProtection;
      }
      if (type === "png") {
        url = getImageByStatus(
          status,
          controllerProtectionNormal,
          controllerProtectionYellow,
          controllerProtectionRed
        );
      }
      break;
    // 运维审计
    case 20:
      if (type === "svg") {
        url = operationAudit;
      }
      if (type === "png") {
        url = getImageByStatus(
          status,
          operationAuditNormal,
          operationAuditYellow,
          operationAuditRed
        );
      }
      break;
    // 数据库审计
    case 21:
      if (type === "svg") {
        url = databaseAudit;
      }
      if (type === "png") {
        url = getImageByStatus(
          status,
          databaseAuditNormal,
          databaseAuditYellow,
          databaseAuditRed
        );
      }
      break;
    // 日志分析
    case 22:
      if (type === "svg") {
        url = logAnalysis;
      }
      if (type === "png") {
        url = getImageByStatus(
          status,
          logAnalysisNormal,
          logAnalysisYellow,
          logAnalysisRed
        );
      }
      break;
    // 单导
    case 23:
      if (type === "svg") {
        url = oneWayInput;
      }
      if (type === "png") {
        url = getImageByStatus(
          status,
          oneWayInputNormal,
          oneWayInputYellow,
          oneWayInputRed
        );
      }
      break;
    // 安全管理平台
    case 24:
      if (type === "svg") {
        url = managementPlatform;
      }
      if (type === "png") {
        url = getImageByStatus(
          status,
          managementPlatformNormal,
          managementPlatformYellow,
          managementPlatformRed
        );
      }
      break;
    // 服务器
    case 25:
      if (type === "svg") {
        url = server;
      }
      if (type === "png") {
        url = getImageByStatus(status, serverNormal, serverYellow, serverRed);
      }
      break;
    // 以太网IO模块
    case 26:
      if (type === "svg") {
        url = ethernetIo;
      }
      if (type === "png") {
        url = getImageByStatus(
          status,
          ethernetIoNormal,
          ethernetIoYellow,
          ethernetIoRed
        );
      }
      break;
    // 管控隔离装置
    case 27:
      if (type === "svg") {
        url = controlIsolation;
      }
      if (type === "png") {
        url = getImageByStatus(
          status,
          controlIsolationNormal,
          controlIsolationYellow,
          controlIsolationRed
        );
      }
      break;
    // 威胁溯源
    case 28:
      if (type === "svg") {
        url = threatsTracing;
      }
      if (type === "png") {
        url = getImageByStatus(
          status,
          threatsTracingNormal,
          threatsTracingYellow,
          threatsTracingRed
        );
      }
      break;
    // 漏洞扫描
    case 29:
      if (type === "svg") {
        url = vulnerabilityScan;
      }
      if (type === "png") {
        url = getImageByStatus(
          status,
          vulnerabilityScanNormal,
          vulnerabilityScanYellow,
          vulnerabilityScanRed
        );
      }
      break;
    // 工作站
    case 30:
      if (type === "svg") {
        url = workstation;
      }
      if (type === "png") {
        url = getImageByStatus(
          status,
          workstationNormal,
          workstationYellow,
          workstationRed
        );
      }
      break;
    // 操作员站
    case 31:
      if (type === "svg") {
        url = operatorStation;
      }
      if (type === "png") {
        url = getImageByStatus(
          status,
          operatorStationNormal,
          operatorStationYellow,
          operatorStationRed
        );
      }
      break;
    // 工业网关
    case 32:
      if (type === "svg") {
        url = industrialGateway;
      }
      if (type === "png") {
        url = getImageByStatus(
          status,
          industrialGatewayNormal,
          industrialGatewayYellow,
          industrialGatewayRed
        );
      }
      break;
    // 变频器
    case 33:
      if (type === "svg") {
        url = frequencyTransformer;
      }
      if (type === "png") {
        url = getImageByStatus(
          status,
          frequencyTransformerNormal,
          frequencyTransformerYellow,
          frequencyTransformerRed
        );
      }
      break;
    // 无线网桥
    case 34:
      if (type === "svg") {
        url = wirelessBridge;
      }
      if (type === "png") {
        url = getImageByStatus(
          status,
          wirelessBridgeNormal,
          wirelessBridgeYellow,
          wirelessBridgeRed
        );
      }
      if (status === "normal") {
        url = wirelessBridgeNormal;
      }
      if (status === "yellow") {
        url = wirelessBridgeYellow;
      }
      if (status === "red") {
        url = wirelessBridgeRed;
      }
      break;
    // RTU
    case 35:
      if (type === "svg") {
        url = rtu;
      }
      if (type === "png") {
        url = getImageByStatus(status, rtuNormal, rtuYellow, rtuRed);
      }
      break;
    // NTP服务器
    case 36:
      if (type === "svg") {
        url = ntpServer;
      }
      if (type === "png") {
        url = getImageByStatus(
          status,
          ntpServerNormal,
          ntpServerYellow,
          ntpServerRed
        );
      }
      break;
    // 资产监测
    case 37:
      if (type === "svg") {
        url = assetMonitor;
      }
      if (type === "png") {
        url = getImageByStatus(
          status,
          assetMonitorNormal,
          assetMonitorYellow,
          assetMonitorRed
        );
      }
      break;
    // 安全隔离
    case 38:
      if (type === "svg") {
        url = secureIsolation;
      }
      if (type === "png") {
        url = getImageByStatus(
          status,
          secureIsolationNormal,
          secureIsolationYellow,
          secureIsolationRed
        );
      }
      break;
    // 态势感知
    case 39:
      if (type === "svg") {
        url = situationAwareness;
      }
      if (type === "png") {
        url = getImageByStatus(
          status,
          situationAwarenessNormal,
          situationAwarenessYellow,
          situationAwarenessRed
        );
      }
      break;
    // 流量模拟
    case 40:
      if (type === "svg") {
        url = flowSimulation;
      }
      if (type === "png") {
        url = getImageByStatus(
          status,
          flowSimulationNormal,
          flowSimulationYellow,
          flowSimulationRed
        );
      }
      break;
    // 漏洞挖掘
    case 41:
      if (type === "svg") {
        url = vulnerabilityMining;
      }
      if (type === "png") {
        url = getImageByStatus(
          status,
          vulnerabilityMiningNormal,
          vulnerabilityMiningYellow,
          vulnerabilityMiningRed
        );
      }
      break;
    // 录像机
    case 42:
      if (type === "svg") {
        url = videoRecorder;
      }
      if (type === "png") {
        url = getImageByStatus(
          status,
          videoRecorderNormal,
          videoRecorderYellow,
          videoRecorderRed
        );
      }
      break;
    // 主机卫士管理平台
    case 43:
      if (type === "svg") {
        url = hostPlatform;
      }
      if (type === "png") {
        url = getImageByStatus(
          status,
          hostPlatformNormal,
          hostPlatformYellow,
          hostPlatformRed
        );
      }
      break;

    // 99-共有云（非资产类型）
    case 99:
      if (type === "svg") {
        url = publicCloud;
      }
      if (type === "png") {
        url = getImageByStatus(
          status,
          publicCloudNormal,
          publicCloudYellow,
          publicCloudRed
        );
      }
      break;

    default:
      console.warn(`资产code${assetTypeCode}:获取图片失败，返回默认图片`);
      if (status === "normal") {
        url = otherNormal;
      }
      if (status === "yellow") {
        url = otherYellow;
      }
      if (status === "red") {
        url = otherRed;
      }
      break;
  }

  if (purpose && purpose === "echarts") {
    return `image://${url}`;
  } else {
    return url;
  }
}

function getImageByStatus(
  status: Status,
  normal: string,
  yellow: string,
  red: string
) {
  switch (status) {
    case "normal":
      return normal;
    case "yellow":
      return yellow;
    case "red":
      return red;
    default:
      return "";
  }
}

export { getProductImageByAssetTypeCode };
