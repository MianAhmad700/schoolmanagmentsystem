import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useState } from 'react';

const data = [
  { name: 'Jan', earnings: 40000, expenses: 24000 },
  { name: 'Feb', earnings: 30000, expenses: 13980 },
  { name: 'Mar', earnings: 60000, expenses: 38000 },
  { name: 'Apr', earnings: 47800, expenses: 39080 },
  { name: 'May', earnings: 58900, expenses: 48000 },
  { name: 'Jun', earnings: 63900, expenses: 38000 },
  { name: 'Jul', earnings: 55000, expenses: 43000 },
  { name: 'Aug', earnings: 70000, expenses: 50000 },
];

const dataQuarter = [
  { name: 'Q1', earnings: 130000, expenses: 76000 },
  { name: 'Q2', earnings: 170600, expenses: 125000 },
  { name: 'Q3', earnings: 188900, expenses: 131000 },
  { name: 'Q4', earnings: 210000, expenses: 150000 },
];

export default function RevenueChart() {
  const [filter, setFilter] = useState('Last 8 Months');
  const chartData = filter === 'Quarter' ? dataQuarter : data;

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 h-[350px]">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-bold text-slate-800">Earnings</h3>
        <select 
            className="bg-slate-50 border-none text-sm font-medium text-slate-600 rounded-lg py-1 px-3"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
        >
            <option value="Last 8 Months">Last 8 Months</option>
            <option value="Quarter">Quarter Months</option>
        </select>
      </div>
      
      <div className="flex gap-4 mb-4">
        <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-blue-500"></span>
            <span className="text-sm text-slate-500">Earnings</span>
        </div>
        <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-orange-400"></span>
            <span className="text-sm text-slate-500">Expenses</span>
        </div>
      </div>

      <ResponsiveContainer width="100%" height="75%">
        <AreaChart
          data={chartData}
          margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
        >
          <defs>
            <linearGradient id="colorEarnings" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
            </linearGradient>
            <linearGradient id="colorExpenses" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#fb923c" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#fb923c" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
          <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dy={10} />
          <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
          <Tooltip 
            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
          />
          <Area type="monotone" dataKey="earnings" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorEarnings)" />
          <Area type="monotone" dataKey="expenses" stroke="#fb923c" strokeWidth={3} fillOpacity={1} fill="url(#colorExpenses)" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
