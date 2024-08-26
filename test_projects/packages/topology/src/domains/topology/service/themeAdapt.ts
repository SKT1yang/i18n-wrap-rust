import { cssVar } from '@guolisec/utils';

function getEdgeColor(active: boolean) {
  if (active) {
    return cssVar('--blue');
  } else {
    return cssVar('--color-text-base');
  }
}

export { getEdgeColor };
