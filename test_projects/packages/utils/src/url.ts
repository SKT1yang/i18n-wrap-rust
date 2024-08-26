import { parse } from 'qs';

type UrlMode = 'default' | 'hash';

type UrlOptions = {
  mode: UrlMode;
};

type URLProp =
  | 'hash'
  | 'host'
  | 'hostname'
  | 'pathname'
  | 'port'
  | 'protocol'
  | 'search'
  | 'query'
  | 'path';

/**
 * 解析并处理url
 */
class Url {
  private HOST_HOLDER = 'http://0.0.0.0';
  private mode: 'default' | 'hash' = 'default';
  private url = '';
  constructor(url: string, options?: Partial<UrlOptions>) {
    const { mode = 'default' } = options || {};
    this.mode = mode;
    this.url = url;
  }
  /**
   * 替换url属性
   * @param prop 要替换的url属性
   * @param value 要替换的值
   * @param mode default：默认模式；hash：解析hash部分
   * @return 替换后的完整路径
   */
  replace(prop: URLProp, value: string, mode?: UrlMode) {
    prop = this.transformProp(prop);
    mode = mode || this.mode;
    if (mode === 'default') {
      const urlParser = new URL(this.url);
      urlParser[prop] = value;
      return urlParser.toString();
    } else {
      const urlParser = new URL(this.url);
      const hashParser = new URL(
        `${this.HOST_HOLDER}${urlParser.hash.replace('#', '')}`
      );
      hashParser[prop] = value;
      urlParser.hash = `#${hashParser
        .toString()
        .replace(this.HOST_HOLDER, '')}`;
      return urlParser.toString();
    }
  }

  /**
   * 获取url path
   * @param mode default：默认模式；hash：解析hash部分
   */
  getPath(mode?: UrlMode) {
    const parser = this.getParser(mode);
    return parser.search.split('/').slice(1);
  }

  /**
   * 获取url search
   * @param mode default：默认模式；hash：解析hash部分
   */
  getQuery(mode?: UrlMode) {
    const parser = this.getParser(mode);
    return parseSearchString(parser.search);
  }

  private getParser(mode?: UrlMode) {
    mode = mode || this.mode;
    const urlParser = new URL(this.url);
    const hashParser = new URL(
      `${this.HOST_HOLDER}${urlParser.hash.replace('#', '')}`
    );
    return mode === 'default' ? urlParser : hashParser;
  }

  /**
   * 转换成parser内部支持的prop
   * @param prop
   */
  private transformProp(prop: URLProp) {
    switch (prop) {
      case 'query':
        return 'search';
      case 'path':
        return 'pathname';
      default:
        return prop;
    }
  }
}
/**
 * 获取一个url里的查询字段，返回对象形式，空为{}
 */
function getUrlQuery() {
  return parseSearchString(location.search);
}

function parseSearchString(searchString: string) {
  return parse(searchString.substring(1));
}

function repaceBrowserUrl(url: string) {
  window.history.replaceState({}, '', url);
}

function clearBrowserUrlQuery(mode: UrlMode = 'default') {
  const urlInstance = new Url(location.href, {
    mode,
  });
  const emptyQueryUrl = urlInstance.replace('search', '');
  repaceBrowserUrl(emptyQueryUrl);
}

export {
  Url,
  getUrlQuery,
  parseSearchString,
  repaceBrowserUrl,
  clearBrowserUrlQuery,
};
