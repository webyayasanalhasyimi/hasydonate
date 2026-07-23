import { type ReportDistributionItemDto } from "../../types";

export function aggregateDistribution<T extends string>(
  groups: ReadonlyArray<{ readonly id: T; readonly count: number; readonly amount: number }>,
  labelMapper: (id: T) => string
): readonly ReportDistributionItemDto[] {
  const totalAmount = groups.reduce((acc, g) => acc + g.amount, 0);

  return groups.map((g) => {
    const pct = totalAmount > 0 ? (g.amount / totalAmount) * 100 : 0;
    return {
      id: g.id,
      label: labelMapper(g.id),
      count: g.count,
      amount: g.amount,
      percentage: parseFloat(pct.toFixed(1)),
    };
  });
}
export type AggregateDistributionType = typeof aggregateDistribution;
