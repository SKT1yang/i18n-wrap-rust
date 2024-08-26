function generateCssVariables(token: object) {
  let cssVariables = {};
  for (const key in token) {
    if (Object.prototype.hasOwnProperty.call(token, key)) {
      let cssKey = `--${key.replace(
        /[A-Z]/g,
        (match) => "-" + match.toLowerCase()
      )}`;
      cssVariables[cssKey] = token[key];
    }
  }
  return cssVariables;
}

export { generateCssVariables };
