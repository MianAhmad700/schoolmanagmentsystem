import { format } from 'date-fns';
import { UserPlus, CreditCard, CalendarX, Trophy } from 'lucide-react';

const activities = [
  {
    id: 1,
    title: "Mia Gordon won her match",
    description: "contributing to the team's overall victory.",
    time: "4:45 PM",
    icon: Trophy,
    color: "bg-[#FCD980] text-slate-900", // Yellow
  },
  {
    id: 2,
    title: "Liam Fiddle and 20 others signed up",
    description: "to volunteer on March 5th, Community Clean-Up Day Gains Momentum.",
    time: "Yesterday, 8:29 PM",
    icon: UserPlus,
    color: "bg-[#FCD980] text-slate-900", // Yellow
  },
  {
    id: 3,
    title: "Fee Payment Received",
    description: "Received 5000 PKR from Sara Ahmed (Class 5)",
    time: "Today, 10:30 AM",
    icon: CreditCard,
    color: "bg-[#2F80ED] text-white", // Blue
  }
];

export default function RecentActivity() {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 h-full">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-slate-800">Recent Activity</h3>
        <button className="text-blue-600 text-sm font-semibold hover:underline">View All</button>
      </div>
      
      <div className="space-y-6">
        {activities.map((activity) => (
            <div key={activity.id} className="flex gap-4">
                <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${activity.color} shadow-sm`}>
                    <activity.icon className="w-5 h-5" />
                </div>
                <div>
                    <p className="text-sm font-bold text-slate-800 leading-snug">
                        {activity.title}, <span className="font-normal text-slate-500">{activity.description}</span>
                    </p>
                    <p className="text-xs text-slate-400 mt-1">{activity.time}</p>
                </div>
            </div>
        ))}
      </div>
    </div>
  );
}
