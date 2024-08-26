import type { SeedToken, AliasToken } from "../../internal";
import { ThemeName, ColorScheme, ColorSchemeMode } from "../../type";

interface ThemeStoreItem {
  id: string;
  theme: ThemeName;
  seed: SeedToken;
  token: AliasToken | null;
}

interface ThemeChangeResponse {
  theme: ThemeName;
  colorScheme: ColorScheme;
  colorSchemeMode: ColorSchemeMode;
}

type ThemeEventName = "change";

export type { ThemeStoreItem, ThemeChangeResponse, ThemeEventName };
