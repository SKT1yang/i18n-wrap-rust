import { SeedToken, ColorScheme, AliasToken } from "./interface";
import { seedTokenFactory } from "./themes/seed";
import defaultAlgorithm from "./themes/default";
import darkAlgorithm from "./themes/dark";
import compactAlgorithm from "./themes/compact";
import formatToken from "./utils/alias";
import getAlphaColor from "./utils/getAlphaColor";

/**
 * Seed (designer) > Derivative (designer) > Alias (developer).
 *
 * Merge seed & derivative & override token and generate alias token for developer.
 * @param seed
 */

function generateToken(seed: SeedToken) {
  const colorSchemeMode = computeColorSchemeMode(seed.colorScheme);

  const derivativeToken = Object.assign(
    generateDerivativeToken(colorSchemeMode, seed),
    { override: {} }
  );

  return formatToken(derivativeToken);
}

function generateDerivativeToken(
  colorSchemeMode: "light" | "dark",
  seed: SeedToken
) {
  // 1.处理明暗逻辑
  const derivativeTokenTemp =
    colorSchemeMode === "dark" ? darkAlgorithm(seed) : defaultAlgorithm(seed);

  // 2.处理主题key逻辑
  switch (seed.theme) {
    case "default":
      return derivativeTokenTemp;
    case "compact":
      return compactAlgorithm(seed, derivativeTokenTemp);
    default:
      return derivativeTokenTemp;
  }
}

function computeColorSchemeMode(colorScheme?: ColorScheme): "light" | "dark" {
  switch (colorScheme) {
    case "normal":
      return "light";
    case "light":
      return "light";
    case "dark":
      return "dark";
    case "dark light":
      return matches();
    case "light dark":
      return matches();
    default:
      return "light";
  }
  function matches(): "light" | "dark" {
    if (
      window.matchMedia &&
      window.matchMedia(`(prefers-color-scheme: dark)`).matches
    ) {
      return "dark";
    } else {
      return "light";
    }
  }
}

export {
  generateToken,
  computeColorSchemeMode,
  getAlphaColor,
  seedTokenFactory,
  type SeedToken,
  type AliasToken,
};
