import { formatCurrency } from '../../lib/utils';
import { TrendingUp, TrendingDown, Wallet } from 'lucide-react';
import clsx from 'clsx';

export default function FinanceSummary({ totalCollected, totalExpenses, pendingFees }) {
  const stats = [
    {
      title: 'Total Collected',
      value: totalCollected,
      icon: TrendingUp,
      color: 'text-green-600',
      bg: 'bg-green-100',
    },
    {
      title: 'Total Expenses',
      value: totalExpenses,
      icon: TrendingDown,
      color: 'text-red-600',
      bg: 'bg-red-100',
    },
    {
      title: 'Pending Fees',
      value: pendingFees,
      icon: Wallet,
      color: 'text-yellow-600',
      bg: 'bg-yellow-100',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {stats.map((stat) => (
        <div key={stat.title} className="bg-white rounded-lg shadow-sm p-6 border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">{stat.title}</p>
              <p className="mt-2 text-3xl font-bold text-slate-900">
                {formatCurrency(stat.value)}
              </p>
            </div>
            <div className={clsx("p-3 rounded-full", stat.bg)}>
              <stat.icon className={clsx("h-6 w-6", stat.color)} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
