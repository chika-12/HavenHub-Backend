export class MoneyUtility {
  static toCents(value: string): number {
    const parsed = parseFloat(value);
    if (Number.isNaN(parsed)) {
      throw new Error(`${value} is not a valid price value`);
    }
    const cents = Math.round(parsed * 100);
    return cents;
  }
  static fromCents(value: number): string {
    const decimalString = (value / 100).toFixed(2);
    return decimalString;
  }
  static toBasisPoints(value: string): number {
    return MoneyUtility.toCents(value);
  }
}
