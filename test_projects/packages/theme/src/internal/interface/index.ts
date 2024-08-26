import type { AliasToken } from "./alias";

/** Final token which contains the components level override */
export type GlobalToken = AliasToken;

export { PresetColors } from "./presetColors";
export type {
  PresetColorType,
  ColorPalettes,
  PresetColorKey,
} from "./presetColors";
export type { SeedToken } from "./seeds";
export type {
  MapToken,
  ColorMapToken,
  ColorNeutralMapToken,
  CommonMapToken,
  HeightMapToken,
  SizeMapToken,
  FontMapToken,
  StyleMapToken,
  ColorScheme,
  ColorSchemeMode,
} from "./maps";
export type { AliasToken } from "./alias";
export type { DerivativeFunc } from "./derivative";
