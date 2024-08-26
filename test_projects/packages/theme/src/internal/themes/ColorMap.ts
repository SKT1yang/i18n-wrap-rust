import type { ColorNeutralMapToken } from "../interface";

interface ColorMap {
  1: string;
  2: string;
  3: string;
  4: string;
  5: string;
  6: string;
  7: string;
  8: string;
  9: string;
  10: string;
}

type GenerateColorMap = (baseColor: string) => ColorMap;
type GenerateNeutralColorMap = (
  bgBaseColor: string,
  textBaseColor: string
) => ColorNeutralMapToken;

export { type ColorMap, type GenerateColorMap, type GenerateNeutralColorMap };
