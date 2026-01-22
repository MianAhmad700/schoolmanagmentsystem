import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Jan', collected: 400000, due: 24000 },
  { name: 'Feb', collected: 300000, due: 13980 },
  { name: 'Mar', collected: 200000, due: 98000 },
  { name: 'Apr', collected: 278000, due: 39080 },
  { name: 'May', collected: 189000, due: 48000 },
  { name: 'Jun', collected: 239000, due: 38000 },
];

export default function RevenueChart() {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 h-[400px]">
      <h3 className="text-lg font-semibold text-slate-800 mb-6">Fee Collection Overview</h3>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="name" axisLine={false} tickLine={false} />
          <YAxis axisLine={false} tickLine={false} />
          <Tooltip 
            cursor={{ fill: '#f8fafc' }}
            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
          />
          <Bar dataKey="collected" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Collected" />
          <Bar dataKey="due" fill="#ef4444" radius={[4, 4, 0, 0]} name="Due" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
