export function isNumber(char: string): boolean {
  return /^\d+$/.test(char);
}

export function isOperator(char: string): boolean {
  return '+,-,/,*'.includes(char);
}

export function isChar(char: string): boolean {
  let letterRegex = /^[a-zA-Z0-9]$/;
  return letterRegex.test(char);
}
