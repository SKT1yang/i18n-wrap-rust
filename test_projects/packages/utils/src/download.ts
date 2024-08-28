import { openWindow } from './util.ts';

/**
 * @description: base64 to blob
 */
function dataURLtoBlob(base64Buf: string): Blob {
  const arr = base64Buf.split(',');
  const typeItem = arr[0];
  const mime = typeItem.match(/:(.*?);/)![1];
  const bstr = window.atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new Blob([u8arr], { type: mime });
}

/**
 * img url to base64
 * @param url
 */
function urlToBase64(url: string, mineType?: string): Promise<string> {
  return new Promise((resolve, reject) => {
    let canvas = document.createElement('CANVAS') as HTMLCanvasElement | null;
    const ctx = canvas!.getContext('2d');

    const img = new Image();
    img.crossOrigin = '';
    img.onload = function () {
      if (!canvas || !ctx) {
        return reject();
      }
      canvas.height = img.height;
      canvas.width = img.width;
      ctx.drawImage(img, 0, 0);
      const dataURL = canvas.toDataURL(mineType || 'image/png');
      canvas = null;
      resolve(dataURL);
    };
    img.src = url;
  });
}

/**
 * Download online pictures
 * @param url
 * @param filename
 * @param mime
 * @param bom
 */
function downloadByOnlineUrl(
  url: string,
  filename: string,
  mime?: string,
  bom?: BlobPart
) {
  urlToBase64(url).then((base64) => {
    downloadByBase64(base64, filename, mime, bom);
  });
}

/**
 * Download pictures based on base64
 * @param buf
 * @param filename
 * @param mime
 * @param bom
 */
function downloadByBase64(
  buf: string,
  filename: string,
  mime?: string,
  bom?: BlobPart
) {
  const base64Buf = dataURLtoBlob(buf);
  downloadByData(base64Buf, filename, mime, bom);
}

/**
 * Download according to the background interface file stream
 * @param {*} data
 * @param {*} defaultFilename: 如果不能从 headers 中获取到文件名称，显示默认名称
 * @param {*} mime
 * @param {*} bom
 */
function downloadByData(
  data: BlobPart,
  filename: string,
  mime?: string,
  bom?: BlobPart
) {
  const blobData = typeof bom !== 'undefined' ? [bom, data] : [data];
  const blob = new Blob(blobData, { type: mime || 'application/octet-stream' });

  const blobURL = window.URL.createObjectURL(blob);
  const tempLink = document.createElement('a');
  tempLink.style.display = 'none';
  tempLink.href = blobURL;
  tempLink.setAttribute('download', filename);
  if (typeof tempLink.download === 'undefined') {
    tempLink.setAttribute('target', '_blank');
  }
  document.body.appendChild(tempLink);
  tempLink.click();
  document.body.removeChild(tempLink);
  window.URL.revokeObjectURL(blobURL);
}

/**
 * Download file according to file address
 * @param {*} sUrl
 */
function downloadByUrl({
  url,
  target = '_blank',
  fileName,
}: {
  url: string;
  target?: '_self' | '_blank';
  fileName?: string;
}): boolean {
  const isChrome =
    window.navigator.userAgent.toLowerCase().indexOf('chrome') > -1;
  const isSafari =
    window.navigator.userAgent.toLowerCase().indexOf('safari') > -1;

  if (/(iP)/g.test(window.navigator.userAgent)) {
    console.error('Your browser does not support download!');
    return false;
  }
  if (isChrome || isSafari) {
    const link = document.createElement('a');
    link.href = url;
    link.target = target;

    if (link.download !== undefined) {
      link.download =
        fileName || url.substring(url.lastIndexOf('/') + 1, url.length);
    }

    if (document.createEvent) {
      const e = document.createEvent('MouseEvents');
      e.initEvent('click', true, true);
      link.dispatchEvent(e);
      return true;
    }
  }
  if (url.indexOf('?') === -1) {
    url += '?download';
  }

  openWindow(url, { target });
  return true;
}

function blobToJson(blob: Blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    let text = '{}';
    reader.onload = () => {
      try {
        text = reader.result as string;
        const json = JSON.parse(text);
        resolve(json);
      } catch (error) {
        console.warn('解析blobToJson失败，返回原始文本');
        resolve(text);
      }
    };
    reader.onerror = reject;
    reader.readAsText(blob);
  });
}

function getMimeByFileExtension(fileExtension: `.${string}`) {
  switch (fileExtension) {
    case '.bin':
      return 'application/octet-stream';
    case '.css':
      return 'text/css';
    case '.csv':
      return 'text/csv';
    case '.doc':
      return 'application/msword';
    case '.docx':
      return 'application/vnd.openxmlformats-officedocument.wordprocessingml.docment';
    case '.gif':
      return 'image/gif';
    case '.jpg':
      return 'image/jpg';
    case '.jpeg':
      return 'image/jpeg';
    case '.js':
      return 'text/javascript';
    case '.json':
      return 'application/json';
    case '.txt':
      return 'text/plain';
    case '.xls':
      return 'application/vnd.msexcel';
    case '.xlsx':
      return 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
    default:
      return 'application/octet-stream';
  }
}

export {
  dataURLtoBlob,
  urlToBase64,
  downloadByOnlineUrl,
  downloadByBase64,
  downloadByData,
  downloadByUrl,
  getMimeByFileExtension,
  blobToJson,
};