export default class Error {
  constructor(
    readonly type: string,
    readonly name: string,
    readonly message: string,
    readonly start: [number, number],
    readonly end: [number, number]
  ) {}
}
