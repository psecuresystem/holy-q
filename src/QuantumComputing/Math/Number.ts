import RealNumber from './RealNumber';

export default abstract class Number {
  abstract add(other: Number): Number;
  abstract subtract(other: Number): Number;
  abstract multiply(other: Number): Number;
  abstract divide(other: Number): Number;
  static fromEmpty(): Number {
    return new RealNumber(0);
  }
}
