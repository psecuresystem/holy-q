export function isNumber(char: string): boolean {
  return /^\d+$/.test(char);
}

export function isOperator(char: string): boolean {
  return '+,-,/,*'.includes(char);
}
