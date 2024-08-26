import iconsBase from '@iconify-icons/base';
const { icons, width, height } = iconsBase;
const map = {
  0: 'other',
  1: 'plc',
  2: 'dcs',
  3: 'host',
  4: 'hmi',
  5: 'gateway',
  6: 'opc-server',
  7: 'opc-client',
  8: 'switch',
  9: 'router',
  10: 'network-audit',
  11: 'firewall',
  12: 'intrusion-detection',
  13: 'gap',
  14: 'camera',
  15: 'camera-platform',
  16: 'controller-monitor',
  17: 'sis',
  18: 'smart-meter',
  19: 'controller-protection',
  20: 'operation-audit',
  21: 'database-audit',
  22: 'log-analysis',
  23: 'one-way-input',
  24: 'management-platform',
  25: 'server',
  26: 'ethernet-io',
  27: 'control-isolation',
  28: 'threats-tracing',
  29: 'vulnerability-scan',
  30: 'workstation',
  31: 'operator-station',
  32: 'industrial-gateway',
  33: 'frequency-transformer',
  34: 'wireless-bridge',
  35: 'rtu',
  36: 'ntp-server',
  37: 'asset-monitor',
  38: 'secure-isolation',
  39: 'situation-awareness',
  40: 'flow-simulation',
  41: 'vulnerability-mining',
  42: 'video-recorder',
  43: 'host-platform',
  44: 'operator-station',
  99: 'public-cloud',
};

let ObjectURLMap = new Map();

function getProductImageByAssetTypeCode(
  assetTypeCode: number,
  opiton: Option = {
    urlType: 'base64',
  }
) {
  // 1. 已经生成过url直接返回
  const key = buildMapKey(assetTypeCode, opiton);
  if (assetTypeCode !== undefined && ObjectURLMap.get(key)) {
    return urlHandler(ObjectURLMap.get(key), opiton);
  }

  // 2. 生成svg 字符串
  const { color } = opiton || {};
  // @ts-ignore
  let svgString = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">${
    // @ts-ignore
    icons[map[assetTypeCode]].body
  }</svg>`;
  if (color && typeof color === 'string') {
    svgString = svgString.replace('currentColor', color);
  }

  // 3. 生成原始url，并缓存
  let url = buildUrl(svgString, opiton);
  if (!ObjectURLMap.has(key)) {
    ObjectURLMap.set(key, url);
  }

  // 4. 返回后置处理过的url
  return urlHandler(url, opiton);
}

function buildUrl(svgString: string, opiton?: Option) {
  const { urlType = 'base64' } = opiton || {};
  if (urlType === 'objectUrl') {
    const blob = new Blob([svgString], {
      type: 'image/svg+xml',
    });
    let url = URL.createObjectURL(blob);

    return url;
  } else {
    return `data:image/svg+xml;base64,${globalThis.btoa(svgString)}`;
  }
}

/**
 * 原始url 后置处理
 * @param url 原始url
 * @param opiton
 * @returns
 */
function urlHandler(url: string, opiton?: Option) {
  const { purpose } = opiton || {};
  if (purpose && purpose === 'echarts') {
    return `image://${url}`;
  } else {
    return url;
  }
}

/**
 * 生成缓存key
 * @param assetTypeCode
 * @param opiton
 * @returns
 */
function buildMapKey(assetTypeCode: number, opiton?: Option) {
  const { color, urlType } = opiton || {};
  return `${assetTypeCode}-${color || 'currentColor'}-${urlType}`;
}

function _getObjectURLMap() {
  return ObjectURLMap;
}

type Option = {
  color?: string;
  purpose?: 'echarts';
  urlType?: 'objectUrl' | 'base64';
};

const RUN_STATUS_MAP = {
  0: '#ff4d4f',
  1: '#1677ff',
  2: '#faad14',
};

export {
  icons as baseIcons,
  getProductImageByAssetTypeCode,
  _getObjectURLMap,
  RUN_STATUS_MAP,
};
