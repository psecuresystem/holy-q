import gcd from '../../CodeAnalysis/Utils/number';
import ComplexNumber from './ComplexNumber';
import Number from './Number';

export default class RealNumber extends Number {
  constructor(
    public readonly numerator: number,
    public readonly denominator: number = 1
  ) {
    super();
  }

  toString() {
    if (this.denominator > 1) {
      return `${this.numerator}/${this.denominator}`;
    }
    return `${Math.abs(this.numerator)}`;
  }

  get sign() {
    return this.computedValue >= 0 ? '+' : '-';
  }

  get computedValue() {
    return this.numerator / this.denominator;
  }

  reduce() {
    let greatestFactor = gcd(this.numerator, this.denominator);
    return new RealNumber(
      this.numerator / greatestFactor,
      this.denominator / greatestFactor
    );
  }

  add(other: Number): Number {
    if (other instanceof ComplexNumber) {
      return ComplexNumber.fromInt(this).add(other);
    } else {
      return new RealNumber(
        this.numerator * (other as RealNumber).denominator +
          (other as RealNumber).numerator * this.denominator,
        this.denominator * (other as RealNumber).denominator
      ).reduce();
    }
  }

  subtract(other: Number): Number {
    if (other instanceof ComplexNumber) {
      return ComplexNumber.fromInt(this).subtract(other);
    } else {
      return new RealNumber(
        this.numerator * (other as RealNumber).denominator -
          (other as RealNumber).numerator * this.denominator,
        this.denominator * (other as RealNumber).denominator
      ).reduce();
    }
  }

  multiply(other: Number): Number {
    if (other instanceof ComplexNumber) {
      return ComplexNumber.fromInt(this).multiply(other);
    } else {
      return new RealNumber(
        this.numerator * (other as RealNumber).numerator,
        this.denominator * (other as RealNumber).denominator
      ).reduce();
    }
  }

  divide(other: Number): Number {
    if (other instanceof ComplexNumber) {
      return ComplexNumber.fromInt(this).multiply(other);
    } else {
      return this.multiply((other as RealNumber).inverse());
    }
  }

  inverse(): RealNumber {
    return new RealNumber(this.denominator, this.numerator).reduce();
  }

  static fromEmpty(): RealNumber {
    return new RealNumber(0);
  }
}
