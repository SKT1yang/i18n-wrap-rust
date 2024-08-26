/*
 * @name: Do not edit
 * @description: Do not edit
 * @date: 2023-07-05 12:19:58
 * @path: \theme\src\internal\interface\maps\meta.ts
 */
import { ThemeName, ColorScheme, ColorSchemeMode } from "../../../type";

interface MetaMapToken {
  /**
   * @nameZH 主题名
   * @nameEN Theme
   * @desc 唯一主题key, 不同主题的本质区别是对SeedToken的处理方法不同，生成的派生token(一般是key相同但值不同)不同
   * @descEN
   */
  theme: ThemeName;
  //  ----------   Color   ---------- //
  /**
   * @nameZH 明暗配置
   * @nameEN Color Scheme
   * @desc 配置系统明暗主题，可选值： "normal" | "light" | "dark" | "light dark" | "dark light"
   * @descEN
   */
  colorScheme: ColorScheme;
}

export {
  type MetaMapToken,
  type ThemeName,
  type ColorScheme,
  type ColorSchemeMode,
};
