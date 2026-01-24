import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Mon', present: 90, absent: 10 },
  { name: 'Tue', present: 85, absent: 15 },
  { name: 'Wed', present: 95, absent: 5 },
  { name: 'Thu', present: 88, absent: 12 },
  { name: 'Fri', present: 92, absent: 8 },
];

export default function AttendanceChart() {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 h-[350px]">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-bold text-slate-800">Attendance</h3>
        <select className="bg-slate-50 border-none text-sm font-medium text-slate-600 rounded-lg py-1 px-3">
            <option>Weekly</option>
            <option>Monthly</option>
        </select>
      </div>

      <div className="flex gap-4 mb-4">
        <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-[#FCD980]"></span>
            <span className="text-sm text-slate-500">Present</span>
        </div>
        <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-[#2F80ED]"></span>
            <span className="text-sm text-slate-500">Absent</span>
        </div>
      </div>

      <ResponsiveContainer width="100%" height="75%">
        <BarChart
          data={data}
          margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
          barGap={8}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
          <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dy={10} />
          <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
          <Tooltip 
            cursor={{ fill: '#f8fafc' }}
            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
          />
          <Bar dataKey="present" fill="#FCD980" radius={[10, 10, 10, 10]} barSize={12} />
          <Bar dataKey="absent" fill="#2F80ED" radius={[10, 10, 10, 10]} barSize={12} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
