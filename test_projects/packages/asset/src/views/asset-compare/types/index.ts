import type { IAsset } from '@guolisec/types';

type CompareAsset = Partial<
  IAsset & {
    assetIpMark: boolean;
    assetMacMark: boolean;
    nameMark: boolean;
    assetTypeNameMark: boolean;
    trademarkNameMark: boolean;
    assetSeriesNameMark: boolean;
  }
>;

export type { CompareAsset };
