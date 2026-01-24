import { MoreHorizontal } from 'lucide-react';

const events = [
    {
        id: 1,
        title: "New Student Inauguration Ceremony",
        grade: "Grade 7",
        date: "15",
        month: "July",
        time: "7:00 AM - 8:00 AM"
    },
    {
        id: 2,
        title: "Chairman of Student Body Handover",
        grade: "Grade 8",
        date: "19",
        month: "July",
        time: "10:00 AM - 11:00 AM"
    },
    {
        id: 3,
        title: "Closing of School Clubs Acceptance",
        grade: "Grade 7",
        date: "27",
        month: "July",
        time: "3:00 PM"
    }
];

export default function UpcomingEvents() {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-slate-800">Upcoming Events</h3>
        <button className="text-slate-400 hover:text-slate-600">
            <MoreHorizontal className="w-5 h-5" />
        </button>
      </div>
      
      <div className="space-y-4">
        {events.map(event => (
            <div key={event.id} className="bg-slate-50 p-4 rounded-xl flex items-start gap-4">
                <div className="flex-shrink-0 bg-[#FCD980] w-12 h-12 rounded-xl flex flex-col items-center justify-center text-slate-900 shadow-sm">
                    <span className="text-xs font-semibold">{event.month}</span>
                    <span className="text-lg font-bold leading-none">{event.date}</span>
                </div>
                <div className="flex-1">
                    <div className="flex justify-between items-start">
                         <p className="text-xs text-slate-400 mb-1">{event.time}</p>
                    </div>
                    <h4 className="font-bold text-slate-800 text-sm mb-1 leading-tight">{event.title}</h4>
                    <p className="text-xs text-blue-600 font-medium">{event.grade}</p>
                </div>
            </div>
        ))}
      </div>
    </div>
  );
}