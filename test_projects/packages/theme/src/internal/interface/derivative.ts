type TokenType = object;
type DerivativeFunc<
  DesignToken extends TokenType,
  DerivativeToken extends TokenType
> = (
  designToken: DesignToken,
  derivativeToken?: DerivativeToken
) => DerivativeToken;

export { type DerivativeFunc };
