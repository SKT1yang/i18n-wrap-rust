/*
 * @Name: Do not edit
 * @Description: Do not edit
 */
import { SHAPE_TYPE } from '../../types/enum';
import { cssVar, getProductImageByAssetTypeCode } from '@guolisec/utils';

// 正方节点边长
const SIDE_WIDTH = 100;
const SIDE_HEIGHT = 100;

function handleFoucus(isFocus, group, nodeItem) {
  if (isFocus) {
    setFocus(group, nodeItem);
  } else {
    deleteFocus(group, nodeItem);
  }
}

/**
 * 变成聚焦态样式
 * @param group
 * @param nodeItem
 */
function setFocus(group, nodeItem) {
  // 图片
  const imageShape = group.find((item) => {
    return item.cfg.name === SHAPE_TYPE.DEVICE_IMAGE_SHAPE;
  });
  const COLOR = '--color-primary';
  const { data } = nodeItem.getModel();
  const focusImage = getProductImageByAssetTypeCode(data.assetTypeCode, {
    color: cssVar(COLOR),
  });

  imageShape.attr('img', focusImage);
  imageShape.attr('shadowColor', cssVar(COLOR));
  imageShape.attr('shadowBlur', 10);

  // label
  const textShape = group.find((item) => {
    return item.cfg.name === SHAPE_TYPE.DEVICE_TEXT_SHAPE;
  });
  textShape.attr('fill', cssVar(COLOR));
  textShape.attr('shadowColor', cssVar(COLOR));
  textShape.attr('shadowBlur', 10);
}

/**
 * 变回初始样式
 * @param group
 * @param nodeItem
 */
function deleteFocus(group, nodeItem) {
  // 图片
  const imageShape = group.find((item) => {
    return item.cfg.name === SHAPE_TYPE.DEVICE_IMAGE_SHAPE;
  });
  const COLOR = '--color-text-base';
  const { data } = nodeItem.getModel();
  const defaultImage = getProductImageByAssetTypeCode(data.assetTypeCode, {
    color: cssVar(COLOR),
  });

  imageShape.attr('img', defaultImage);
  imageShape.attr('shadowColor', undefined);
  imageShape.attr('shadowBlur', undefined);

  // label
  const textShape = group.find((item) => {
    return item.cfg.name === SHAPE_TYPE.DEVICE_TEXT_SHAPE;
  });
  textShape.attr('fill', cssVar(COLOR));
  textShape.attr('shadowColor', undefined);
  textShape.attr('shadowBlur', undefined);
}

export { SIDE_WIDTH, SIDE_HEIGHT, handleFoucus };
