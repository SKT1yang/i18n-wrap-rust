import { getDocumentTitleConfig } from '../dom';

/**
 * @deprecated 已废弃，请使用 setDocumentTitle
 */
function useDocumentTitle(title?: string) {
  document.title = getDocumentTitleConfig(title);
}

export { useDocumentTitle };
